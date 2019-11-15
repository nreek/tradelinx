import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { selectConfig, selectProducts } from '../../../reducers';

export class TransactionSummary extends PureComponent {
  render() {
    const {
      base, quote, quoteDecimals, quantityDecimals,
    } = this.props.selectedInstrument;
    const {
      basevalue, config, products, quotevalue, transactionType, fee,
    } = this.props;
    const BUY = 'buy';
    return (
      <div>
        <h3>{_t('Transaction Summary', 'BUY_SELL_CUSTOM.TRANS_TITLE')}</h3>
        <div className="summary-wrapper">
          <p>{_t('Total Amount ≈', 'BUY_SELL_CUSTOM.TRANS_TOTAL')}</p>
          <span>
            {(transactionType === BUY ? [quotevalue, quote] : [basevalue, base]).join(' ')}
          </span>
          <br />
          <p>{_t('Transaction Fee ≈', 'BUY_SELL_CUSTOM.TRANS_FEE')}</p>
          <span>{fee.toFixed(8)}</span>
          <br />
          <p>{_t('Net Amount Received ≈', 'BUY_SELL_CUSTOM.TRANS_NET_AMOUNT')}</p>
          <span>
            {(transactionType === BUY
              ? [(basevalue - fee).toFixed(quoteDecimals), base]
              : [(quotevalue - fee).toFixed(quantityDecimals), quote]
            ).join(' ')}
          </span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  config: selectConfig(state),
  selectedInstrument: state.selectedInstrument,
  products: selectProducts(state),
});

export default connect(
  mapStateToProps,
  null,
)(TransactionSummary);
