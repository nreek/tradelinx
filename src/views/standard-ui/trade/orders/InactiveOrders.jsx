import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Paginator from '../../../../elements/Paginator';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { selectInactiveOrders } from '../../../../reducers';
import CopyToClipboard from '../../../../elements/CopyToClipboard';
import { getFormattedDate } from '../../../../util/helpers';

const OrderRow = ({ data }) => (
  <div className="table-row inactive-orders-row">
    <span className="inactive-orders-instrument">{data.security_id}</span>
    <span className={`inactive-orders-side ${data.order_side}`}>
      {data.order_side === 'buy' ? (
        <i className="far fa-arrow-up" />
      ) : (
        <i className="far fa-arrow-down" />
      )}
    </span>
    <span className="inactive-orders-status">
      {_t(data.order_status, `ORDER_TABLES.STATUS_${data.order_status.toUpperCase()}`)}
    </span>
    <span className="inactive-orders-time">{getFormattedDate(data.timestamp, false, false, 'MM-DD-YY', 'HH:mm:ss')}</span>
  </div>
);

export class InactiveOrders extends Component {
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
        <div className="table inactive-orders-table">
          <div className="table-header inactive-orders-header">
            <span className="inactive-orders-instrument">{_t('Pair', 'ORDER_TABLES.PAIR')}</span>
            <span className="inactive-orders-side">{_t('Side', 'ORDER_TABLES.SIDE')}</span>
            <span className="inactive-orders-status">{_t('Status', 'ORDER_TABLES.STATUS')}</span>
            <span className="inactive-orders-time">{_t('Time', 'ORDER_TABLES.TIME')}</span>
          </div>
          <div className="table-rows inactive-orders-rows">
            <PerfectScrollbar>{this.renderRows()}</PerfectScrollbar>
          </div>
        </div>
        {/*        <div className="table-bottom-bar inactive-orders-bottom-bar">
          <Paginator
            currentPage={this.state.page}
            setPage={this.setPage}
            numItems={this.props.data.length}
            itemsPerPage={this.rowsPerPage}
          />
        </div> */}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  data: selectInactiveOrders(state)
    .slice()
    .reverse(), // Makes copy and reverses
  tradeUi: state.config.tradeUi,
});

export default connect(
  mapStateToProps,
  null,
)(InactiveOrders);
