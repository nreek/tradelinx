import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getFormattedDate, floor } from '../../../util/helpers';

import Table from '../../../elements/table/Table';
import Paginator from '../../../elements/Paginator';

const propTypes = {
  t: PropTypes.string,
};

const defaultProps = {
  t: 'ACCOUNT_HISTORY',
};

const withdraw = 'withdraw';
const deposit = 'deposit';
const tempWithdrawal = 'withdrawal'; // @todo remove it after back-end bring fixes
const IN_PROGRESS = 'in_progress';
const allowedTypes = [deposit, withdraw, tempWithdrawal];

export class AccountHistory extends PureComponent {
  state = {
    page: 1,
  };

  setPage = page => this.setState({ page });

  renderTableHeader = () => {
    const { t } = this.props;
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>{_t('ID', `${t}.ID`)}</Table.HeaderCell>
          <Table.HeaderCell>{_t('Type', `${t}.TYPE`)}</Table.HeaderCell>
          <Table.HeaderCell>{_t('Product', `${t}.PRODUCT`)}</Table.HeaderCell>
          <Table.HeaderCell>{_t('Total', `${t}.TOTAL`)}</Table.HeaderCell>
          <Table.HeaderCell>{_t('Status', `${t}.STATUS`)}</Table.HeaderCell>
          <Table.HeaderCell>{_t('Time', `${t}.TIME`)}</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  };

  renderTableBody = () => {
    const { t } = this.props;
    const startingIndex = (this.state.page - 1) * this.props.rowsPerPage;

    const selection = this.props.transactions.slice(startingIndex, startingIndex + this.props.rowsPerPage);
    const rows = selection.map((transaction, index) => this.renderTableRow(transaction, index));

    const rowsCount = rows.length;
    for (let i = 0; i < this.props.rowsPerPage - rowsCount; i++) {
      if (rowsCount === 0 && i === 0) {
        rows.push(
          <Table.Row key={rowsCount + i}>
            <Table.Cell className="empty" colSpan={6}>{_t('No transactions to display', `${t}.NO_TRANSACTIONS`)}</Table.Cell>
          </Table.Row>,
        );
      } else {
        rows.push(
          <Table.Row key={rowsCount + i}>
            <Table.Cell className="empty" colSpan={6} />
          </Table.Row>,
        );
      }
    }

    return (
      <Table.Body>
        {rows}
      </Table.Body>
    );
  }

  renderTableRow = (transaction, key) => {
    const {
      confirmations,
      confirmations_needed,
      type,
      currency_id,
    } = transaction;
    const { products } = this.props;
    let { timeFormat } = this.props;
    const decimals = products[currency_id] ? products[currency_id].decimals : 8;
    const amount = transaction.amount === null
      ? '-'
      : floor((transaction.amount * 1), decimals);
    if (timeFormat === '12hr') {
      timeFormat = 'h:mmA';
    } else if (timeFormat === '24hr') {
      timeFormat = 'HH:mm';
    }

    return (
      <Table.Row key={key}>
        <Table.Cell className="transaction-id">{transaction.id}

        </Table.Cell>
        <Table.Cell className="type">{_t(type, `ACCOUNT_HISTORY.${type.toUpperCase()}`) }</Table.Cell>
        <Table.Cell className="product">{currency_id}</Table.Cell>
        <Table.Cell className="total">{amount}</Table.Cell>
        <Table.Cell className="status">

        {transaction.status !== IN_PROGRESS
          ? _t(transaction.status, `ACCOUNT_HISTORY.${transaction.status.toUpperCase()}`)
          : (<span>
              <progress className="progress is-small" value={confirmations} max={confirmations_needed}></progress>
              <span>{' '}{confirmations}/{confirmations_needed}</span>
            </span>)
        }
        </Table.Cell>
        <Table.Cell className="time">{getFormattedDate(transaction.modification_time)}</Table.Cell>
      </Table.Row>
    );
  }

  renderAccountHistoryTable = () => (
    <Table>
      {this.renderTableHeader()}
      {this.renderTableBody()}
    </Table>
  );

  render() {
    return (
      <div className="account-history">
        {this.renderAccountHistoryTable()}
        <div className="table-bottom-bar account-history-bottom-bar">
          {this.props.transactions.length > this.props.rowsPerPage
            && (
            <Paginator
              currentPage={this.state.page}
              setPage={this.setPage}
              numItems={this.props.transactions.length}
              itemsPerPage={this.props.rowsPerPage}
            />
            )
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ transactions, products, config }) => ({
  transactions: ([...(transactions.completedList || []), ...(transactions.list || [])]
    .sort((a, b) => {
      if (a.timestamp < b.timestamp) return 1;
      if (a.timestamp > b.timestamp) return -1;
      return 0;
    })
    .filter(transaction => (allowedTypes.includes(transaction.type))) || []).reverse(),
  products,
  rowsPerPage: config.simpleUi.maxTableRows.accountHistory,
  dateFormat: config.dateFormat,
  timeFormat: config.timeFormat,
});

AccountHistory.propTypes = propTypes;
AccountHistory.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  null,
)(AccountHistory);
