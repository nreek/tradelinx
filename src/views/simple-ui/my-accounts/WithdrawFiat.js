import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { withdrawFiatFields } from '../../../../config/formConfig';

import { makeWithdrawal, withdrawalRequestPending } from '../../../actions';
import { selectCurrentTransaction, selectExchangeSettings, selectWithdrawal } from '../../../reducers';
import { status } from '../../../constants';

// Components
import Button from '../../../elements/Button';
import FormContainer from '../../../elements/FormContainer';

export class WithdrawFiat extends Component {
  componentWillUnmount() {
    this.props.withdrawalRequestPending();
  }

  onSubmit = (formData) => {
    const data = {
      amount: formData.amount,
      currency_id: this.props.currency.id,
      code: formData.verificationCode,
    };
    this.props.makeWithdrawal(data);
  };

  renderForm = () => {
    const withdrawFields = [...withdrawFiatFields];
    if (this.props.exchangeSettings.withdrawal_2fa_enabled) {
      withdrawFields.push({
        name: 'Verification Code',
        type: 'text',
        required: true,
      });
    }

    return (
      <FormContainer
        key="withdraw-fiat-form"
        fields={withdrawFields}
        className="withdraw-fiat-form"
        translation="WITHDRAW_FIAT"
        submitText={_t('Submit', 'WITHDRAW_FIAT.WITHDRAW')}
        onSubmit={this.onSubmit}
        buttons={[
          { name: 'Close', onClick: () => this.props.showModal('none') },
        ]}
        validationData={{ currency: this.props.currency.id, }}
      />
    );
  };

  renderConfirmation = () => (
    <Fragment>
      <p>
        {_t(
          'Your withdrawal request has successfully been submitted.',
          'WITHDRAW_FIAT_MODAL',
        )}
      </p>
      <div className="action-button">
        <Button onClick={() => this.props.showModal('none')}>
          {_t('Close', 'WITHDRAW_FIAT.CLOSE')}
        </Button>
      </div>
    </Fragment>
  );

  renderError = () => (
    <Fragment>
      <p>
        {_t(
          'There was an error with your request. Please close and try again.',
          'WITHDRAW_FIAT.ERROR',
        )}
      </p>
      <div className="action-button">
        <Button onClick={() => this.props.showModal('none')}>
          {_t('Close', 'WITHDRAW_FIAT.CLOSE')}
        </Button>
      </div>
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
});

const mapDispatchToProps = dispatch => ({
  makeWithdrawal: withdrawalRequest => dispatch(makeWithdrawal(withdrawalRequest)),
  withdrawalRequestPending: () => dispatch(withdrawalRequestPending()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WithdrawFiat);
