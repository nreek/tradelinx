import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Paginator from '../../elements/Paginator';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { selectOpenOrders } from '../../reducers';
import { cancelOrder } from '../../actions';
import CopyToClipboard from '../../elements/CopyToClipboard';
import { getFormattedDate } from '../../util/helpers';

const OrderRow = ({ data, cancelOrder }) => (
  <div className="table-row open-orders-row">
    <span className="open-orders-account">
      <CopyToClipboard text={data.id} length={4} />
    </span>
    <span className="open-orders-instrument">{data.security_id}</span>
    <span className={`open-orders-side ${data.side}`}>
      {_t(data.side.toUpperCase(), `ORDER_TABLES.SIDE_${data.side.toUpperCase()}`)}
    </span>
    <span className="open-orders-type">{data.type}</span>
    <span className="open-orders-type">
      {_t(
        (data.time_in_force || '').toUpperCase(),
        `ORDER_TABLES.${(data.time_in_force || '').toUpperCase()}`,
      )}
    </span>
    <span className="open-orders-quantity">{data.remaining_quantity}</span>
    <span className="open-orders-price">
      {data.status === 'new' ? data.price : data.average_price}
    </span>
    <span className="open-orders-fee">0</span>
    <span className="open-orders-time">{getFormattedDate(data.receipt_time)}</span>
    <span className="open-orders-time">
      {data.expire_time ? getFormattedDate(data.expire_time) : ''}
    </span>
    <span className="open-orders-status">
      {_t(data.status, `ORDER_TABLES.STATUS_${data.status.toUpperCase()}`)}
    </span>
    <span className="open-orders-actions" onClick={() => cancelOrder(data.id)}>
      <i className="fal fa-times-hexagon" />
      Cancel
    </span>
  </div>
);

export class OpenOrders extends Component {
  state = {
    page: 1,
  };

  rowsPerPage = this.props.tradeUi.orderTableRows || 10;

  setPage = page => this.setState({ page });

  cancelOrder = (orderId) => {
    this.props.cancelOrder(orderId);
  };

  renderRows = () => {
    const orders = this.props.data;
    (orders || []).sort((x, y) => y.timestamp - x.timestamp);
    const startingIndex = (this.state.page - 1) * this.rowsPerPage;
    const selection = [...orders].splice(startingIndex, this.rowsPerPage);
    const rows = selection.map((data, i) => (
      <OrderRow key={i} data={data} cancelOrder={this.cancelOrder} />
    ));
    const rowsCount = rows.length;
    for (let i = 0; i < this.rowsPerPage - rowsCount; i++) {
      rows.push(<div className="table-row orders-row" key={rowsCount + i} />);
    }
    return rows;
  };

  render() {
    return (
      <Fragment>
        <div className="table open-orders-table">
          <div className="table-header open-orders-header">
            <span className="open-orders-account">{_t('#', 'ORDER_TABLES.ORDER_ID')}</span>
            <span className="open-orders-instrument">{_t('Pair', 'ORDER_TABLES.PAIR')}</span>
            <span className="open-orders-side">{_t('Side', 'ORDER_TABLES.SIDE')}</span>
            <span className="open-orders-type">{_t('Type', 'ORDER_TABLES.TYPE')}</span>
            <span className="open-orders-type">{_t('TIF', 'ORDER_TABLES.TIF')}</span>
            <span className="open-orders-quantity">{_t('Quantity', 'ORDER_TABLES.QUANTITY')}</span>
            <span className="open-orders-price">{_t('Price', 'ORDER_TABLES.PRICE')}</span>
            <span className="open-orders-fee">{_t('Fee', 'ORDER_TABLES.FEE')}</span>
            <span className="open-orders-time">{_t('Time', 'ORDER_TABLES.TIME')}</span>
            <span className="open-orders-time">{_t('Expiry', 'ORDER_TABLES.EXPIRY')}</span>
            <span className="open-orders-status">{_t('Status', 'ORDER_TABLES.STATUS')}</span>
            <span className="open-orders-actions">{_t('Actions', 'ORDER_TABLES.ACTIONS')}</span>
          </div>
          <div className="table-rows open-orders-rows">
            <PerfectScrollbar>{this.renderRows()}</PerfectScrollbar>
          </div>
        </div>
        <div className="table-bottom-bar open-orders-bottom-bar">
          <Paginator
            currentPage={this.state.page}
            setPage={this.setPage}
            numItems={this.props.data.length}
            itemsPerPage={this.rowsPerPage}
          />
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  data: selectOpenOrders(state),
  tradeUi: state.config.tradeUi,
});

const mapDispatchToProps = dispatch => ({
  cancelOrder: orderId => dispatch(cancelOrder(orderId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OpenOrders);
