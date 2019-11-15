import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { withdrawFiatFields } from '../../../../../config/formConfig';

import { makeWithdrawal, withdrawalRequestPending } from '../../../../actions';
import { selectCurrentTransaction, selectExchangeSettings, selectWithdrawal, selectBalances } from '../../../../reducers';
import { status } from '../../../../constants/statuses';

// Components
import Button from '../../../../elements/Button';
import FormContainer from '../../../../elements/FormContainer';

export class WithdrawFiat extends Component {
  state = {
    messages: {}
  }

  componentDidUpdate(prevProps) {
    if(prevProps.withdrawal.request === 'PENDING' && this.props.withdrawal.request === 'FAILED') {
      this.setMessage('error', this.props.withdrawal.message);
    }
  }

  componentWillUnmount() {
    this.props.withdrawalRequestPending();
    this.resetMessage && clearTimeout(this.resetMessage);
  }

  onSubmit = (formData) => {
    const data = {
      amount: formData.amount,
      currency_id: this.props.currency.id,
      code: formData.verificationCode,
    };
    this.props.makeWithdrawal(data);
  };

  setMessage(type, message) {
    const { messages } = this.state;
    messages[type] = message;
    this.setState({ messages });

    this.resetMessage = setTimeout(() => {
      messages[type] = '';
      this.setState({ messages });
    }, 3000);
  }

  renderForm = () => {
    const { currency, balances } = this.props;
    const { messages } = this.state;
    const balance = balances[currency.id];

    const withdrawFields = [...withdrawFiatFields];
    if (this.props.exchangeSettings.withdrawal_2fa_enabled) {
      withdrawFields.push({
        name: _t('2FA Code', 'WITHDRAW_FIAT.2FA_CODE'),
        type: 'text',
        required: true,
      });
    }

    return (
      <Fragment>
        <div className='fiat-product withdraw-fiat-row'>
          <h2 className='fiat-product-title row-title'>{_t('Withdraw', 'GENERIC.WITHDRAW')}</h2>
          <div className='fiat-product-name'>
            <img alt='' className={`currency-icon ${currency.id}-icon`} src={`images/icons/currency-icons/black/${currency.id}.svg`} />
            <h2>{currency.name}</h2>
          </div>
        </div>

        <div className='fiat-balance withdraw-fiat-row'>
          <h2 className='fiat-balance-title row-title'>{_t('Balance', 'WITHDRAW_FIAT.BALANCE')}</h2>
          <p className='fiat-balance-value'>{balance.withdrawal}</p>
        </div>

        <FormContainer
          key={`withdraw-${currency.id}-form`}
          fields={withdrawFields}
          className="withdraw-fiat-form"
          translation="WITHDRAW_FIAT"
          submitText={_t('Submit', 'BUTTON.SUBMIT')}
          onSubmit={this.onSubmit}
        />

        <div className='fiat-message-container'>
          {messages.error &&
            <p className='error-message'>{messages.error}</p>
          }
        </div>
      </Fragment>
    );
  };

  renderConfirmation = () => (
    <Fragment>
      <p className='success-message'>
        {_t(
          'Your withdrawal request has successfully been submitted.',
          'WITHDRAW_FIAT.SUBMIT_SUCCESS',
        )}
      </p>
    </Fragment>
  );

  renderError = () => (
    <Fragment>
      <p className='error-message'>
        {_t(
          'There was an error with your request. Please try again.',
          'WITHDRAW_FIAT.GENERAL_ERROR',
        )}
      </p>
    </Fragment>
  );

  renderWithdrawalStatus = () => {
    if (this.props.withdrawal.request === status.success) {
      return this.renderConfirmation();
    } if (this.props.withdrawal.request === status.error) {
      return this.renderError();
    }
    return this.renderForm();
  };

  // TODO: Capturing account info pending Deltix support
  render() {
    return this.renderWithdrawalStatus();
  }
}

const mapStateToProps = state => ({
  currentTransaction: selectCurrentTransaction(state),
  exchangeSettings: selectExchangeSettings(state),
  withdrawal: selectWithdrawal(state),
  balances: selectBalances(state),
});

const mapDispatchToProps = dispatch => ({
  makeWithdrawal: withdrawalRequest => dispatch(makeWithdrawal(withdrawalRequest)),
  withdrawalRequestPending: () => dispatch(withdrawalRequestPending()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WithdrawFiat);
