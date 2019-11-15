import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Paginator from '../../elements/Paginator';
import 'react-perfect-scrollbar/dist/css/styles.css';


const OrderRow = ({ data }) => (
  <div className="table-row withdraw-status-row">
    <span className="withdraw-status-account">{data.account}</span>
    <span className="withdraw-status-product">{data.product}</span>
    <span className="withdraw-status-amount">{data.amount}</span>
    <span className="withdraw-status-status">{data.status}</span>
    <span className="withdraw-status-created">{data.created}</span>
    <span className="withdraw-status-actions" />
  </div>
);

export class WithdrawStatus extends Component {
  state = {
    page: 1,
  };

  rowsPerPage = this.props.tradeUi.orderTableRows || 10;

  setPage = page => this.setState({ page });

  renderRows = () => {
    const orders = this.props.data;
    (orders || []).sort((x, y) => y.timestamp - x.timestamp);
    const startingIndex = (this.state.page - 1) * this.rowsPerPage;
    const selection = [...orders].splice(startingIndex, this.rowsPerPage);
    const rows = selection.map((data, index) => <OrderRow key={index} data={data} />);
    const rowsCount = rows.length;
    for (let i = 0; i < this.rowsPerPage - rowsCount; i++) {
      rows.push(<div className="table-row inactive-orders-row" key={rowsCount + i} />);
    }
    return rows;
  };

  render() {
    return (
      <Fragment>
        <div className="table withdraw-status-table">
          <div className="table-header withdraw-status-header">
            <span className="withdraw-status-account">{_t('Account', 'ORDER_TABLES.ACCOUNT')}</span>
            <span className="withdraw-status-product">{_t('Product', 'ORDER_TABLES.PRODUCT')}</span>
            <span className="withdraw-status-amount">{_t('Amount', 'ORDER_TABLES.AMOUNT')}</span>
            <span className="withdraw-status-status">{_t('Status', 'ORDER_TABLES.STATUS')}</span>
            <span className="withdraw-status-created">{_t('Created', 'ORDER_TABLES.CREATED')}</span>
            <span className="withdraw-status-actions">{_t('Actions', 'ORDER_TABLES.ACTIONS')}</span>
          </div>
          <div className="table-rows withdraw-status-rows">
            <PerfectScrollbar>
              {this.renderRows()}
            </PerfectScrollbar>
          </div>
        </div>
        <div className="table-bottom-bar withdraw-status-bottom-bar">
          {this.props.data.length > this.rowsPerPage && (
            <Paginator
              currentPage={this.state.page}
              setPage={this.setPage}
              numItems={this.state.data.length}
              itemsPerPage={this.rowsPerPage}
            />
          )}
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  data: [],
  tradeUi: state.config.tradeUi,
});

export default connect(
  mapStateToProps,
  null,
)(WithdrawStatus);
