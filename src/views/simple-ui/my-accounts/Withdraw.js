import React, { Component } from 'react';
import { connect } from 'react-redux';
import { makeWithdrawal } from '../../../actions';

// Components
import Form from '../../../elements/form-controls/Form';
import TextInput from '../../../elements/form-controls/TextInput';
import Button from '../../../elements/Button';

export class Withdraw extends Component {
  state = {
    amount: '',
    address: '',
  };

  withdraw = () => {
    this.props.makeWithdrawal({
      currency_id: this.props.currency,
      amount: this.state.amount,
      address: this.state.amount,
    });
  };

  render() {
    return (
      <Form onSubmit={this.withdraw}>
        <TextInput
          onChange={e => this.setState({ amount: e.target.value })}
          name="Amount"
          value={this.state.amount}
        />
        <TextInput
          onChange={e => this.setState({ address: e.target.value })}
          name="Address"
          value={this.state.address}
        />
        <Button type="submit">{_t('Withdraw', 'WITHDRAW.SUBMIT')}</Button>
      </Form>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  makeWithdrawal: withdrawalRequest => dispatch(makeWithdrawal(withdrawalRequest)),
});

export default connect(
  null,
  mapDispatchToProps,
)(Withdraw);
