import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { 
  selectBalances,
  selectTickers,
  selectProducts,
  selectInstruments,
  selectOpenOrders, 
  selectFilledOrders, 
  selectTransactions,
} from '../../../reducers';
import { formatNumberToLocale } from '../../../util/helpers';

// REACT COMPONENTS
import PortfolioHistoryChart from './portfolio-overview/PortfolioHistoryChart';
import PortfolioBreakdownChart from './portfolio-overview/PortfolioBreakdownChart';

// TODO: remove when getting actual portfolio history data
import { portfolioHistoryBuilder } from '../../../util/dummy-data-generators';

class PortfolioOverview extends Component {
  state = {
    activeCurrency: null,
    totalPortfolioValue: null,
    portfolioHistoricalData: [],
    portfolioBreakdownData: [],
    allTransactionData: [],
  }

  allowedTransactionTypes = ['deposit', 'withdraw', 'withdrawal'];

  componentDidMount() {
    this.compileTransactions();
    if (
      Object.keys(this.props.balances).length && 
      !this.props.balances.total &&
      Object.keys(this.props.tickers).length && 
      this.state.totalPortfolioValue === null
    ) {
      const totalPortfolioValue = this.calculatePortfolioHistoricalValue();
      const portfolioHistoricalData = portfolioHistoryBuilder(totalPortfolioValue);
      const portfolioBreakdownData = this.calculatePortfolioBreakdownData(totalPortfolioValue);

      this.setState({ 
        totalPortfolioValue, 
        portfolioHistoricalData,
        portfolioBreakdownData
      }, this.populateDonut);
    }
  }

  componentDidUpdate(prevProps) {
    if (
      Object.keys(this.props.balances).length && 
      !this.props.balances.total &&
      Object.keys(this.props.tickers).length && 
      this.state.totalPortfolioValue === null
    ) {
      const totalPortfolioValue = this.calculatePortfolioHistoricalValue();
      const portfolioHistoricalData = portfolioHistoryBuilder(totalPortfolioValue);
      const portfolioBreakdownData = this.calculatePortfolioBreakdownData(totalPortfolioValue);

      this.setState({ 
        totalPortfolioValue, 
        portfolioHistoricalData,
        portfolioBreakdownData
      }, this.populateDonut);
    }

    if (
      this.props.transactions.length !== prevProps.transactions.length ||
      this.props.openOrders.length !== prevProps.openOrders.length ||
      this.props.filledOrders.length !== prevProps.filledOrders.length
    ) {
      this.compileTransactions();
    }
  }
  
  populateDonut = () => {
    const balancesArray = [];
    const { portfolioBreakdownData } = this.state;
    portfolioBreakdownData.map(x => balancesArray.push(x.value));
    const highestBalance = portfolioBreakdownData.find(x => x.value === Math.max(...balancesArray));
    if (highestBalance) {
      this.setState({
        activeCurrency: {
          id: highestBalance.name,
          name: highestBalance.fullName,
          percentage: highestBalance.percentage,
          balance: highestBalance.balance,
        },
      });
    }
  };

  setActiveCurrency = (activeCurrency) => this.setState({ activeCurrency });

  calculatePortfolioHistoricalValue = () => {
    const { tickers, balances, baseCurrency } = this.props;

    const totalPortfolioValue = Object.entries(balances).reduce((sum, [currency, balances]) => {
      if (currency === baseCurrency) {
        return sum + +balances.total;
      } else if (tickers[`${currency}${baseCurrency}`]) {
        const ticker = tickers[`${currency}${baseCurrency}`];
        return sum + (+balances.total * +ticker.bid);
      } else {
        return sum;
      }
    }, 0)

    return totalPortfolioValue;
  }

  calculatePortfolioBreakdownData = (totalPortfolioValue = this.state.totalPortfolioValue) => {
    const { tickers, balances, products, baseCurrency } = this.props;
    
    const portfolioBreakdownData = Object.entries(balances)
      .filter(([currency, balances]) => currency === baseCurrency || tickers[`${currency}${baseCurrency}`])
      .map(([currency, { total }]) => {
        let value = +total;
        if (currency !== baseCurrency) {
          const ticker = tickers[`${currency}${baseCurrency}`];
          value *= +ticker.bid;
        }
        let percentage = (value / totalPortfolioValue) * 100 || 0;
        return { 
          name: currency, 
          fullName: products[currency].name, 
          balance: +total, 
          value, 
          percentage 
        }
      })
      .sort((a, b) => {
        if (a.value > b.value) { return -1 }
        else { return 1 }
      })

    return portfolioBreakdownData;
  }

