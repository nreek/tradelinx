import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { List, AutoSizer } from 'react-virtualized';
import { loadL2Data } from '../../../actions';

import { formatQuantity, formatNumberToLocale } from '../../../util/helpers';

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

  renderOrderBookSide = data => { 
    const totalSideVolume = data.reduce((sum, layer) => {
      return sum + (+layer.quantity);
    }, 0);

    let accumulatedSideVolume = 0;

    return data.map((layer, i) => { 
      accumulatedSideVolume += (+layer.quantity);
      return this.renderOrderBookLayer(layer, i, accumulatedSideVolume, totalSideVolume) 
    }) 
  };

  renderOrderBookLayer = (layer, key, accumulatedSideVolume, totalSideVolume) => { 
    let volumeBarWidth = (accumulatedSideVolume / totalSideVolume) * 100;
    if (volumeBarWidth < 2) volumeBarWidth = 2;
    return (
      <div className="order-book-row" key={key}>
        <span className='order-book-row-volume-bar' style={{width: `${volumeBarWidth}%`}} />
        <span className="order-book-row-price">
          {formatQuantity(layer.price, this.props.selectedInstrument.quoteDecimals || 0)}
        </span>
        <span className="order-book-row-quantity">
          {formatQuantity(layer.quantity, this.props.selectedInstrument.baseDecimals || 0)}
        </span>
      </div>
    )
  };

  render() {
    const {
      data,
      selectedInstrument,
    } = this.props;
    const { base, quote, baseDecimals, quoteDecimals } = selectedInstrument;
    const { bids, asks } = data;
    const spread = asks[0] && bids[0] ? asks[0].price - bids[0].price : 0;
    const midPrice = asks[0] && bids[0] ? (+asks[0].price + +bids[0].price) / 2 : 0;

    return (
      <div className="order-book component">
        <div className="component-header">
          <h1>{_t('Order Book', 'ORDER_BOOK.TITLE')}</h1>
        </div>
        <div className="order-book-layers component-content">
          <div className="order-book-header">
            <span className="order-book-header-price">{_t('Price {quote}', 'ORDER_BOOK.PRICE_LABELED', { quote })}</span>
            <span className="order-book-header-quantity">{_t('Quantity {base}', 'ORDER_BOOK.QUANTITY_LABELED', { base })}</span>
          </div>
          <div className="order-book-bids">
            <PerfectScrollbar className='order-book-rows'>
              {this.renderOrderBookSide(bids.slice())}
            </PerfectScrollbar>
          </div>
          <div className='order-book-center'>
            <div className="order-book-spread">
              <span className='order-book-spread-label'>{_t('Spread', 'ORDER_BOOK.SPREAD')}</span>
              |
              <span className='order-book-spread-value'>
                {formatNumberToLocale(spread, quoteDecimals)}
              </span>
            </div>
            <div className="order-book-midprice">
              <span className='order-book-midprice-label'>{_t('Price', 'ORDER_BOOK.PRICE')}</span>
              |
              <span className='order-book-midprice-value'>
                {formatNumberToLocale(midPrice, quoteDecimals)}
              </span>
            </div>
          </div>
          <div className="order-book-asks">
            <PerfectScrollbar className='order-book-rows'>
              {this.renderOrderBookSide(asks.slice())}
            </PerfectScrollbar>
          </div>
        </div>
      </div>
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
