import React, { Component } from 'react';

import { connect } from 'react-redux';
import {
  getTransactionsList,
  loadTransactions,
  getCompletedTransactionsList,
  loadOrderEvents,
  orderEventsFinished,
} from '../../actions';
import { finishedLoadingOrders, orderEventTimeStamp } from '../../reducers';
import ErrorBoundary from '../../elements/ErrorBoundary';

import AccountHistory from './my-accounts/AccountHistory';
import CurrentBalances from './my-accounts/CurrentBalances';
import RecentTransactions from './my-accounts/RecentTransactions';
import MyAccountsTablesContainer from './my-accounts/MyAccountsTablesContainer';
import SimpleUiWrapper from './SimpleUiWrapper';
import TransactionModal from './my-accounts/TransactionModal';

const START_TIME = 'start_time';
const DEFAULT_START_TIME = 0;

export class MyAccounts extends Component {
  state = {
    modal: '',
    currency: '',
  };

  componentDidMount() {
    this.props.loadTransactions();
    this.props.getTransactionsList();
    this.props.getCompletedTransactionsList({
      [START_TIME]: DEFAULT_START_TIME,
    });
    this.props.loadData();
  }

  componentDidUpdate() {
    const { finishedLoadingOrders, orderEventTimeStamp, loadData } = this.props;
    if (finishedLoadingOrders === false) {
      loadData(orderEventTimeStamp);
    }
  }

  componentWillUnmount() {
    this.props.orderEventsFinished(false);
  }

  showModal = (currencyType, currencySelected) => {
    this.setState({
      modal: currencyType,
      currency: currencySelected,
    });
  };

  renderModal = () => {
    if (this.state.modal) {
      return (
        <TransactionModal
          transactionType={this.state.modal}
          currency={this.state.currency}
          showModal={() => this.showModal('', '')}
        />
      );
    }
    return null;
  };

  render() {
    return (
      <SimpleUiWrapper title={_t('My Accounts', 'MY_ACCOUNTS.TITLE')} pageClass="my-accounts" pageHeader="" description="">
        <ErrorBoundary>
          <CurrentBalances modal={this.state.modal} showModal={this.showModal} />
        </ErrorBoundary>
        <div className="component my-accounts-table" id="my-accounts-table">
          <ErrorBoundary>
            <MyAccountsTablesContainer />
          </ErrorBoundary>
        </div>
        {this.renderModal()}
      </SimpleUiWrapper>
    );
  }
}

const mapStateToProps = state => ({
  finishedLoadingOrders: finishedLoadingOrders(state),
  orderEventTimeStamp: orderEventTimeStamp(state),
});

const mapDispatchToProps = dispatch => ({
  getTransactionsList: () => dispatch(getTransactionsList()),
  loadTransactions: () => dispatch(loadTransactions()),
  getCompletedTransactionsList: data => dispatch(getCompletedTransactionsList(data)),
  loadData: orderEventTimeStamp => dispatch(loadOrderEvents(orderEventTimeStamp)),
  orderEventsFinished: payload => dispatch(orderEventsFinished(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyAccounts);
