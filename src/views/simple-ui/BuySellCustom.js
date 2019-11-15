import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { changeInstrument, placeOrder } from '../../actions';
import { selectSelectedInstrumentBidAsk } from '../../reducers';

// Components
import BuySellOption from './buy-sell/BuySellOption';
import BuySellSelector from './buy-sell/BuySellSelector';
import CustomInput from './buy-sell/CustomInput';
import TransactionSummary from './buy-sell/TransactionSummary';
import BuySellCustomModal from './buy-sell/BuySellCustomModal';
import Select from '../../elements/form-controls/Select';
import Modal from '../../elements/Modal';
import Button from '../../elements/Button';
import SimpleUiWrapper from './SimpleUiWrapper';
import {getFee, validateOrderQuantity} from '../../util';


const BUY = 'buy';
const SELL = 'sell';

class BuySellCustom extends PureComponent {
  state = {
    transactionType: BUY,
    basevalue: '',
    quotevalue: '',
    modal: false,
  };

  closeModal = () => this.setState({ modal: false });

  onInstrumentChange = (e) => {
    this.props.changeInstrument(e.target.value);
    this.setState({
      basevalue: '',
      quotevalue: '',
    });
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

  setAmount = (e) => {
    const { transactionType } = this.state;
    const { ask, bid } = this.props.selectedBidAsk;
    const { quantityDecimals, quoteDecimals } = this.props.selectedInstrument;
    const quantity = transactionType === 'buy' ? quantityDecimals : quoteDecimals ;
    if (e.name === 'basevalue' && transactionType === BUY) {
      const calcQuote = (e.value * ask).toFixed(quantity);
      this.setState({
        quotevalue: calcQuote,
      });
    } else if (e.name === 'basevalue' && transactionType === SELL) {
      const calcQuote = (e.value * bid).toFixed(quantity);
      this.setState({
        quotevalue: calcQuote,
      });
    } else if (e.name !== 'basevalue' && transactionType === SELL) {
      const calcBase = (e.value / bid).toFixed(quantity);
      this.setState({
        basevalue: calcBase,
      });
    } else {
      const calcBase = (e.value / ask).toFixed(quantity);
      this.setState({
        basevalue: calcBase,
      });
    }
    this.setState({
      [e.name]: e.value,
    });
  };

  placeOrder = () => {
    const { transactionType, quotevalue, basevalue } = this.state;
    if (quotevalue !== '' || quotevalue > 0) {
      const order = {
        id: this.props.selectedInstrument.id,
        type: 'market',
        side: transactionType,
        quantity: parseFloat(basevalue),
        timeInForce: 'gtc', // TODO: obviously shouldn't be hardcoded!
        price: 0,
      };
      this.props.placeOrder(order);
    }
    this.setState({
      modal: true,
    });
  };

  getMarketPrice = () => {
    const { selectedBidAsk } = this.props;
    const { transactionType } = this.state;

    switch (transactionType) {
      case 'buy':
        return selectedBidAsk.ask; // If buying, get ask price
      case 'sell':
        return selectedBidAsk.bid; // If selling, get bid price
      default:
        return 0; // Should not happen
    }
  };

  render() {
    const {
      base,
      quote,
      quoteDecimals,
      id,
      fees,
      quantityDecimals,
      quantityIncrement,
      minimumQuantity,
      maximumQuantity,
    } = this.props.selectedInstrument;
    const { transactionType, quotevalue, basevalue } = this.state;
    const marketPrice = this.getMarketPrice();
    const product = transactionType === 'buy' ? base : quote;
    const decimal = transactionType === 'buy' ? quoteDecimals : quantityDecimals;
    const amountValue = transactionType === 'buy' ? basevalue : basevalue * marketPrice;
    const fee = getFee(amountValue, transactionType, fees);

    const validation = validateOrderQuantity(
      quantityIncrement,
      basevalue,
      quantityDecimals,
      minimumQuantity,
      maximumQuantity
    );
    const errors = validation.errors && basevalue.length ? validation.errors : [];

    return (
      <SimpleUiWrapper
        title={_t('Buy/Sell a Custom Amount', 'BUY_SELL_CUSTOM.TITLE')}
        pageClass="buy-sell-a-custom-amount">
        <p>
          {_t('Or ', 'BUY_SELL_CUSTOM.FIXED_AMOUNT_ONE')}
          <Link to="/buy-sell">{_t('Click here', 'BUY_SELL.CLICK_HERE')}</Link>
          {_t('to buy or sell a fixed value amount of {base}', 'BUY_SELL_CUSTOM.FIXED_AMOUNT_TWO', {
            base,
          })}
        </p>
        <div className="ui-controls">
          <BuySellSelector
            onChange={selectedTransactionType => () => this.setState({
              transactionType: selectedTransactionType,
              basevalue: '',
              quotevalue: '',
            })}
            value={transactionType}
            currencyName={base}
          />
          <Select
            name="instrument"
            onChange={this.onInstrumentChange}
            options={this.getInstrumentOptions()}
            translation="BUY_SELL"
            hideLabel
            value={id}
          />
        </div>
        <div className={ "input-container " + transactionType } >
          <div>
            <CustomInput
              transactionType={transactionType}
              basevalue={basevalue}
              quotevalue={quotevalue}
              errors={errors}
              onChange={this.setAmount}
            />
            <TransactionSummary
              transactionType={transactionType}
              basevalue={basevalue}
              quotevalue={quotevalue}
              fee={fee}
            />

            <Button
              className="button"
              onClick={() => this.placeOrder(transactionType)}
              disabled={(transactionType === BUY ? base : quote) === 0 || !validation.valid}
            >
              {transactionType === BUY
                ? _t('BUY {base}', 'BUY_SELL_CUSTOM.BUY_BUTTON', { base })
                : _t('SELL {base}', 'BUY_SELL_CUSTOM.SELL_BUTTON', { base })}
            </Button>

            {this.state.modal ? (
              <BuySellCustomModal
                quotevalue={quotevalue}
                onClose={this.closeModal}
                transactionType={transactionType}
              />
            ) : null}
          </div>
          <div>
            <h3>
              {_t('Current Price Per {base}', 'BUY_SELL_CUSTOM.CURRENT_PRICE', { base })}
              {' '}
            </h3>
            <span>
1
              {base}
            </span>
            {' '}
            <span className="price-wrapper">
              {' '}
              {marketPrice}
              {' '}
              {quote}
            </span>
          </div>
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
  placeOrder: order => dispatch(placeOrder(order)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BuySellCustom);
