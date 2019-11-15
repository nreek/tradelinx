import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';

import { List, AutoSizer } from 'react-virtualized';
import { loadL2Data } from '../../actions';

import { formatQuantity } from '../../util/helpers';

const orderBookRowCount = 30;
const orderBookRowHeight = 16;
const orderBookSideHeight = orderBookRowCount * orderBookRowHeight;

class OrderBook extends Component {
  componentDidMount() {
    this.centerBookScroll();
    this.props.loadData(this.props.selectedInstrument.id);
  }

  // wait for orderbook to populate with data before centering
  componentDidUpdate(prevProps) {
    if (
      prevProps.data
      && prevProps.data.asks.length === 0
      && prevProps.data.bids.length === 0
    ) {
      this.centerBookScroll();
    }
  }

  centerBookScroll = () => {
    const bookLayerContainer = document.querySelector('.order-book-layers');
    const bookLayers = [
      ...document.querySelectorAll('.order-book-layers > div'),
    ];
    const bookLayersHeight = bookLayers
      .map(layer => layer.clientHeight)
      .reduce((totalHeight, layerHeight) => (totalHeight += layerHeight), 0);

    bookLayerContainer.scrollTop = (bookLayersHeight - bookLayerContainer.clientHeight) / 2;
  };

  renderOrderBookSide = data => data.map((value, i) => this.renderOrderBookLayer(value, i));

  renderOrderBookLayer = (layer, key) => (
    <div className="order-book-row" key={key}>
      <span className="order-book-row-price">
        {formatQuantity(layer.price, this.props.selectedInstrument.baseDecimals || 0)}
      </span>
      <span className="order-book-row-quantity">
        {/* TODO: Replace with baseDecimals from ws */}
        {formatQuantity(layer.quantity, this.props.selectedInstrument.baseDecimals || 0)}
      </span>
      <span className="order-book-row-open-orders" />
    </div>
  );

  render() {
    const {
      data,
      selectedInstrument,
    } = this.props;
    const { base, quote, quoteDecimals } = selectedInstrument;
    const { bids, asks } = data;
    const spread = asks[0] && bids[0] ? asks[0].price - bids[0].price : null;

    return (
      <Fragment>
        <div className="order-book-header">
          <span className="order-book-header-price">{_t('Price {quote}', 'ORDER_BOOK.PRICE', { quote })}</span>
          <span className="order-book-header-quantity">{_t('Quantity {base}', 'ORDER_BOOK.QUANTITY', { base })}</span>
        </div>
        <div className="order-book-layers">
          {/* <div className="order-book-asks" style={{height: orderBookSideHeight}}> */}
          <div className="order-book-asks">
            {this.renderOrderBookSide(asks.slice())}
            {/* <OrderBookSide data={asks.reverse()} /> */}
          </div>
          <div className="order-book-spread">
            {_t('SPREAD', 'ORDER_BOOK.SPREAD')}
            {' '}
            {(spread > 0 ? spread : 0).toFixed(quoteDecimals)}
            {' '}
            {quote}
          </div>
          {/* <div className="order-book-bids" style={{height: orderBookSideHeight}}> */}
          <div className="order-book-bids">
            {this.renderOrderBookSide(bids)}
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  data: state.orderbook,
  selectedInstrument: state.selectedInstrument,
});

const mapDispatchToProps = dispatch => ({
  loadData: instrument => dispatch(loadL2Data(instrument)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrderBook);
