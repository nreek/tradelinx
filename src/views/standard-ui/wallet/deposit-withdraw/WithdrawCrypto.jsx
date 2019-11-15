import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { withdrawCryptoFields } from '../../../../../config/formConfig';
import { makeWithdrawal, withdrawalRequestPending } from '../../../../actions';
import { selectExchangeSettings, selectWithdrawal, selectBalances } from '../../../../reducers';
import { status } from '../../../../constants/statuses';

// Components
import Button from '../../../../elements/Button';
import Form from '../../../../elements/form-controls/Form';
import FormContainer from '../../../../elements/FormContainer';
import Submit from '../../../../elements/form-controls/Submit';
import TextInput from '../../../../elements/form-controls/TextInput';

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
  t: 'WITHDRAW_CRYPTO',
  currency: { balance: 0 },
  withdrawal: {},
  exchangeSettings: {},
  makeWithdrawal: () => {},
  withdrawalRequestPending: () => {},
  onClose: () => {},
};

export class WithdrawCrypto extends Component {
  state = { flowStep: 'form', twoFaCode: '', withdrawData: {}, fields: {} };

  componentWillUnmount() {
    this.props.withdrawalRequestPending();
  }

  onSubmit = (formData) => {
    const { exchangeSettings, currency } = this.props;
    const { twoFaCode, withdrawData } = this.state;
    if (
      exchangeSettings.withdrawal_2fa_enabled
      && !this.state.twoFaCode
    ) {
      this.setState({
        flowStep: 'twoFa',
        withdrawData: {
          currency_id: currency.id,
          ...formData,
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
        ...formData,
      });
    }
  };

  setWithdrawPercentage = (percentage) => {
    const { currency } = this.props;
    const balance = this.props.balances[currency.id];

    const Amount = (+balance.withdrawal * percentage).toFixed(currency.decimals)
    this.setState({ fields: { Amount } });
  }

  renderForm = () => {
    const { currency, t } = this.props;
    const balance = this.props.balances[currency.id];
    return (
      <Fragment>
        <div className='crypto-product withdraw-crypto-row'>
          <h2 className='crypto-product-title row-title'>{_t('Withdraw', 'GENERIC.WITHDRAW')}</h2>
          <div className='crypto-product-name'>
            <img alt='' className={`currency-icon ${currency.id}-icon`} src={`images/icons/currency-icons/black/${currency.id}.svg`} />
            <h2>{currency.name}</h2>
          </div>
        </div>
        <div className='crypto-balance withdraw-crypto-row'>
          <h2 className='crypto-balance-title row-title'>{_t('Balance', 'WITHDRAW_CRYPTO.BALANCE')}</h2>
          <p className='crypto-balance-value'>{balance.withdrawal}</p>
        </div>
        <FormContainer
          key={`withdraw-${currency.id}-form`}
          fields={withdrawCryptoFields}
          className="withdraw-crypto-form"
          translation={t}
          submitText={_t('Withdraw', `GENERIC.WITHDRAW`)}
          onSubmit={this.onSubmit}
          setValue={this.state.fields}
          validationData={{ currency: currency.id }}
        />
        <div className='percent-selector'>
          <div>
            <span className='secondary-button' onClick={() => this.setWithdrawPercentage(.25)}>
              25%
            </span>
            <span className='secondary-button' onClick={() => this.setWithdrawPercentage(.5)}>
              50%
            </span>
            <span className='secondary-button' onClick={() => this.setWithdrawPercentage(.75)}>
              75%
            </span>
            <span className='secondary-button' onClick={() => this.setWithdrawPercentage(1)}>
              {_t('Max', 'WITHDRAW_CRYPTO.MAX')}
            </span>
          </div>
        </div>
      </Fragment>
    );
  }

  render2Fa = () => {
    const { twoFaCode } = this.state;
    return (
      <Fragment>
        <p>
          {_t(
            'Enter your 2FA code to confirm your withdrawal request.',
            'WITHDRAW_CRYPTO.2FA_INSTRUCTIONS',
          )}
        </p>
        {this.render2FaError()}
        <Form onSubmit={this.onSubmit}>
          <TextInput
            name="2FA Code"
            onChange={e => this.setState({ twoFaCode: e.target.value })}
            value={twoFaCode}
          />
          <Submit onSubmit={this.onSubmit} />
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
                'WITHDRAW_CRYPTO.2FA_INVALID',
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
            'WITHDRAW_CRYPTO.CONFIRMATION',
          )}
        </p>
        {/* <Button
          onClick={() => {
            this.props.withdrawalRequestPending();
            onClose();
          }}
        >
          {_t('Close', 'BUTTON.CLOSE')}
        </Button> */}
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
  balances: selectBalances(state),
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
