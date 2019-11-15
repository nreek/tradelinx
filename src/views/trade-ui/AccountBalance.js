import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { floor } from '../../util/helpers';
import { loadAccounts } from '../../actions';
import { selectSelectedInstrument, selectBalances, selectProducts } from '../../reducers';


export class AccountBalance extends Component {
  componentDidMount() {
    this.props.loadData();
  }

  loadBalances = () => {
    const currentBalances = Object.entries(this.props.balances);
    const { balances, selectedInstrument, products } = this.props;
    const { base, quote } = selectedInstrument; 

    return currentBalances.map((data, i) => {
      const [currency, balObj] = data;
      const baseBalance = balances[currency];
      var productDecimal;

      if (products[currency] !== undefined){
        productDecimal = products[currency]['decimals'];
      }
            
      if (balObj !== undefined && currency !== base && currency !== quote) {
        if (balObj.total !== '0') {
          return (
            <div key={i} className="account-balance-rows currency-not-base-or-quote">
              <div className="account-balance-row">
                <span className="account-balance-product">{`${currency}`}</span>
                <span className="account-balance-available">
                  {baseBalance && floor(parseFloat(baseBalance.trading), productDecimal || 2)}
                </span>
                <span className="account-balance-available account-total-balance-available">{floor(parseFloat(balObj.total), productDecimal || 2)}</span>
              </div>
            </div>
          );
        }
      }
    });
  };

  render() {
    const {
      base, quote
    } = this.props.selectedInstrument;

    const { products } = this.props;
    const baseBalance = this.props.balances[base];
    const quoteBalance = this.props.balances[quote];
    const baseDecimals = products[base] ? products[base].decimals : 2;
    const quoteDecimals = products[quote] ? products[quote].decimals : 2;

    return (
      <Fragment>
        <div className="account-balance-header">
          <span className="account-balance-product">
            {_t('Product', 'ACCOUNT_BALANCE.PRODUCT')}
          </span>
          <span className="account-balance-available">
            {_t('Available', 'ACCOUNT_BALANCE.AVAILABLE')}
          </span>
          <span className="account-balance-total">{_t('Total', 'ACCOUNT_BALANCE.TOTAL')}</span>
        </div>
        <div className="account-balance-rows">
          <div className="account-balance-row quote-currency-stats">
            <span className="account-balance-product">{`${quote}`}</span>
            <span className="account-balance-available">
              {quoteBalance && floor(parseFloat(quoteBalance.trading), quoteDecimals)}
            </span>
            <span className="account-balance-total">
              {quoteBalance && floor(parseFloat(quoteBalance.total), quoteDecimals)}
            </span>
          </div>
          <div className="account-balance-row base-currency-stats">
            <span className="account-balance-product">{`${base}`}</span>
            <span className="account-balance-available">
              {baseBalance && floor(parseFloat(baseBalance.trading), baseDecimals)}
            </span>
            <span className="account-balance-total">
              {baseBalance && floor(parseFloat(baseBalance.total), baseDecimals)}
            </span>
          </div>
        </div>
        <div className="account-balance-header all-balances-header">
          <span className="account-balance-product" />
        </div>
        <div className="all-balances-container">
          <PerfectScrollbar>{this.loadBalances()}</PerfectScrollbar>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  selectedInstrument: selectSelectedInstrument(state),
  balances: selectBalances(state),
  products: selectProducts(state),
});

const mapDispatchToProps = dispatch => ({
  loadData: () => dispatch(loadAccounts()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountBalance);
