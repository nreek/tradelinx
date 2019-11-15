import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Slider from "react-slick";
import { formatNumberToLocale } from '../util/helpers';

const TickerBlock = ({ ticker }) => {
  let pxChange = ticker.price_24h_change;
  if (!pxChange) pxChange = 0; 

  const pxClass = pxChange > 0 ? 'up' : pxChange < 0 ? 'down' : '';
  const bestBid = +ticker.bid;

  return (
    <div className='ticker-wrapper'>
    <div className='ticker-product'>
      <span className='ticker-symbol'>{ticker.base}</span>
      <span className='ticker-value'>{bestBid || bestBid === 0 ? formatNumberToLocale(bestBid, 2) : null}</span>
      <span>|</span>
      <span className={`ticker-percent-change ${pxClass}`}>{pxChange || pxChange === 0 ? `${pxChange.toFixed(2)}%` : null}</span>
    </div>
    </div>
  )
}

class ScrollingTicker extends Component {
  state = {
    crossProduct: 'USD', // TODO: make this configurable in the store?
  }

  renderTickerProducts = () => {
    const tickerProducts = [];
    const { tickers } = this.props;
    
    Object.keys(tickers).forEach((instrumentSymbol) => {
      const instrument = this.props.instruments[instrumentSymbol] || {};
      if (instrument.quote === this.state.crossProduct && instrument.base !== 'HBZ') {
        tickerProducts.push({ 
          ...tickers[instrumentSymbol],
          base: instrument.base,
          quote: instrument.quote,
          quoteDecimals: instrument.quoteDecimals
        })
      }
    })

    return tickerProducts.map((ticker, index) => (
      <TickerBlock 
        ticker={ticker} 
        key={index} 
      />
    ));
  }

  render() {
    const settings = {
      dots: false,
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 1,
      autoplay: true,
      speed: 5000,
      autoplaySpeed: 0,
      rows: 1,
      cssEase: "linear",
      // responsive: [
      //   {
      //     breakpoint: 1100,
      //     settings: {
      //       slidesToShow: 3,
      //     }
      //   },
      //   {
      //     breakpoint: 500,
      //     settings: {
      //       slidesToShow: 2,
      //     }
      //   },
      // ]
    };
    return (
      <div className='scrolling-ticker'>
        <Slider {...settings}>
          {this.renderTickerProducts()}
        </Slider>
      </div>
    );
  }
}

const mapStateToProps = ({ tickers, instruments }) => ({
  tickers,
  instruments
})

export default connect(
  mapStateToProps,
  null
)(ScrollingTicker)