  compileTransactions = () => {
    const { transactions, openOrders, filledOrders } = this.props;

    const filteredTransactions = (transactions || [])
      .filter(transaction => this.allowedTransactionTypes.includes(transaction.type))

    const allTransactionData = [ ...filteredTransactions, ...filledOrders, ...openOrders ];

    this.setState({ allTransactionData });
  }

  filterTransactions = (activeCurrency = this.state.activeCurrency.id) => {
    return this.state.allTransactionData
      .filter(transaction => {
        if (transaction.type === 'trade') {
          const instrument = this.props.instruments[transaction.security_id] || {};
          return activeCurrency === instrument.base;
        } else if (this.allowedTransactionTypes.includes(transaction.type)) {
          return activeCurrency === transaction.currency_id;
        }
      });
  }

  render() {
    const { 
      totalPortfolioValue, 
      portfolioHistoricalData, 
      portfolioBreakdownData, 
      allTransactionData,
      activeCurrency, 
    } = this.state;
    const { products, balances, tickers, baseCurrency } = this.props;
    
    let activeTransactions = [];
    let activeTicker = {};
    let pxChange, pxClass, pxTransactions, displayedPxTransactions = '';
    if (activeCurrency) {
      activeTransactions = this.filterTransactions(activeCurrency.id) || [];
      activeTicker = tickers[`${activeCurrency.id}${baseCurrency}`] || {};
      pxChange = activeTicker.price_24h_change || 0;
      pxClass = pxChange > 0 ? 'up' : pxChange < 0 ? 'down' : ''; 
      pxTransactions = (activeTransactions.length / allTransactionData.length * 100) || 0;
      if (pxTransactions > 0 && pxTransactions < 1) {
        displayedPxTransactions = '<1';
      } else if (pxTransactions > 99 && pxTransactions < 100) {
        displayedPxTransactions = '>99';
      } else {
        displayedPxTransactions = formatNumberToLocale(pxTransactions, 0);
      }
    }

    return (
      <div className='portfolio-overview component'>
        <div className='component-header'>
          <h1>{_t('Portfolio Overview', 'PORTFOLIO_OVERVIEW.TITLE')}</h1>
        </div>
        <div className='component-content'>
          <PortfolioHistoryChart portfolioHistoricalData={portfolioHistoricalData} totalPortfolioValue={totalPortfolioValue} />
          <PortfolioBreakdownChart 
            portfolioBreakdownData={portfolioBreakdownData} 
            activeCurrency={activeCurrency}
            setActiveCurrency={this.setActiveCurrency}
          />
          <div className='portfolio-balance-container'>
            <h2><span>${formatNumberToLocale(totalPortfolioValue, 2)}</span> {_t('Account Balance', 'PORTFOLIO_OVERVIEW.ACCOUNT_BALANCE')}</h2>
          </div>
          <div className='portfolio-details-container'>
            <h2><span>{Object.keys(balances).length}</span> {_t('Total Wallets', 'PORTFOLIO_OVERVIEW.TOTAL_WALLETS')}</h2>
            {activeCurrency ?
              <h2><span>{activeTransactions.length}</span> {_t(
                `{currency} Transactions`, 
                'PORTFOLIO_OVERVIEW.TOTAL_TRANSACTIONS', 
                { currency: activeCurrency.id }
              )}</h2>
            :
              <h2><span>{allTransactionData.length}</span> {_t(
                `{currency} Transactions`, 
                'PORTFOLIO_OVERVIEW.TOTAL_TRANSACTIONS', 
                { currency: 'Total' }
              )}</h2>
            }
          </div>
          {activeCurrency &&
            <div className='portfolio-stats-container'>
              <h2><span className={pxClass}>{formatNumberToLocale(pxChange, 0)}%</span> {_t('24 Hour Change', 'PORTFOLIO_OVERVIEW.24H_CHANGE')}</h2>
              <h2 dangerouslySetInnerHTML={{__html: _t(
                `<span>{displayedPxTransactions}%</span> of Total Transactions`,
                'PORTFOLIO_OVERVIEW.PX_OF_TOTAL_TRANSACTIONS',
                { displayedPxTransactions }
              )}}/>
            </div>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  balances: selectBalances(state),
  tickers: selectTickers(state),
  products: selectProducts(state),
  instruments: selectInstruments(state),
  baseCurrency: state.config.baseCurrency,
  filledOrders: selectFilledOrders(state),
  openOrders: selectOpenOrders(state),
  transactions: selectTransactions(state),
})

export default connect(
  mapStateToProps,
  null
)(PortfolioOverview);