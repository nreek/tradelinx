import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Highcharts from 'highcharts/js/highcharts'; // use this for styling via CSS
// import Highcharts from 'highcharts'; // use this for styling via options in config.js
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

// Redux
import { selectTickers, selectProducts } from '../../../reducers';
import { changeInstrument } from '../../../actions';

// Helpers
import { formatNumberToLocale, toSnakeCase, capitalize } from '../../../util/helpers';

class MarketActivity extends Component {
  state = {
    filter: '',
    favorites: [],
    productHistoricalData: {},
    showSortDropdown: false,
    sortBy: null,
    redirectToTrade: false,
  };

  sortOptions = [
    'favorites',
    'ascending',
    'descending',
  ]

  bitfinexWS = new WebSocket('wss://api.bitfinex.com/ws/2'); // opens bitfinex websocket for product historical price data

  componentDidMount() {
    if (localStorage.userFavorites) {
      // TODO: Update once a service to add this to a user's account is completed
      const favorites = JSON.parse(localStorage.userFavorites);
      this.setState({ favorites });
    }

    this.bitfinexWS.addEventListener('open', this.subscribeToChannels);

    this.bitfinexWS.addEventListener('message', (msg) => {
      this.handleSubscriptionMessage(JSON.parse(msg.data));
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // in case the instruments load after the bitfinex websocket is open
    if (prevProps.products.length < this.props.products.length && this.w.readyState === 1) {
      // websocket readyState of 1 is 'OPEN'
      this.subscribeToChannels();
    }

    if (this.state.filter !== prevState.filter || this.state.sortBy !== prevState.sortBy) {
      Object.keys(this.props.products).forEach((productId) => {
        const instrument = `${productId}${this.props.baseCurrency}`;
        if (this[`${instrument}-price-chart`]) {
          this[`${instrument}-price-chart`].destroy();
          delete this[`${instrument}-price-chart`];
        }
      });
      this.updatePriceCharts();
    }
  }

  componentWillUnmount() {
    this.bitfinexWS.close(1000, 'Market activity component unmounting');
  }

  toggleSortDropdown = () => this.setState({ showSortDropdown: !this.state.showSortDropdown });

  setSort = (sortBy) => {
    if (sortBy !== this.state.sortBy) {
      this.setState({ sortBy });
    } else {
      this.setState({ sortBy: null });
    }
  };

  onFilterChange = e => this.setState({ filter: e.target.value.toUpperCase() });

  isProductFiltered = id => !id.toUpperCase().includes(this.state.filter);

  subscribeToChannels = () => {
    const { products, tickers, baseCurrency } = this.props;

    Object.entries(products)
      .filter(([productId, product]) => product.type === 'crypto')
      .forEach(([productId, product]) => {
        const symbol = `${productId}${baseCurrency}`;

        const msg = JSON.stringify({
          event: 'subscribe',
          channel: 'candles',
          key: `trade:1h:t${symbol}`,
        });
        this.bitfinexWS.send(msg);
      });
  };

  handleSubscriptionMessage = (msg) => {
    const { productHistoricalData } = this.state;

    if (msg.event) {
      if (msg.event === 'subscribed') {
        const { key } = msg;
        productHistoricalData[msg.chanId] = { key };
      } else if (msg.event === 'unsubscribed') {
        delete productHistoricalData[msg.chanId];
      }
    }
    if (Array.isArray(msg[1]) && Array.isArray(msg[1][0])) {
      const channelId = msg[0];
      const data = msg[1].filter(dataPoint => dataPoint[0] >= msg[1][0][0] - 604800000);

      productHistoricalData[channelId].data = data;

      this.setState({ productHistoricalData }, this.updatePriceCharts);
    } else if (Array.isArray(msg[1]) && msg[1].length > 0) {
      const channelId = msg[0];
      const update = msg[1];
      const { data } = productHistoricalData[channelId];
      const index = data.findIndex(dataPoint => dataPoint[0] === update[0]);
      if (index === -1) {
        data.pop();
        data.unshift(update);
        productHistoricalData[channelId].data = data;
        this.setState({ productHistoricalData }, this.updatePriceCharts);
      }
    }
  };

  unsubscribeFromChannels = () => {
    Object.keys(this.state.historicalData).forEach((chanId) => {
      const msg = JSON.stringify({
        event: 'unsubscribe',
        chanId,
      });
      this.bitfinexWS.send(msg);
    });
  };

  updatePriceCharts = () => {
    Object.values(this.state.productHistoricalData).forEach((dataSet) => {
      const instrument = dataSet.key.split(':')[2].slice(1);
      if (
        document.querySelector(`#${instrument}-price-chart`)
        && !this[`${instrument}-price-chart`]
      ) {
        this.createPriceChart(instrument);
      }
      if (this[`${instrument}-price-chart`] && dataSet.data) {
        const productData = dataSet.data.map(dataPoint => [dataPoint[0], dataPoint[3]]) || [];
        this[`${instrument}-price-chart`].series[0].setData(productData.reverse());
      }
    });
  };

  createPriceChart = (instrument) => {
    const productChartOptions = {
      chart: {
        type: 'area',
        backgroundColor: 'rgba(0,0,0,0)',
      },
      title: { text: undefined },
      legend: { enabled: false },
      tooltip: { enabled: false },
      xAxis: { visible: false },
      yAxis: { visible: false },
      credits: { enabled: false },
      plotOptions: {
        area: {
          animation: false,
        },
        series: {
          softThreshold: true,
          lineWidth: 1,
          marker: { enabled: false },
          states: {
            hover: {
              enabled: false,
            },
          },
        },
      },
      series: [
        {
          name: 'Price',
          data: [],
        },
      ],
    };
    this[`${instrument}-price-chart`] = Highcharts.chart(
      `${instrument}-price-chart`,
      productChartOptions,
    );
  };

  selectAndRedirect = (productId) => {
    this.props.changeInstrument(`${productId}${this.props.baseCurrency}`);
    this.setState({ redirectToTrade: true });
  };

  renderProducts = () => {
    const { products, tickers, baseCurrency } = this.props;
    const { favorites, sortBy } = this.state;

    let filteredProducts = Object.entries(products);

    switch (sortBy) {
      case 'favorites':
        filteredProducts = filteredProducts.filter(([productId, product]) => favorites.includes(`${productId}${baseCurrency}`));
        break;
      case 'ascending':
        filteredProducts = filteredProducts
          .sort((a,b) => {
            const aProduct = a[0];
            const bProduct = b[0];
            return aProduct.localeCompare(bProduct);
          });
        break;
      case 'descending':
          filteredProducts = filteredProducts
          .sort((a,b) => {
            const aProduct = a[0];
            const bProduct = b[0];
            return bProduct.localeCompare(aProduct);
          });
        break;
      case 'all':
      default:
        break;
    }

    return filteredProducts
      .filter(([productId, product]) => (
        product.type === 'crypto'
          && (!this.isProductFiltered(product.name) || !this.isProductFiltered(productId))
      ))
      .map(([productId, product], index) => {
        const ticker = tickers[`${productId}${baseCurrency}`] || {};
        const pxChange = ticker.price_24h_change || 0;
        const pxClass = pxChange > 0 ? 'up' : pxChange < 0 ? 'down' : '';
        
        return (
          <div
            className={`currency ${productId} block`}
            onClick={() => this.selectAndRedirect(productId)}
            key={index}
          >
            <h2 className="currency-label">
              <img
                alt=''
                className={`currency-icon ${productId}-icon`}
                src={`images/icons/currency-icons/black/${productId}.svg`}
              />
              <span className="currency-name">{product.name}</span>
            </h2>
            <p className="currency-stats">
              <span className="best-bid">
                ${formatNumberToLocale(ticker.bid, 2)}
              </span>
              &nbsp;|&nbsp;
              <span className={`px-change ${pxClass}`}>
                {formatNumberToLocale(pxChange, 2)}%
              </span>
            </p>
            <div
              className={`currency-price-chart ${pxClass}`}
              id={`${productId}${baseCurrency}-price-chart`}
            />
          </div>
        );
      });
  };

  renderSortDropdown = () => {
    const { sortBy } = this.state;
    return (
      <div className="sort-dropdown">
        {this.sortOptions.map((sortOption, index) => {
          return (
            <p className="sort-option" onClick={() => this.setSort(sortOption)} key={index}>
              <i className={`far fa-${sortBy === sortOption ? 'dot-' : ''}circle`} />
              &nbsp;
              <span>{_t(capitalize(sortOption), `WALLETS.${toSnakeCase(sortOption, 'uppercase')}`)}</span>
            </p>
          )
        })}
      </div>
    );
  };

  render() {
    if (this.state.redirectToTrade) {
      return <Redirect to="/trade" />;
    }

    return (
      <div className="market-activity component">
        <div className="component-header">
          <h1>{_t('Market Activity', 'MARKET_ACTIVITY.TITLE')}</h1>
        </div>
        <div className="component-content">
          <div className="search-bar">
            <div className="filter-input-container">
              <i className="fal fa-search" />
              <input
                onChange={this.onFilterChange}
                placeholder={_t('Search', 'MARKET_ACTIVITY.SEARCH_PLACEHOLDER')}
                value={this.state.filter}
              />
            </div>
            <div className="filter-sort-container">
              <h2>{_t('Sort', 'MARKET_ACTIVITY.SORT')}</h2>
              &nbsp;
              {this.state.showSortDropdown ? (
                <i className="far fa-ellipsis-h-alt" onClick={this.toggleSortDropdown} />
              ) : (
                <i className="far fa-ellipsis-h" onClick={this.toggleSortDropdown} />
              )}
              {this.state.showSortDropdown && this.renderSortDropdown()}
            </div>
          </div>
          <div className="currency-list">
            <PerfectScrollbar>{this.renderProducts()}</PerfectScrollbar>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  products: selectProducts(state),
  tickers: selectTickers(state),
  baseCurrency: state.config.baseCurrency,
});

const mapDispatchToProps = dispatch => ({
  changeInstrument: instrument => dispatch(changeInstrument(instrument)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MarketActivity);
