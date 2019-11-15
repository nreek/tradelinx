import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getFee, floor } from '../../../../util/helpers';
import { base, quote, selectedInstrumentAll } from '../../../../reducers/selectedInstrument';

const BUY = 'buy';
const SELL = 'sell';
const MARKET = 'market';
const LIMIT = 'limit';
const STOP = 'stop';
const GTD = 'gtd';

class OrderEntrySummary extends Component {
  render() {
    const {
      quote,
      base,
      selectedInstrument,
      amount,
      limitPrice,
      stopPrice,
      currentType,
      currentAction,
      getMarketPrice,
      getLimitPrice,
    } = this.props;
    const { fees, quantityDecimals, quoteDecimals } = selectedInstrument;
    const marketPrice = getMarketPrice();
    const limitPriceCalc = getLimitPrice(amount);
    let amountValue = currentAction === BUY ? amount : amount * marketPrice;
    amountValue = amount * (limitPrice || limitPriceCalc);

    let product = base;
    let feeProduct = quote;
    let decimal = quoteDecimals;
    let fee = getFee(amountValue, currentAction, fees);
    let net = amountValue - fee;

    if (currentAction === SELL) {
      product = quote;
      feeProduct = base;
      decimal = quantityDecimals;
      fee = getFee(amount, currentAction, fees);
      net = amount - fee;
    }

    let total;
    switch (currentType) {
      case MARKET:
        total = amount * marketPrice;
        break;

      case LIMIT:
        total = amountValue;
        break;

      case STOP:
        // TODO: this isn't exactly right for a stop order because it will become a market order
        total = amount * stopPrice;
        break;

      default:
        break;
    }

    return (
      <Fragment>
        <h2 className="transaction-summary">{_t('Transaction Summary', 'ORDER_ENTRY.TRANSACTION_SUMMARY')}</h2>
        <div className="market-price-label">
          {_t('Market Price', 'ORDER_ENTRY.MARKET_PRICE')}
:
        </div>
        <div className="market-price">{`${marketPrice} ${quote}`}</div>
        <div className="order-total-label">
          {_t('Order Total', 'ORDER_ENTRY.ORDER_TOTAL')}
:
        </div>
        <div className="order-total">
          {amount === '.' ? `0 ${quote}` : `${floor(total, decimal)} ${quote}`}
        </div>
        <div className="fees-label">
          {_t('Fees', 'ORDER_ENTRY.FEES')}
:
        </div>
        <div className="fees">
          {amount === '.' ? `0 ${feeProduct}` : `${floor(fee, decimal)} ${feeProduct}`}
        </div>
        <div className="net-label">{_t('Net', 'ORDER_ENTRY.NET')}</div>
        <div className="net">
          {amount === '.' ? `0 ${feeProduct}` : `${floor(net, decimal)} ${feeProduct}`}
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  base: base(state),
  quote: quote(state),
  selectedInstrument: selectedInstrumentAll(state),
});

export default connect(
  mapStateToProps,
  null,
)(OrderEntrySummary);
