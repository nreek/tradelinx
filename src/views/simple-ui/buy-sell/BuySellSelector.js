import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

class BuySellSelector extends PureComponent {
  render() {
    const { onChange, value, currencyName } = this.props;
    return (
      <div className="buy-sell-selector">
        <div
          className={`buy-selector option ${value === 'buy' ? 'active' : ''}`}
          onClick={this.props.onChange('buy')}
        >
          {_t('Buy {currency}', 'BUY_SELL.TAB_BUY', { currency: currencyName, })}
          {value === 'buy' ? <div className="select-indicator" /> : ''}
        </div>
        <div
          className={`sell-selector option ${value === 'sell' ? 'active' : ''}`}
          onClick={this.props.onChange('sell')}
        >
        {_t('Sell {currency}', 'BUY_SELL.TAB_SELL', { currency: currencyName, })}
          {value === 'sell' ? <div className="select-indicator" /> : ''}
        </div>
      </div>
    );
  }
}

BuySellSelector.propTypes = propTypes;

export default BuySellSelector;
