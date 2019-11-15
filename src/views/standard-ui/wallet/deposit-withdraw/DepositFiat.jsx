import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { depositFiatFields } from '../../../../../config/formConfig';

// Redux
import { makeDeposit, depositRequestPending } from '../../../../actions';
import { selectCurrentTransaction, selectDeposit } from '../../../../reducers';
import { status } from '../../../../constants/statuses';

// Components
import Button from '../../../../elements/Button';
import FormContainer from '../../../../elements/FormContainer';

export class DepositFiat extends Component {
  componentWillUnmount() {
    this.props.depositRequestPending();
  }

  onSubmit = (formData) => {
    this.props.makeDeposit(this.props.currency.id, formData.amount);
  };

  renderDepositStatus = () => {
    const { currency } = this.props;

    if (
      this.props.deposit.request === status.success
      && this.props.currentTransaction.status === 'pending'
      && this.props.deposit.id === this.props.currentTransaction.id
    ) {
      return (
        <Fragment>
          <p className='success-message'>
            {_t(
              'Your deposit request has successfully been submitted. Funds will appear in your account after the deposit clears.',
              'DEPOSIT_FIAT.SUBMIT_SUCCESS',
            )}
          </p>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <div className='fiat-product deposit-fiat-row'>
          <h2 className='fiat-product-title row-title'>{_t('Deposit', 'GENERIC.DEPOSIT')}</h2>
          <div className='fiat-product-name'>
            <img alt='' className={`currency-icon ${currency.id}-icon`} src={`images/icons/currency-icons/black/${currency.id}.svg`} />
            <h2>{currency.name}</h2>
          </div>
        </div>

        <div className='fiat-bank-details'>
          <p>{_t('Bank Name', 'DEPOSIT_FIAT.INFO_1')}</p>
          <p>
            {_t('Name on Account', 'DEPOSIT_FIAT.INFO_2')}
          </p>
          <p>
            {_t('Account Number', 'DEPOSIT_FIAT.INFO_3')}
          </p>
          <p>{_t('SWIFT Number', 'DEPOSIT_FIAT.INFO_4')}</p>
        </div>

        <FormContainer
          key={`deposit-${currency.id}-form`}
          fields={depositFiatFields}
          className="deposit-fiat-form"
          translation="DEPOSIT_FIAT"
          submitText={_t('Submit', 'BUTTON.SUBMIT')}
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
    deposit: selectDeposit(state) || {},
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
