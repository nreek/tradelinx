import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { depositFiatFields } from '../../../../config/formConfig';

// Redux
import { makeDeposit, depositRequestPending } from '../../../actions';
import { selectCurrentTransaction, selectDeposit } from '../../../reducers';
import { status } from '../../../constants';

// Components
import Button from '../../../elements/Button';
import FormContainer from '../../../elements/FormContainer';

export class DepositFiat extends Component {
  componentWillUnmount() {
    this.props.depositRequestPending();
  }

  onSubmit = (formData) => {
    this.props.makeDeposit(this.props.currency.id, formData.amount);
  };

  renderDepositStatus = () => {
    if (
      this.props.deposit.request === status.success
      && this.props.currentTransaction.status === 'pending'
      && this.props.deposit.id === this.props.currentTransaction.id
    ) {
      return (
        <Fragment>
          <p>
            {_t(
              'Your deposit request has successfully been submitted. Funds will appear in your account after the deposit clears.',
              'DEPOSIT_FIAT_MODAL',
            )}
          </p>
          <div className="action-button">
            <Button onClick={() => this.props.showModal('none')}>
              {_t('Close', 'DEPOSIT_FIAT_MODAL.CLOSE')}
            </Button>
          </div>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <p>{_t('DEPOSIT.BANK_USD', 'DEPOSIT_FIAT_MODAL.DEPOSIT_INFO_ONE')}</p>
        <p>
          {_t('DEPOSIT.ACCOUNT_NAME', 'DEPOSIT_FIAT_MODAL.DEPOSIT_INFO_TWO')}
        </p>
        <p>
          {_t('DEPOSIT.ACCOUNT_#', 'DEPOSIT_FIAT_MODAL.DEPOSIT_INFO_THREE')}
        </p>
        <p>{_t('DEPOSIT.SWIFT', 'DEPOSIT_FIAT_MODAL.DEPOSIT_INFO_FOUR')}</p>

        <FormContainer
          key="deposit-fiat-form"
          fields={depositFiatFields}
          className="deposit-fiat-form"
          translation="DEPOSIT_FIAT_MODAL"
          submitText={_t('Submit', 'DEPOSIT_FIAT_MODAL.DEPOSIT')}
          buttons={[
            { name: 'Close', onClick: () => this.props.showModal('none') },
          ]}
          onSubmit={this.onSubmit}
        />
      </Fragment>
    );
  };

  render() {
    return this.renderDepositStatus();
  }
}

const mapStateToProps = (state) => {
  let currentTransaction = selectCurrentTransaction(state);
  if (!currentTransaction) {
    currentTransaction = {};
  }
  return {
    deposit: selectDeposit(state),
    currentTransaction,
  };
};

const mapDispatchToProps = dispatch => ({
  depositRequestPending: () => dispatch(depositRequestPending()),
  makeDeposit: (product, amount) => dispatch(makeDeposit(product, amount)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DepositFiat);
