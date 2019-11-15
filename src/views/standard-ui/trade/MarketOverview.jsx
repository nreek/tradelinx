import React, { Component } from 'react';
import { connect } from 'react-redux';
import TradingViewWidget from 'react-tradingview-widget';
import { chartType } from '../../../reducers/index';
import { mobileSetting } from '../../../reducers/displayMobile';
// import DepthChart from '../DepthChart';
import FXBlueChart from './market-overview/FXBlueChart';
import TVWithExchangeData from './market-overview/TVWithExchangeData';
import TVWithExternalData from './market-overview/TVWithExternalData';
import CoinInfo from './market-overview/CoinInfo';
import InstrumentSelect from '../header/InstrumentSelect';

class MarketOverview extends Component {
  
  renderCharts = () => {
    switch (this.props.chartType) {
      case 'FXBLUE':
        return <FXBlueChart />;
        break;
      case 'TV_EXTERNAL_DATA':
        return <TVWithExternalData />;
        break;
      case 'TV_EXCHANGE_DATA':
        return <TVWithExchangeData />;
        break;
      default:
        return <TVWithExternalData />;
    }
  };

  render() {
    return (
      <div className="market-overview component">
        <div className="component-header">
          <h1>{_t('Market Overview', 'MARKET_OVERVIEW.TITLE')}</h1>
        </div>
        <div className="component-content">
          <div className='price-chart-container'>
            {this.props.displayMobile ? <InstrumentSelect /> : null}
            {this.renderCharts()}
          </div>
          <CoinInfo />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  chartType: chartType(state),
  displayMobile: mobileSetting(state),
});

export default connect(
  mapStateToProps,
  null,
)(MarketOverview);
