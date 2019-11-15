import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Paginator from '../../elements/Paginator';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { selectFilledOrders, finishedLoadingOrders } from '../../reducers';
import CopyToClipboard from '../../elements/CopyToClipboard';
import { getFormattedDate } from '../../util/helpers';
import Spinner from '../../elements/Spinner';

class OrderRow extends Component {
  state = {
    isOpen: false,
  };

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  renderRow = (
    orderId,
    instrument,
    side,
    qty,
    price,
    total,
    timestamp,
    key = 1,
    hasCuret = false,
  ) => (
    <div className="table-row filled-orders-row" key={key}>
      <span className="filled-orders-order-id">
        {hasCuret && (
          <span onClick={this.toggle}>
            {this.state.isOpen ? (
              <i className="fas fa-angle-down open-curet" />
            ) : (
              <i className="fas fa-angle-up close-curet" />
            )}
          </span>
        )}
        {orderId}
      </span>
      <span className="filled-orders-instrument">{instrument}</span>
      <span className={`filled-orders-side ${side}`}>
        {_t(side.toUpperCase(), `ORDER_TABLES.SIDE_${side.toUpperCase()}`)}
      </span>
      <span className="filled-orders-quantity">{qty}</span>
      <span className="filled-orders-price">{price}</span>
      <span className="filled-orders-total">{total}</span>
      {/* <span className='filled-orders-fee'>{fee}</span> */}
      {/* <span className='filled-orders-execution-id'>#</span> */}
      <span className="filled-orders-time">{timestamp ? getFormattedDate(timestamp) : null}</span>
    </div>
  );

  render() {
    let { data } = this.props;
    const total = data[0].quantity * data[0].average_price;
    if (data.length === 1) {
      data = data[0];
      return this.renderRow(
        <CopyToClipboard text={data.order_id} length={4} />,
        data.security_id,
        data.order_side,
        data.quantity,
        data.average_price,
        total,
        data.timestamp,
      );
    }

    const sortedData = [...data];
    sortedData.sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0));
    sortedData.reverse();
    const mostRecent = this.renderRow(
      <CopyToClipboard text={sortedData[0].order_id} length={4} />,
      sortedData[0].security_id,
      sortedData[0].order_side,
      sortedData[0].quantity,
      sortedData[0].average_price,
      sortedData[0].quantity * sortedData[0].average_price,
      sortedData[0].timestamp,
      1,
      sortedData[0].quantity !== sortedData[0].trade_quantity ? true : false,
    );

    const rows = sortedData.map((order, index) => {
      return this.renderRow(
          null,
          '',
          '',
          order.trade_quantity,
          order.trade_price,
          null,
          order.timestamp,
          index,
        )});
    return (
      <Fragment>
        {mostRecent}
        {this.state.isOpen ? rows : null}
      </Fragment>
    );
  }
}

class FilledOrders extends Component {
  state = {
    orders: {},
    page: 1,
    numOrders: 0,
  };

  componentDidMount() {
    const { data } = this.props;
    const orders = {};
    (data || []).sort((x, y) => y.timestamp - x.timestamp);
    data.forEach((order) => {
      if (!orders[order.order_id]) {
        orders[order.order_id] = [];
      }
      orders[order.order_id].push(order);
    });
    this.setState({ orders, numOrders: Object.values(orders).length });
  }

  rowsPerPage = this.props.tradeUi.orderTableRows || 10;

  setPage = page => this.setState({ page });

  renderRows = () => {
    const startingIndex = (this.state.page - 1) * this.rowsPerPage;
    const selection = [...Object.values(this.state.orders)].splice(startingIndex, this.rowsPerPage);
    const rows = selection.map((data, index) => <OrderRow key={index} data={data} />);
    const rowsCount = rows.length;

    for (let i = 0; i < this.rowsPerPage - rowsCount; i++) {
      rows.push(<div className="table-row filled-orders-row" key={rowsCount + i} />);
    }
    return rows;
  };

  renderTable = () => (
    <Fragment>
      <div className="table filled-orders-table">
        <div className="table-header filled-orders-header">
          <span className="filled-orders-order-id">{_t('#', 'ORDER_TABLES.ORDER_ID')}</span>
          <span className="filled-orders-instrument">{_t('Pair', 'ORDER_TABLES.PAIR')}</span>
          <span className="filled-orders-side">{_t('Side', 'ORDER_TABLES.SIDE')}</span>
          <span className="filled-orders-quantity">{_t('Quantity', 'ORDER_TABLES.QUANTITY')}</span>
          <span className="filled-orders-price">{_t('Price', 'ORDER_TABLES.PRICE')}</span>
          <span className="filled-orders-total">{_t('Total', 'ORDER_TABLES.TOTAL')}</span>
          {/* <span className='filled-orders-fee'>{_t('Fee', 'ORDER_TABLES.FEE')}</span> */}
          {/* <span className='filled-orders-execution-id'>{_t('Type', 'ORDER_TABLES.ORDER_TYPE')}</span> */}
          <span className="filled-orders-time">{_t('Time', 'ORDER_TABLES.TIME')}</span>
        </div>
        <div className="table-rows filled-orders-rows">
          <PerfectScrollbar>{this.renderRows()}</PerfectScrollbar>
        </div>
      </div>
      <div className="table-bottom-bar filled-orders-bottom-bar">
        <Paginator
          currentPage={this.state.page}
          setPage={this.setPage}
          numItems={this.state.numOrders}
          itemsPerPage={this.rowsPerPage}
        />
      </div>
    </Fragment>
  );

  render() {
    const { finishedLoadingOrders } = this.props;
    return finishedLoadingOrders === true ? this.renderTable() : <Spinner />;
  }
}

const mapStateToProps = state => ({
  data: selectFilledOrders(state),
  tradeUi: state.config.tradeUi,
  finishedLoadingOrders: finishedLoadingOrders(state),
});

export default connect(
  mapStateToProps,
  null,
)(FilledOrders);
