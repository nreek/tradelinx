import React, { Component } from 'react';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { getCompletedTransactionsList } from '../../../actions';
import { selectTransactions, selectInstruments } from '../../../reducers';
import { getFormattedDate, capitalize, toSnakeCase } from '../../../util/helpers';

class WalletHistory extends Component {
  state = {
    data: [],
  };

  // selects icons based on activity type
  iconMap = {
    deposit: <i className="fas fa-university" />,
    withdraw: <i className="fas fa-wallet" />,
  };

  componentDidMount() {
    // TODO: possibly find out why this timeout is necessary for the transactions to actually load on first page load
    setTimeout(() => {
      this.props.getCompletedTransactionsList({
        start_time: 0,
      });
    }, 1);
    this.compileAccountActivity();
  }

  componentDidUpdate(prevProps) {
    const { transactions, instruments, currentCurrency } = this.props;
    if (
      transactions.length !== prevProps.transactions.length
      || currentCurrency.id !== prevProps.currentCurrency.id
    ) {
      this.compileAccountActivity();
    }
  }

  compileAccountActivity() {
    const { transactions, instruments, currentCurrency } = this.props;
    const allowedTypes = ['deposit', 'withdraw', 'withdrawal'];
    const transactionsMapped = (transactions || [])
      .filter(
        transaction => allowedTypes.includes(transaction.type) && transaction.currency_id === currentCurrency.id,
      )
      .map((transaction) => {
        const type = transaction.type === 'withdrawal' ? 'withdraw' : transaction.type;
        const description = _t(
          `{action} amount of {amount}`,
          `WALLET_HISTORY.DEP_WD_DESCRIPTION`,
          {
            action: _t(capitalize(type), `GENERIC.${toSnakeCase(type, 'uppercase')}`),
            amount: `${Math.abs(+transaction.amount)} ${transaction.currency_id}`
          }
        )

        return {
          description,
          timestamp: transaction.modification_time,
          action: type,
        };
      });
    const newData = [...transactionsMapped]
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
      for (let i = data.length - 1; i >= 0; --i) {
        const row = data[i];
        const icon = this.iconMap[row.action];
        rows.push(
          <div key={i} className={`wallet-history-row ${row.action}`}>
            <div className="wallet-history-icon">{icon}</div>
            <div className="wallet-history-description">
              <h3>{row.description}</h3>
            </div>
            <div className="wallet-history-time">
              <p>{getFormattedDate(row.timestamp)}</p>
            </div>
          </div>,
        );
      }
      return rows;
    }
    return (
      <div className="wallet-history-empty">
        <i className="fas fa-exclamation-circle" />
        <h3>{_t('No wallet history available', 'WALLET_HISTORY.NO_HISTORY_AVAILABLE')}</h3>
      </div>
    );
  }

  render() {
    return (
      <div className="wallet-history component">
        <div className="component-header">
          <h1>{_t('Wallet History', 'WALLET_HISTORY.TITLE')}</h1>
        </div>
        <div className="component-content">
          <PerfectScrollbar className="wallet-history-rows">{this.renderRows()}</PerfectScrollbar>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  transactions: selectTransactions(state),
  instruments: selectInstruments(state),
});

const mapDispatchToProps = dispatch => ({
  getCompletedTransactionsList: data => dispatch(getCompletedTransactionsList(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WalletHistory);
