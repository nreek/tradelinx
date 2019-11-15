import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Highcharts from 'highcharts/js/highcharts'; // use this for styling via CSS
import { formatNumberToLocale } from '../../../../util/helpers';
import { selectSelectedInstrument, selectProducts, selectTickers } from '../../../../reducers';
import { mobileSetting } from '../../../../reducers/displayMobile';
import { selectCoinInfoStatus, selectCoinInfo } from '../../../../reducers/coinInfo';
import { getCoinInfo } from '../../../../actions';
import { ecoChartOptions, popChartOptions } from '../../../../../config/chart-config';
import Spinner from '../../../../elements/Spinner';
import InstrumentStats from '../../header/InstrumentStats';

class CoinInfo extends Component {
  state = {
    currentProduct: '',
    apiStatus: '',
  };

  componentDidMount() {
    // Highcharts.chart('pop-chart-id', popChartOptions);
    this.props.getCoinInfo();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedInstrument.base !== this.props.selectedInstrument.base) {
      this.props.getCoinInfo();
    }
  }

  renderBarChart = () => {
    switch (this.props.coinInfoStatus) {
      case 'PENDING':
        return <Spinner />;
      case 'SUCCESS':
        return <div id="eco-chart-id" className="coin-info-team-project-eco-container" />;
        break;
      case 'FAILED':
        return (
          <div className="coin-info-no-bar-data">
            <i className="fas fa-exclamation-circle" />
            <h3>{_t('No data available', 'MARKET_OVERVIEW.NO_DATA')}</h3>
          </div>
        );
      default:
        return <Spinner />;
    }
  };

  render() {
    const {
      selectedInstrument, products, tickers, coinInfo,
    } = this.props;
    const baseProduct = products[selectedInstrument.base] || {};
    const ticker = tickers[selectedInstrument.id] || {};
    return (
      <div className="coin-info-container">
        {!this.props.displayMobile ? (
          <Fragment>
            <div className="coin-info-price-container">
              <h2>
                {_t('Price', 'MARKET_OVERVIEW.PRICE')}
                <span>|</span>
                <span className="price-span">{formatNumberToLocale(ticker.bid, 2)}</span>
              </h2>
            </div>
            <div className="coin-info-outlook-container ">
              <h2>{coinInfo.anticipation}</h2>
            </div>
            <div className="coin-info-volume-container">
              <h2>
                {_t('Volume', 'MARKET_OVERVIEW.VOLUME')}
                <span>|</span>
                <span className="volume-span">
                  {formatNumberToLocale(ticker.volume_24h_change)}
                </span>
              </h2>
            </div>
            {this.renderBarChart()}
          </Fragment>
        ) : (
          <InstrumentStats />
        )}
        <div className="coin-info-about-container">
          <h2>{_t('About', 'MARKET_OVERVIEW.ABOUT')}</h2>
          <p>{coinInfo.description}</p>
          <p>{coinInfo.warning}</p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedInstrument: selectSelectedInstrument(state),
  products: selectProducts(state),
  tickers: selectTickers(state),
  coinInfoStatus: selectCoinInfoStatus(state),
  coinInfo: selectCoinInfo(state),
  displayMobile: mobileSetting(state),
});

const mapDispatchToProps = dispatch => ({
  getCoinInfo: () => dispatch(getCoinInfo()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CoinInfo);
