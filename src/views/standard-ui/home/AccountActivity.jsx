import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadOrderEvents, loadTransactions, getTransactionsList, getCompletedTransactionsList, loadOrders } from '../../../actions';
import { 
  selectSelectedInstrumentId, 
  selectOpenOrders, 
  selectFilledOrders, 
  selectTransactions,
  selectInstruments,
} from '../../../reducers';
import { getFormattedDate, capitalize, toSnakeCase } from '../../../util/helpers';

import PerfectScrollbar from 'react-perfect-scrollbar';

class AccountActivity extends Component {
  state = {
    data: []
  }

  // selects icons based on activity type
  iconMap = {
    buy: <i className='far fa-arrow-down' />,
    sell: <i className='far fa-arrow-up' />,
    deposit: <i className='fas fa-university' />,
    withdraw: <i className='fas fa-wallet' />
  }

  componentDidMount() {
    // TODO: possibly find out why this timeout is necessary for the transactions to actually load on first page load
    setTimeout(() => {
      this.props.loadTransactions();
      this.props.getTransactionsList();
      this.props.getCompletedTransactionsList({
        start_time: 0,
      });
    }, 1);

    this.compileAccountActivity();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.transactions.length !== prevProps.transactions.length ||
      this.props.openOrders.length !== prevProps.openOrders.length ||
      this.props.filledOrders.length !== prevProps.filledOrders.length
    ) {
      this.compileAccountActivity();
    }
  }

  compileAccountActivity() {
    const { transactions, openOrders, filledOrders, instruments } = this.props;

    const allowedTypes = ['deposit', 'withdraw', 'withdrawal'];

    const transactionsMapped = (transactions || [])
      .filter(transaction => allowedTypes.includes(transaction.type))
      .map(transaction => {
        const type = transaction.type === 'withdrawal' ? 'withdraw' : transaction.type;
        const description = _t(
          `{action} amount of {amount}`,
          `ACCOUNT_ACTIVITY.DEP_WD_DESCRIPTION`,
          {
            action: _t(capitalize(type), `GENERIC.${toSnakeCase(type, 'uppercase')}`),
            amount: `${Math.abs(+transaction.amount)} ${transaction.currency_id}`
          }
        )

        return {
          description,
          timestamp: transaction.modification_time,
          action: type
        }
      });

    const openOrdersMapped = (openOrders || [])
      .map(order => {
        const instrument = instruments[order.security_id] || {};
        const description = _t(
          `{action} order placed for {amount} @ {price}`,
          `ACCOUNT_ACTIVITY.ORDER_PLACED_DESCRIPTION`,
          {
            action: _t(capitalize(order.order_side), `GENERIC.${toSnakeCase(order.order_side, 'uppercase')}`),
            amount: `${order.trade_quantity}${instrument.base}`,
            price: `${order.trade_price}${instrument.quote}`
          }
        )

        return {
          description,
          timestamp: order.timestamp,
          action: order.order_side
        }
      });

    const filledOrdersMapped = (filledOrders || [])
      .map(order => {
        const instrument = instruments[order.security_id] || {};
        const description = _t(
          `{action} order placed for {amount} @ {price}`,
          `ACCOUNT_ACTIVITY.ORDER_PLACED_DESCRIPTION`,
          {
            action: _t(capitalize(order.order_side), `GENERIC.${toSnakeCase(order.order_side, 'uppercase')}`),
            amount: `${order.trade_quantity}${instrument.base}`,
            price: `${order.trade_price}${instrument.quote}`
          }
        )

        return {
          description,
          timestamp: order.timestamp,
          action: order.order_side
        }
      });

    const newData = [ ...transactionsMapped, ...filledOrdersMapped, ...openOrdersMapped ]
      .sort((a, b) => {
        if (a.timestamp < b.timestamp) return -1;
        if (a.timestamp > b.timestamp) return 1;
        return 0;
      })
      .splice(-20);

    this.setState({ data: newData });
  }

  renderRows() {
    const rows = [];
    const { data } = this.state;
    if (data.length !== 0) {
    for (let i = this.state.data.length - 1; i >= 0; --i) {
      const row = this.state.data[i];
      const icon = this.iconMap[row.action];
      rows.push(
        <div key={i} className={`account-activity-row ${row.action}`}>
          <div className='account-activity-icon'>{icon}</div>
          <div className="account-activity-description"><h3>{row.description}</h3></div>
          <div className="account-activity-time"><p>{getFormattedDate(row.timestamp)}</p></div>
        </div>,
      );
    }
    return rows;
  }
  return (
    <div className="account-history-empty">
      <i className="fas fa-exclamation-circle" />
      <h3>No account activity available</h3>
    </div>
  );
}

  render() {
    return (
      <div className='account-activity component'>
        <div className='component-header'>
          <h1>Account Activity</h1>
        </div>
        <div className='component-content'>
          <PerfectScrollbar className="account-activity-rows">{this.renderRows()}</PerfectScrollbar>
        </div>
      </div>
    )
  }
}

const allowedTypes = ['deposit', 'withdraw', 'withdrawal']

const mapStateToProps = state => ({
  filledOrders: selectFilledOrders(state),
  openOrders: selectOpenOrders(state),
  transactions: selectTransactions(state),
  instrumentId: selectSelectedInstrumentId(state),
  instruments: selectInstruments(state),
});

const mapDispatchToProps = dispatch => ({
  getTransactionsList: () => dispatch(getTransactionsList()),
  loadTransactions: () => dispatch(loadTransactions()),
  getCompletedTransactionsList: (data) => dispatch(getCompletedTransactionsList(data)),
  loadOrderEvents: () => dispatch(loadOrderEvents()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountActivity);