import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeDeposit, } from '../../../actions'; // TODO: setDepositReady doesn't exist?

// Components
import Button from '../../../elements/Button';
import Form from '../../../elements/form-controls/Form';
import TextInput from '../../../elements/form-controls/TextInput';

export class Deposit extends Component {
  state = { amount: '' };

  deposit = () => {
    this.props.makeDeposit(this.props.currency, this.state.amount);
  };

  renderForm = () => (
    <Form className="deposit-form" onSubmit={this.deposit}>
      <div className="amount-input">
        <TextInput
          onChange={e => this.setState({ amount: e.target.value })}
          name="Amount"
          value={this.state.amount}
        />
      </div>
      <div>
        <Button
          // disabled={!this.state.amount}
          loading
          loadingStatus={this.props.deposit.status === 'pending'}
          type="submit"
        >
          {_t('Make Deposit', 'DEPOSIT.SUBMIT')}
        </Button>
      </div>
    </Form>
  );

  renderSuccess = () => (
    <div className="success">
      <div className="success-message">
        <p>
          {_t(
            'Your deposit ticket has been successfully submitted.',
            'DEPOSIT.SUCCESS',
          )}
        </p>
      </div>
      <Button onClick={this.props.onClose}>
        {_t('Close', 'DEPOSIT.CLOSE')}
      </Button>
    </div>
  );

  renderError = () => {
    let error;
    if (this.props.deposit.statusCode === 'verification_code_mandatory') {
      error = this.twoFaError;
    } else {
      error = this.generalError;
    }
    return <div className="error">{error()}</div>;
  };

  twoFaError = () => (
    <Fragment>
      <div className="error-message">
        <p>
          {_t(
            '2-Factor Authentication is required to make a deposit. ',
            'DEPOSIT.ERROR_2FA_1',
          )}
          <Link to="/settings">
            {_t('Click here to enable.', 'DEPOSIT.ERROR_2FA_2')}
          </Link>
        </p>
      </div>
      <div className="action-buttons">
        <Button
          onClick={() => {
            // this.props.setDepositReady();
            this.props.history.push('/settings');
          }}
        >
          {_t('Turn On 2FA', 'DEPOSIT.TURN_ON_2FA')}
        </Button>
        <Button onClick={this.props.onClose}>
          {_t('Close', 'DEPOSIT.CLOSE')}
        </Button>
      </div>
    </Fragment>
  );

  generalError = () => (
    <Fragment>
      <div className="error-message">
        <p>
          {_t(
            'There was an error with your deposit, please try again.',
            'DEPOSIT.ERROR.GENERAL',
          )}
        </p>
      </div>
      <Button onClick={this.props.onClose}>
        {_t('Close', 'DEPOSIT.CLOSE')}
      </Button>
    </Fragment>
  );

  renderFlowStep = () => {
    const flow = {
      form: this.renderForm,
      success: this.renderSuccess,
      error: this.renderError,
    };
    if (this.props.deposit.status === 'accepted') {
      return flow.success();
    } if (this.props.deposit.status === 'rejected') {
      return flow.error();
    }
    return flow.form();
  };

  render() {
    return <div className="deposit-modal">{this.renderFlowStep()}</div>;
  }
}

const mapStateToProps = ({ deposit }) => ({
  deposit,
});

const mapDispatchToProps = dispatch => ({
  makeDeposit: (product, amount) => dispatch(makeDeposit(product, amount)),
  // setDepositReady: () => dispatch(setDepositReady()),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Deposit),
);
