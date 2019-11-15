import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { withdrawCryptoFields } from '../../../../config/formConfig';
import { makeWithdrawal, withdrawalRequestPending } from '../../../actions';
import { selectExchangeSettings, selectWithdrawal } from '../../../reducers';
import { status } from '../../../constants';

// Components
import Button from '../../../elements/Button';
import Form from '../../../elements/form-controls/Form';
import FormContainer from '../../../elements/FormContainer';
import Submit from '../../../elements/form-controls/Submit';
import TextInput from '../../../elements/form-controls/TextInput';

// Helpers
import { formatNumberToLocale, roundTo, toCamelCase } from '../../../util/helpers';

const propTypes = {
  t: PropTypes.string,
  currency: PropTypes.instanceOf(Object),
  exchangeSettings: PropTypes.instanceOf(Object),
  withdrawal: PropTypes.instanceOf(Object),
  makeWithdrawal: PropTypes.instanceOf(Function),
  withdrawalRequestPending: PropTypes.instanceOf(Function),
  onClose: PropTypes.instanceOf(Function),
};

const defaultProps = {
  t: 'WITHDRAW',
  currency: { balance: 0 },
  withdrawal: {},
  exchangeSettings: {},
  makeWithdrawal: () => {},
  withdrawalRequestPending: () => {},
  onClose: () => {},
};

export class WithdrawCrypto extends Component {
  state = { 
    flowStep: 'form', 
    twoFaCode: '', 
    withdrawData: {},
    netAmount: 0,
    fee: 0,
    setValue: null,
  };

  withdrawFields = [];

  componentWillMount() {
    if (this.props.currency.id === 'XRP') {
      this.withdrawFields = [
        ...withdrawCryptoFields,
        {
          name: 'Destination Tag',
          type: 'text',
          required: true,
          translation: 'WITHDRAW.DESTINATION_TAG',
        },
      ];
    } else {
      this.withdrawFields = [ ...withdrawCryptoFields ];
    }
  }

  componentWillUnmount() {
    this.props.withdrawalRequestPending();
  }

  handleInputChange = (fields) => {
    const { withdrawData } = this.state;
    const { currency } = this.props;
    let addressParsed = false;

    Object.entries(fields).forEach(([fieldName, fieldInfo]) => {
      if (currency.id !== 'XRP') {
        withdrawData[toCamelCase(fieldName)] = fieldInfo.value;
      } else {
        if (fieldName === 'Address') {
          let addressSplit = fieldInfo.value.split('?dt=');
          withdrawData.address = addressSplit[0];
          if (addressSplit[1]) {
            withdrawData.destinationTag = addressSplit[1];
            addressParsed = true;
            const setValue = {
              'Address': withdrawData.address,
              'Destination Tag': withdrawData.destinationTag
            }
            this.setState({ setValue }, () => this.setState({ setValue: null }));
          }
        } else if (fieldName === 'Destination Tag' && addressParsed) {
          withdrawData.destinationTag = withdrawData.destinationTag;
        } else {
          withdrawData[toCamelCase(fieldName)] = fieldInfo.value;
        }
      }
    })

    this.setState({ withdrawData }, () => {
      this.calculateFee();
    });
  }

  calculateFee = () => {
    const { withdrawalCommission, decimals } = this.props.currency;
    const amount = +this.state.withdrawData.amount;
    if (amount || amount === 0) {
      const feeRate = +withdrawalCommission / 100;

      let netAmount = amount / (1 + feeRate);
      netAmount = roundTo(netAmount, decimals, 'down');

      let fee = amount - netAmount;
      fee = roundTo(fee, decimals);

      this.setState({ fee, netAmount });
    }
  }

  onSubmit = (formData) => {
    const { exchangeSettings, currency } = this.props;
    const { twoFaCode, withdrawData, netAmount } = this.state;
    let { address, destinationTag } = formData;

    const amount = netAmount.toString();

    if (currency.id === 'XRP') {
      address = [ address, destinationTag ].join('?dt=');
    }

    if (
      exchangeSettings.withdrawal_2fa_enabled
      && !this.state.twoFaCode
    ) {
      this.setState({
        flowStep: 'twoFa',
        withdrawData: {
          currency_id: currency.id,
          amount,
          address,
        },
      });
    } else if (
      exchangeSettings.withdrawal_2fa_enabled
      && twoFaCode
    ) {
      this.props.makeWithdrawal({
        ...withdrawData,
        code: twoFaCode,
      });
    } else {
      this.props.makeWithdrawal({
        currency_id: currency.id,
        amount,
        address
      });
    }
  };

