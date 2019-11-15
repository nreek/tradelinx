import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Components
import BuySellModal from './BuySellModal';
import Button from '../../../elements/Button';
import {validateOrderQuantity} from "../../../util";

const propTypes = {
  amount: PropTypes.number,
  quantity: PropTypes.number,
  quoteCurrency: PropTypes.string,
  minimumQuantity: PropTypes.number,
  t: PropTypes.string,
};

const defaultProps = {
  amount: 0,
  quantity: '0',
  t: 'BUY_SELL',
};

class BuySellOption extends Component {
  state = { modal: false };

  closeModal = () => this.setState({ modal: false });

  formatAmount = (amount) => {
    if (this.props.quoteCurrency === 'USD') {
      return `$${amount}`;
    }
    return amount;
  };

  render() {
    const {
      amount,
      baseCurrency,
      quantity,
      quoteCurrency,
      transactionType,
      t,
      minimumQuantity,
      maximumQuantity,
      quantityIncrement,
      quantityDecimals,
    } = this.props;
    const validation = validateOrderQuantity(quantityIncrement, quantity, quantityDecimals, minimumQuantity, maximumQuantity);

    return (
      <div className={ "buy-sell-option " + _t(transactionType, `${t}.SIDE_${transactionType.toUpperCase()}`) }>
        <div className="quantity-container">
          <div className="transaction-type">{_t(transactionType, `${t}.SIDE_${transactionType.toUpperCase()}`)}</div>
          <div>{`~${quantity}`}</div>
          <div>{baseCurrency}</div>
        </div>
        <div className="amount-container">
          <div className="for">{_t('For', `${this.props.t}.FOR`)}</div>
          <div className="amount">
            <div>{this.formatAmount(amount)}</div>
            <div>{quoteCurrency}</div>
          </div>
          <div>
            <Button onClick={() => this.setState({ modal: true })} disabled={quantity === 0 || !validation.valid}>
              {_t('Select', `${this.props.t}.SELECT`)}
            </Button>
            {this.state.modal ? (
              <BuySellModal
                amount={amount}
                quantity={quantity}
                onClose={this.closeModal}
                notify={this.props.notify}
                transactionType={transactionType}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

BuySellOption.propTypes = propTypes;
BuySellOption.defaultProps = defaultProps;

export default BuySellOption;
