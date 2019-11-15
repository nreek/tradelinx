import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Table from '../../../elements/table/Table';
import Paginator from '../../../elements/Paginator';

import { loadOrderEvents } from '../../../actions';
import { selectFilledOrders } from '../../../reducers';
import { capitalize, floor, getFormattedDate } from '../../../util/helpers';


const propTypes = {
  t: PropTypes.string,
};

const defaultProps = {
  t: 'RECENT_TRANSACTIONS',
};

export class RecentTransactions extends PureComponent {
  state = {
    page: 1,
  }

  componentDidMount() {
    this.props.loadData();
  }

  setPage = page => this.setState({ page });

  renderTableHeader = () => {
    const { t } = this.props;
    return (
      <Table.Header>
        <Table.Row>
          {/* <Table.HeaderCell>{_t('Account', `${t}.ACCOUNT`)}</Table.HeaderCell> */}
          <Table.HeaderCell>{_t('Order ID', `${t}.NUMBER`)}</Table.HeaderCell>
          <Table.HeaderCell>{_t('Pair', `${t}.PAIR`)}</Table.HeaderCell>
          <Table.HeaderCell>{_t('Side', `${t}.SIDE`)}</Table.HeaderCell>
          <Table.HeaderCell>{_t('Size', `${t}.SIZE`)}</Table.HeaderCell>
          <Table.HeaderCell>{_t('Price', `${t}.PRICE`)}</Table.HeaderCell>
          <Table.HeaderCell>{_t('Total', `${t}.TOTAL`)}</Table.HeaderCell>
          {/* <Table.HeaderCell>{_t('Fee', `${t}.FEE`)}</Table.HeaderCell> */}
          {/* <Table.HeaderCell>{_t('Exec. ID', `${t}.EXEC_ID`)}</Table.HeaderCell> */}
          <Table.HeaderCell>{_t('Time', `${t}.TIME`)}</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  };

  renderTableBody = () => {
    const { t } = this.props;
    const startingIndex = (this.state.page - 1) * this.props.rowsPerPage;

    const selection = this.props.data.slice(startingIndex, startingIndex + this.props.rowsPerPage);
    const rows = selection.map((transaction, index) => this.renderTableRow(transaction, index));

    const rowsCount = rows.length;
    for (let i = 0; i < this.props.rowsPerPage - rowsCount; i++) {
      if (rowsCount === 0 && i === 0) {
        rows.push(
          <Table.Row key={rowsCount + i}>
            <Table.Cell className="cell empty" colSpan={7}>{_t('No transactions to display', `${t}.NO_TRANSACTIONS`)}</Table.Cell>
          </Table.Row>,
        );
      } else {
        rows.push(
          <Table.Row key={rowsCount + i}>
            <Table.Cell className="cell empty" colSpan={7} />
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
    let { dateFormat, timeFormat } = this.props;
    const decimals = this.props.instruments[transaction.security_id] ? this.props.instruments[transaction.security_id].quoteDecimals : 2;
    const sideClass = transaction.order_side;
    if (timeFormat === '12hr') {
      timeFormat = 'h:mmA';
    } else if (timeFormat === '24hr') {
      timeFormat = 'HH:mm';
    }

    return (
      <Table.Row key={key}>
        {/* <Table.Cell></Table.Cell> */}
        <Table.Cell className="order-id">{transaction.order_id}</Table.Cell>
        <Table.Cell className="pair">{transaction.security_id}</Table.Cell>
        <Table.Cell className={`side ${sideClass}`}>{capitalize(transaction.order_side)}</Table.Cell>
        <Table.Cell className="size">{transaction.trade_quantity}</Table.Cell>
        <Table.Cell className="price">{floor((+transaction.trade_price), decimals)}</Table.Cell>
        <Table.Cell className="total">{floor((transaction.trade_price * transaction.trade_quantity), decimals)}</Table.Cell>
        {/* <Table.Cell></Table.Cell> */}
        {/* <Table.Cell></Table.Cell> */}
        <Table.Cell className="time">{getFormattedDate(transaction.timestamp)}</Table.Cell>
      </Table.Row>
    );
  }

  renderRecentTransactionsTable = () => (
    <Table className="recent-transactions-table">
      {this.renderTableHeader()}
      {this.renderTableBody()}
    </Table>
  );

  render() {
    return (
      <div className="recent-transactions">
        <h3>
          {_t('Recent Transactions', `${this.props.t}.RECENT_TRANSACTIONS`)}
        </h3>
        {this.renderRecentTransactionsTable()}
        <div className="table-bottom-bar recent-transactions-bottom-bar">
          {this.props.data.length > this.props.rowsPerPage
            && (
            <Paginator
              currentPage={this.state.page}
              setPage={this.setPage}
              numItems={this.props.data.length}
              itemsPerPage={this.props.rowsPerPage}
            />
            )
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: (selectFilledOrders(state) || [])
    .sort((a, b) => {
      if (a.timestamp < b.timestamp) return 1;
      if (a.timestamp > b.timestamp) return -1;
      return 0;
    }),
  instruments: state.instruments,
  rowsPerPage: state.config.simpleUi.maxTableRows.recentTransactions,
  dateFormat: state.config.dateFormat,
  timeFormat: state.config.timeFormat,
  // t: state.app.translationPaths.myAccounts
});

const mapDispatchToProps = dispatch => ({
  loadData: () => dispatch(loadOrderEvents()),
});

RecentTransactions.propTypes = propTypes;
RecentTransactions.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RecentTransactions);
