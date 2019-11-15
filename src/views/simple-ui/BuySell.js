import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { floor } from '../../util/helpers';
import { changeInstrument } from '../../actions';
import { selectSelectedInstrumentBidAsk } from '../../reducers';

// Components
import BuySellOption from './buy-sell/BuySellOption';
import BuySellSelector from './buy-sell/BuySellSelector';
import SimpleUiWrapper from './SimpleUiWrapper';
import Select from '../../elements/form-controls/Select';

import config from '../../../config/config';

// Default buy sell amount values
const BUY_SELL_AMOUNTS = {
  fiat: [100, 200, 500, 1000],
  crypto: [0.01, 0.02, 0.05, 0.1],
};

const CRYPTO = 'crypto';

export class BuySell extends PureComponent {
  state = {
    transactionType: 'buy',
  };

  onInstrumentChange = (e) => {
    this.props.changeInstrument(e.target.value);
  };

  getInstrumentOptions = () => {
    const { instruments } = this.props;
    const instrumentOptions = [];
    for (const _ in instruments) {
      instrumentOptions.push({
        name: instruments[_].id,
        value: instruments[_].id,
      });
    }
    return instrumentOptions;
  };

  getBuySellOptionQuantity = (amount) => {
    const { selectedBidAsk } = this.props;
    if (this.state.transactionType === 'buy') {
      if (!Number(selectedBidAsk.ask)) {
        return 0;
      }
      return amount / selectedBidAsk.ask;
    }
    if (!Number(selectedBidAsk.bid)) {
      return 0;
    }
    return amount / selectedBidAsk.bid;
  };

  getPrices() {
    const inst = this.props.selectedInstrument || {};

    return config.buySellAmounts[inst.id] || BUY_SELL_AMOUNTS[inst.type || CRYPTO];
  }

  renderOption = (amount, index) => {
    const { selectedInstrument } = this.props;
    const {
      minimumQuantity,
      quantityIncrement,
      quote,
      base,
      quantityDecimals,
      maximumQuantity
    } = selectedInstrument;

    return (
      <BuySellOption
        amount={amount}
        baseCurrency={base}
        key={index}
        quantityDecimals={quantityDecimals}
        quantityIncrement={quantityIncrement}
        quantity={floor(
          this.getBuySellOptionQuantity(amount),
          quantityIncrement,
          true,
        )}
        minimumQuantity={minimumQuantity}
        maximumQuantity={maximumQuantity}
        quoteCurrency={quote}
        transactionType={this.state.transactionType}
      />
    );
  };

  render() {
    const amounts = this.getPrices();

    return (
      <SimpleUiWrapper
        title={_t('Buy/Sell', 'BUY_SELL.TITLE')}
        pageHeader={_t('As easy as 1-2-3', 'BUY_SELL.HEADER')}
        description={_t(
          'Select the amount you want to buy or sell, or click the custom button to buy or sell a different amount.',
          'BUY_SELL.DESCRIPTION',
        )}
        pageClass='buy-sell'
      >
        <div className="ui-controls">
          <BuySellSelector
            onChange={selectedTransactionType => () => this.setState({ transactionType: selectedTransactionType })}
            value={this.state.transactionType}
            currencyName={this.props.selectedInstrument.base}
          />
          <Select
            name="instrument"
            onChange={this.onInstrumentChange}
            options={this.getInstrumentOptions()}
            translation="BUY_SELL"
            value={this.props.selectedInstrument.id}
            hideLabel
          />
        </div>
        <div className="buy-sell-option-container">
          {amounts.map((_, i) => this.renderOption(_, i))}
        </div>
        <div className="custom-amount-container">
          <p>
            <Link to="/buy-sell-custom">{_t('Click here', 'BUY_SELL.CLICK_HERE')}</Link>
            {' '}
            {_t('to input a custom amount of digital currency.', 'BUY_SELL.CUSTOM_AMOUNT')}
          </p>
        </div>
      </SimpleUiWrapper>
    );
  }
}

const mapStateToProps = state => ({
  instruments: state.instruments,
  selectedInstrument: state.selectedInstrument,
  selectedBidAsk: selectSelectedInstrumentBidAsk(state),
});

const mapDispatchToProps = dispatch => ({
  changeInstrument: instrument => dispatch(changeInstrument(instrument)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BuySell);
