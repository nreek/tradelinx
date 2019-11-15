import React, { Component } from 'react';
import { connect } from 'react-redux';

class Ticker extends Component {
  // TODO: waiting for actual data to be accessible before translating these

  state = {
    btcHigh: 0,
    btcAsk: 0,
    ltcHigh: 0,
    ltcAsk: 0,
  };

  componentDidUpdate() {
    const btcHigh = Object.values(this.props.BTCUSD_TICKER)[2];
    const btcAsk = Object.values(this.props.BTCUSD_TICKER)[5];
    const ltcHigh = Object.values(this.props.LTCUSD_TICKER)[2];
    const ltcAsk = Object.values(this.props.LTCUSD_TICKER)[5];
    if (this.state.btcHigh !== btcHigh || this.state.btcAsk !== btcAsk) {
      this.setState({
        btcHigh,
        btcAsk,
      });
    }
    if (this.state.ltcHigh !== ltcHigh || this.state.ltcAsk !== ltcAsk) {
      this.setState({
        ltcHigh,
        ltcAsk,
      });
    }
  }


  render() {
    return (
      <div id="ticker">
        <ul>
          <li>BTC/USD</li>
          <li>
            {`${this.state.btcAsk}`}
            {' '}
USD
          </li>
          <li>
High:
            {`${this.state.btcHigh}`}
          </li>
        </ul>
        <ul>
          <li>ETH/USD</li>
          <li>0 USD</li>
          <li>High: 0</li>
        </ul>
        <ul>
          <li>LTC/USD</li>
          <li>
            {`${this.state.ltcAsk}`}
            {' '}
USD
          </li>
          <li>
High:
            {`${this.state.ltcHigh}`}
          </li>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = ({ tickers }) => ({
  LTCUSD_TICKER: tickers.LTCUSD,
  BTCUSD_TICKER: tickers.BTCUSD,
});


export default connect(
  mapStateToProps,
  null,
)(Ticker);