  renderForm = () => {
    const { currency, t } = this.props;
    const { netAmount, fee, setValue } = this.state;
    return (
      <Fragment>
        <h3>
          {_t(
            'Please read the instructions below',
            'WITHDRAW.CRYPTO_INSTRUCTIONS_HEADING',
          )}
        </h3>
        <p
          dangerouslySetInnerHTML={{
            __html: _t(
              'You have: <span>{balance} {currency}</span> available for withdraw. Note: The total available to withdraw is the result of Balance minus Fee.',
              'WITHDRAW.CRYPTO_INSTRUCTIONS_1',
              {
                currency: currency.name,
                balance: currency.balance,
              },
            ),
          }}
        />
        <p>
          {_t(
            'Please double check the address before starting the withdraw process. Your transaction will be processed immediately. Network confirmations may take up to 1 hour.',
            'WITHDRAW.CRYPTO_INSTRUCTIONS_2',
          )}
        </p>
        <div className='form-container-wrapper'>
          <FormContainer
            key="withdraw-fiat-form"
            fields={this.withdrawFields}
            className="withdraw-fiat-form"
            translation={t}
            submitText={_t('Process Withdraw', `${t}.WITHDRAW`)}
            onChange={this.handleInputChange}
            onSubmit={this.onSubmit}
            validationData={{ currency: currency.id, }}
            setValue={setValue}
          />
          <div className='breakdown-container'>
            <p className='net-amount'>
              <span>{_t('To Receive', 'WITHDRAW.CRYPTO_TO_RECEIVE')}:</span> 
              <span>{netAmount} {currency.id}</span>
            </p>
            <p className='fee'>
              <span>{_t('Fee', 'WITHDRAW.CRYPTO_FEE')}:</span>
              <span>{fee} {currency.id}</span>
            </p>
          </div>
        </div>
      </Fragment>
    );
  }

  render2Fa = () => {
    const { twoFaCode, } = this.state;
    return (
      <Fragment>
        <p>
          {_t(
            'Enter your 2FA code to confirm your withdrawal request.',
            'WITHDRAW.2FA_INSTRUCTIONS',
          )}
        </p>
        {this.render2FaError()}
        <Form onSubmit={this.onSubmit}>
          <TextInput
            name="2FA Code"
            onChange={e => this.setState({ twoFaCode: e.target.value, })}
            value={twoFaCode}
          />
          <br />
          <Button 
            disabled={!twoFaCode.length}
            onClick={this.onSubmit}>{_t('Submit', 'BUTTON.SUBMIT')}</Button>
        </Form>
      </Fragment>
    );
  }

  render2FaError = () => {
    const { withdrawal } = this.props;
    return (
      <div className="withdraw-2fa-error">
        {withdrawal.request === status.failed
          && withdrawal.statusCode === 'invalid_verification_code' ? (
            <p>
              {_t(
                'You have entered an invalid 2FA Code. Please check and try again.',
                'WITHDRAW.INVALID_2FA',
              )}
            </p>
          ) : null}
      </div>
    );
  }

  renderConfirmation = () => {
    const { onClose } = this.props;
    return (
      <Fragment>
        <p>
          {_t(
            'Your withdrawal has successfully been initiated.',
            'WITHDRAW.CONFIRMATION',
          )}
        </p>
        <br />
        <Button
          onClick={() => {
            this.props.withdrawalRequestPending();
            onClose();
          }}
        >
          {_t('Close', 'WITHDRAW.CLOSE')}
        </Button>
      </Fragment>
    );
  }

  renderFlowStep = () => {
    const { withdrawal } = this.props;
    const { flowStep } = this.state;
    const step = {
      form: this.renderForm,
      twoFa: this.render2Fa,
      confirmation: this.renderConfirmation,
    };

    if (withdrawal.request === status.success) {
      return step.confirmation();
    }
    return step[flowStep]();
  };

  render() {
    return this.renderFlowStep();
  }
}

const mapStateToProps = state => ({
  exchangeSettings: selectExchangeSettings(state),
  withdrawal: selectWithdrawal(state),
});

const mapDispatchToProps = dispatch => ({
  makeWithdrawal: withdrawalRequest => dispatch(makeWithdrawal(withdrawalRequest)),
  withdrawalRequestPending: () => dispatch(withdrawalRequestPending()),
});

WithdrawCrypto.propTypes = propTypes;
WithdrawCrypto.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WithdrawCrypto);
