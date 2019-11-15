import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Paginator from '../../../../elements/Paginator';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  selectOpenOrders,
  selectInstruments,
  selectSelectedInstrument,
} from '../../../../reducers';
import { cancelOrder, loadOrders } from '../../../../actions';
import CopyToClipboard from '../../../../elements/CopyToClipboard';
import { getFormattedDate } from '../../../../util/helpers';

const OrderRow = ({ data, cancelOrder, getCurrentInstrument }) => (
  <div className="table-row open-orders-row" onClick={() => getCurrentInstrument(data)}>
    <span className={`open-orders-side ${data.side}`}>
      {data.side === 'buy' ? (
        <i className="far fa-arrow-up" />
      ) : (
        <i className="far fa-arrow-down" />
      )}
    </span>
    <span className="open-orders-quantity">{data.security_id}</span>
    <span className="open-orders-quantity">{data.quantity}</span>
    <span className="open-orders-instrument">{data.cumulative_quantity}</span>
    <span className="open-orders-price">
      {data.status === 'new' ? data.price : data.average_price}
    </span>
    <span className="open-orders-time">
      {getFormattedDate(data.receipt_time, false, false, 'MM-DD-YY', 'HH:mm:ss')}
    </span>
    <span className="open-orders-actions" onClick={() => cancelOrder(data.id)}>
      <i className="fal fa-times-hexagon" />
      {_t('Cancel', 'ORDER_TABLES.CANCEL')}
    </span>
  </div>
);

export class OpenOrders extends Component {
  state = {
    page: 1,
    base: '',
    quote: '',
  };

  componentDidMount() {
    this.props.loadOrders();
  }

  componentDidUpdate() {
    this.props.loadOrders();
  }

  rowsPerPage = this.props.tradeUi.orderTableRows || 10;

  setPage = page => this.setState({ page });

  cancelOrder = (orderId) => {
    this.props.cancelOrder(orderId);
  };

  getCurrentInstrument = (data) => {
    const { selectInstruments } = this.props;
    const instrumentObj = Object.values(selectInstruments);
    const currentInstrument = instrumentObj.find(x => x.id === data.security_id);
    if (currentInstrument) {
      this.setState({
        base: currentInstrument.base,
        quote: currentInstrument.quote,
      });
    }
  };

  renderRows = () => {
    const orders = this.props.data;
    (orders || []).sort((x, y) => y.timestamp - x.timestamp);
    const startingIndex = (this.state.page - 1) * this.rowsPerPage;
    const selection = [...orders].splice(startingIndex, this.rowsPerPage);
    const rows = selection.map((data, i) => (
      <OrderRow
        key={i}
        data={data}
        cancelOrder={this.cancelOrder}
        getCurrentInstrument={this.getCurrentInstrument}
      />
    ));
    const rowsCount = rows.length;
    for (let i = 0; i < this.rowsPerPage - rowsCount; i++) {
      rows.push(<div className="table-row orders-row" key={rowsCount + i} />);
    }
    return rows;
  };

  render() {
    const { base, quote } = this.state;
    const { currentInstrument } = this.props;

    return (
      <Fragment>
        <div className="table open-orders-table">
          <div className="table-header open-orders-header">
            <span className="open-orders-side">{_t('Side', 'ORDER_TABLES.SIDE')}</span>
            <span className="open-orders-side">{_t('Pair', 'ORDER_TABLES.PAIR')}</span>
            <span className="open-orders-quantity">{_t('Size', 'ORDER_TABLES.SIZE')}</span>
            <span className="open-orders-instrument">{_t('Filled', 'ORDER_TABLES.FILLED')}</span>
            <span className="open-orders-price">{_t('Price', 'ORDER_TABLES.PRICE')}</span>
            <span className="open-orders-time">{_t('Time', 'ORDER_TABLES.TIME')}</span>
            <span className="open-orders-actions">{_t('Actions', 'ORDER_TABLES.ACTIONS')}</span>
          </div>
          <div className="table-rows open-orders-rows">
            <PerfectScrollbar>{this.renderRows()}</PerfectScrollbar>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  data: selectOpenOrders(state),
  selectInstruments: selectInstruments(state),
  currentInstrument: selectSelectedInstrument(state),
  tradeUi: state.config.tradeUi,
});

const mapDispatchToProps = dispatch => ({
  cancelOrder: orderId => dispatch(cancelOrder(orderId)),
  loadOrders: () => dispatch(loadOrders()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OpenOrders);
