import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import PropTypes from 'prop-types';
import moment from 'moment';

import { selectSelectedInstrumentBidAsk, selectSelectedInstrumentId } from '../../reducers';
import { placeOrder, loadAccounts, loadL2Data } from '../../actions';
import {getFee, floor, validateOrderQuantity} from '../../util';
import TextInput from '../../elements/form-controls/TextInput';
import Select from '../../elements/form-controls/Select';
import DateInput from '../../elements/form-controls/DateInput';
import { advancedOrderTypes } from '../../constants';
import 'react-toastify/dist/ReactToastify.css';


const BUY = 'buy';
const SELL = 'sell';
const MARKET = 'market';
const LIMIT = 'limit';
const STOP = 'stop';
const GTD = 'gtd';
const FIELD_AMOUNT = 'amount';

const DEFAULT_ORDER_TYPE = advancedOrderTypes[0].value;

const propTypes = {
  base: PropTypes.string,
  id: PropTypes.string,
  quote: PropTypes.string,
  selectedBidAsk: PropTypes.instanceOf(Object),
  quoteDecimals: PropTypes.number,
  products: PropTypes.instanceOf(Object),
  selectedInstrument: PropTypes.instanceOf(Object),
  orderbook: PropTypes.instanceOf(Object),
  loadData: PropTypes.instanceOf(Function),
  loadOrderBook: PropTypes.instanceOf(Function),
  placeOrder: PropTypes.instanceOf(Function),
};

const defaultProps = {
  base: '',
  quote: '',
  id: '',
  selectedBidAsk: {},
  quoteDecimals: 0,
  products: {},
  selectedInstrument: {},
  orderbook: {},
  loadData: () => {},
  loadOrderBook: () => {},
  placeOrder: () => {},
};

class OrderEntry extends Component {
  state = {
    orderTypes: [
      { key: MARKET, label: _t('Market', 'ORDER_ENTRY.MARKET') },
      { key: LIMIT, label: _t('Limit', 'ORDER_ENTRY.LIMIT') },
      { key: STOP, label: _t('Stop', 'ORDER_ENTRY.STOP') },
      // { key: 'stop-limit', label: 'Stop Limit' }
    ],
    inputFocused: false,
    currentType: MARKET,
    currentAction: BUY,
    amount: '',
    limitPrice: '',
    stopPrice: '',
    orderQuantityErrors: [],
    invalidForm: false,
    showAdvancedOrderModal: false,
    activeOrder: false,
    advancedOrderType: DEFAULT_ORDER_TYPE,
    expireDate: new Date().getTime(),
  };

  componentDidMount() {
    this.props.loadData();
    this.props.loadOrderBook(this.props.selectedInstrument.id);
    if (this.props.orderStatus === 'accepted' || this.props.orderStatus === 'rejected') {
      this.setState({ activeOrder: true });
    }
  }

  getMarketPrice = () => {
    const { currentAction } = this.state;
    const { selectedBidAsk } = this.props;
    switch (currentAction) {
      case BUY:
        return selectedBidAsk.ask; // If buying, get ask price

      case SELL:
        return selectedBidAsk.bid; // If selling, get bid price

      default:
        return 0; // Should not happen
    }
  };

  getLimitPrice = (qty = 0) => {
    switch (this.state.currentAction) {
      case BUY:
        return this.props.selectedBidAsk.ask; // If buying, get ask price

      case SELL:
        let totalQty = 0;

        let vwap = this.props.orderbook.bids.reduce((accumulator, currentValue) => {
          const currentQtyBalance = qty - totalQty;
          const currentQty = currentValue.quantity * 1;
          if (currentQtyBalance <= currentQty) {
            totalQty = qty;
            return accumulator + currentQtyBalance * currentValue.price;
          }
          totalQty += currentQty;
          return accumulator + currentQty * currentValue.price;
        }, 0);

        if (totalQty < qty) {
          vwap += (qty - totalQty) * this.props.selectedBidAsk.bid * 1;
        }

        return vwap / qty || 0;

      default:
        return 0; // Should not happen
    }
  };

  setOrderType = orderType => this.setState({ currentType: orderType });

  setOrderAction = action => this.setState({ currentAction: action });

  setOrderQuantityErrors = errors => this.setState({ orderQuantityErrors: errors });

  setValidationOrderQuantity = quantity => {
    const {
      quantityIncrement,
      minimumQuantity,
      quantityDecimals,
      maximumQuantity,
    } = this.props.selectedInstrument;
    // Validation of order quantity
    const validatedOrderQuantity = validateOrderQuantity(
      quantityIncrement,
      quantity,
      quantityDecimals,
      minimumQuantity,
      maximumQuantity
    );
    this.setOrderQuantityErrors(validatedOrderQuantity.errors);
  };

  handleInputChange = (decimalPlaces, name) => (e) => {
    const { value } = e.target;

    if(name === FIELD_AMOUNT) {
      this.setValidationOrderQuantity(value);
    }

    if(name === 'expireDate') {
      this.setState({ [name]: new Date(value).getTime() });
    } else if (value === '.'){
      this.setState({ [name]: value });
    } else {
      this.setState({ [name]: value });
    }
  };

  handleSelectChange = name => (e) => {
    const { value } = e.target;
    this.setState({ [name]: value });
  };

  handleFocus = (e) => this.setState({ inputFocused: true });

  handleInputUnfocus = (e) => {
    const { name, value } = e.target;
    this.setState({ inputFocused: false });
    if (!value) {
      this.setState({ [name]: ''});
    }
  };

  // toggleAdvancedOrders = () => {
  //   this.setState({
  //     showAdvancedOrderModal: !this.state.showAdvancedOrderModal
  //   });
  // };

  placeOrder = () => {
    const { id } = this.props;
    const {
      currentType,
      currentAction,
      amount,
      limitPrice,
      stopPrice,
      advancedOrderType,
      expireDate,
    } = this.state;
    const order = {
      id,
      type: currentType,
      side: currentAction,
      quantity: parseFloat(amount),
      timeInForce: DEFAULT_ORDER_TYPE,
    };

    switch (order.type) {
      case LIMIT:
        order.price = limitPrice || this.getLimitPrice(order.quantity);
        order.timeInForce = advancedOrderType;
        if (advancedOrderType === GTD) {
          order.expire_time = expireDate;
        }
        break;

      case STOP:
        order.price = stopPrice;
        order.timeInForce = advancedOrderType;
        if (advancedOrderType === GTD) {
          order.expire_time = expireDate;
        }
        break;

      default:
        order.price = 0;
    }

    this.props.placeOrder(order);
    this.setState({
      activeOrder: false,
      amount: '',
    });
  };

  generateFormFields = (orderType, orderAction, base, quote, quoteDecimals) => {
    const { products } = this.props;
    let fields = [];
    const orderActionStr = orderAction === BUY
      ? _t('Buy', 'ORDER_ENTRY.BUY')
      : orderAction === SELL
        ? _t('Sell', 'ORDER_ENTRY.SELL')
        : '';

    // 'label' is what is displayed on the label
    // 'value' corresponds with the value in state, must match key
    switch (orderType) {
      case MARKET:
        fields = [
          {
            label: _t('{action} Amount ({currency})', 'ORDER_ENTRY.ACTION_AMOUNT', {
              action: orderActionStr,
              currency: base,
            }),
            value: 'amount',
            type: 'input',
            decimals: quoteDecimals,
            placeholderParam: {
              action: orderActionStr,
              currency: base,
            },
          },
        ];
        break;

      case LIMIT:
        fields = [
          {
            name: _t('Order Type', 'ORDER_ENTRY.ADVANCE_ORDER_TYPE'),
            value: 'advancedOrderType',
            type: 'select',
            options: advancedOrderTypes,
          },
          {
            label: _t('{action} Amount ({currency})', 'ORDER_ENTRY.ACTION_AMOUNT', {
              action: orderActionStr,
              currency: base,
            }),
            value: 'amount',
            type: 'input',
            decimals: quoteDecimals,
            placeholderParam: {
              action: orderActionStr,
              currency: base,
            },
          },
          {
            label: _t('Price Per {currency}', 'ORDER_ENTRY.LIMIT_PRICE_AMOUNT', { currency: quote }),
            value: 'limitPrice',
            type: 'input',
            decimals: quote ? products[quote].decimals : 0,
            placeholderParam: { currency: quote },
          },
          {
            label: _t('Expire time', 'ORDER_ENTRY.ORDER_DATE'),
            value: 'expireDate',
            type: 'date',
            name: _t('Expire time', 'ORDER_ENTRY.ORDER_DATE'),
            showTimeSelect: true,
            appare: {
              name: 'advancedOrderType',
              value: GTD
            }
          },
        ];
        break;

      case STOP:
        fields = [
          {
            name: _t('Order Type', 'ORDER_ENTRY.ADVANCE_ORDER_TYPE'),
            value: 'advancedOrderType',
            type: 'select',
            options: advancedOrderTypes,
          },
          {
            label: _t('{action} Amount ({currency})', 'ORDER_ENTRY.ACTION_AMOUNT', {
              action: orderActionStr,
              currency: base,
            }),
            value: 'amount',
            type: 'input',
            decimals: quoteDecimals,
            placeholderParam: {
              action: orderActionStr,
              currency: base,
            },
          },
          {
            label: _t('Stop Price ({currency})', 'ORDER_ENTRY.STOP_PRICE_AMOUNT', {
              currency: quote,
            }),
            value: 'stopPrice',
            type: 'input',
            decimals: quote ? products[quote].decimals : 0,
            placeholderParam: {
              action: orderActionStr,
              currency: quote,
            },
          },
          {
            label: _t('Expire time', 'ORDER_ENTRY.ORDER_DATE'),
            name: _t('Expire time', 'ORDER_ENTRY.ORDER_DATE'),
            value: 'expireDate',
            type: 'date',
            showTimeSelect: true,
            appare: {
              name: 'advancedOrderType',
              value: GTD
            }
          },
        ];
        break;

      case 'stop-limit':
        fields = [
          {
            label: _t('{action} Amount ({currency})', 'ORDER_ENTRY.ACTION_AMOUNT', {
              action: orderActionStr,
              currency: base,
            }),
            value: 'amount',
            type: 'input',
          },
          {
            label: _t('Limit Price ({currency})', 'ORDER_ENTRY.LIMIT_PRICE', { currency: quote }),
            value: 'limitPrice',
            type: 'input',
          },
          {
            label: _t('Stop Price ({currency})', 'ORDER_ENTRY.STOP_PRICE_AMOUNT', {
              currency: quote,
            }),
            value: 'stopPrice',
            type: 'input',
          },
        ];
        break;

      default:
        break;
    }

    return fields;
  };

  renderTypeButtons = () => this.state.orderTypes.map((type, index) => (
    <div
      key={index}
      className={`order-entry-type-button ${
        this.state.currentType === type.key ? 'selected' : ''
      }`}
      role="button"
      onClick={() => this.setOrderType(type.key)}
    >
      {type.label}
    </div>
  ));

  renderActionButtons = () => {
    const { currentAction } = this.state;
    return (
      <Fragment>
        <div
          className={`order-entry-action-button ${currentAction === BUY ? 'selected' : ''}`}
          role="button"
          onKeyPress={() => this.setOrderAction(SELL)}
          onClick={() => this.setOrderAction(BUY)}
        >
          {_t('Buy', 'ORDER_ENTRY.BUY')}
        </div>
        <div
          className={`order-entry-action-button ${currentAction === SELL ? 'selected' : ''}`}
          role="button"
          onKeyPress={() => this.setOrderAction(SELL)}
          onClick={() => this.setOrderAction(SELL)}
        >
          {_t('Sell', 'ORDER_ENTRY.SELL')}
        </div>
      </Fragment>
    );
  };

  addIframePointerEventsNone = () => (
    <Fragment>
      <style dangerouslySetInnerHTML={{__html: `
      iframe { pointer-events: none !important }
    `}} />
    </Fragment>
  );

  /**
   * Can be added other checks
   */
  checkAllErrorsForField = (field) => {
    const { orderQuantityErrors, amount, invalidForm} = this.state
    const errors = [];
    
    if(orderQuantityErrors && amount !== '')

    if(field.value === FIELD_AMOUNT) {
      orderQuantityErrors.forEach(error => errors.push(error))
    }
    if(orderQuantityErrors.length && !invalidForm){
      this.setState({ invalidForm: true });
    } else if(!orderQuantityErrors.length && invalidForm){
      this.setState({ invalidForm: false });
    }
     
    return errors;
  };

  renderForm = () => {
    const { currentType, currentAction } = this.state;
    const { base, quote, quoteDecimals } = this.props;
    const fields = this.generateFormFields(currentType, currentAction, base, quote, quoteDecimals);

    return fields.map((field, index) => {
      const errors = this.checkAllErrorsForField(field);

      return (
        <Fragment key={index}>
        {(!field.appare || (this.state[field.appare.name] === field.appare.value)) && (
          <Fragment>
            {field.type === 'input' && (
              <div className="order-entry-field" key={index}>
                <TextInput
                  errorMessages={errors}
                  className={errors.length ? 'input-error' : ''}
                  name={''}
                  onChange={this.handleInputChange(field.decimals, field.value)}
                  onBlur={this.handleInputUnfocus}
                  onFocus={this.handleFocus}
                  value={this.state[field.value]}
                  placeholder={''}
                  label={field.label}
                  translation="ORDER_ENTRY"
                  placeholderParam={field.placeholderParam}
                />
              </div>
            )}
            {this.state.inputFocused && this.addIframePointerEventsNone()}
            {field.type === 'select' && (
              <div className="order-entry-field" key={index}>
                <Select
                  name={field.name}
                  onChange={this.handleSelectChange(field.value)}
                  value={this.state[field.value]}
                  translation="ORDER_ENTRY"
                  options={field.options}
                />
              </div>
            )}
            {field.type === 'date' && (
              <div className="order-entry-field" key={index}>
                <DateInput
                  name={''}
                  onChange={this.handleInputChange(field.decimals, field.value)}
                  onBlur={this.handleInputUnfocus}
                  value={this.state[field.value]}
                  placeholder={''}
                  label={field.label}
                  placeholderText={''}
                  translation="ORDER_ENTRY"
                  minDate={moment()}
                  showTimeSelect={field.showTimeSelect}
                />
              </div>
            )}
          </Fragment>
        )}
        </Fragment>
      )
    });
  };

  renderSummary = () => {
    const { quote, base, selectedInstrument } = this.props;
    const { fees, quantityDecimals, quoteDecimals } = selectedInstrument;
    const {
      amount, limitPrice, stopPrice, currentType, currentAction,
    } = this.state;
    const marketPrice = this.getMarketPrice();
    const limitPriceCalc = this.getLimitPrice(amount);
    let amountValue = currentAction === BUY ? amount : amount * marketPrice;
    amountValue = amount * (limitPrice || limitPriceCalc);

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

    const feeProduct = (currentAction === BUY) ? base : quote;
    const decimal = (currentAction === BUY) ? quantityDecimals : quoteDecimals;
    const fee = getFee((currentAction === BUY ? amount : total), currentAction, fees);
    const net = (currentAction === BUY) ? (amount - fee) : (total - fee);

    return (
      <Fragment>
        <div className="market-price-label">
          {_t('Market Price', 'ORDER_ENTRY.MARKET_PRICE')}:
        </div>
        <div className="market-price">{`${marketPrice} ${quote}`}</div>
        <div className="order-total-label">
          {_t('Order Total', 'ORDER_ENTRY.ORDER_TOTAL')}:
        </div>
        <div className="order-total">{amount === '.' ? `0 ${quote}` : `${floor(total, decimal)} ${quote}`}</div>
        <div className="fees-label">
          {_t('Fees', 'ORDER_ENTRY.FEES')}:
        </div>
        <div className="fees">{amount === '.' ? `0 ${feeProduct}` : `${floor(fee, decimal)} ${feeProduct}`}</div>
        <div className="fees-label">
          {_t('Net', 'ORDER_ENTRY.NET')}
        </div>
        <div className="net">{amount === '.' ? `0 ${feeProduct}` : `${floor(net, decimal)} ${feeProduct}`}</div>
      </Fragment>
    );
  };

  render() {
    const { amount } = this.state;

    return (
      <Fragment>
        <div className="order-entry-type-buttons">{this.renderTypeButtons()}</div>
        <div className="order-entry-action-buttons">{this.renderActionButtons()}</div>
        <div className="order-entry-form">{this.renderForm()}</div>
        <div className="order-entry-summary">{this.renderSummary()}</div>
        <div className="order-entry-buttons">
          <button
            className="place-order-button"
            type="button"
            onClick={amount !== '' ? this.placeOrder : null}
            disabled={this.state.invalidForm}
          >
            {_t('Place Order', 'ORDER_ENTRY.PLACE_ORDER')}
          </button>
        </div>
        {this.state.activeOrder === false ? <ToastContainer /> : null}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  base: state.selectedInstrument.base, // TODO: replace with selectors!
  quote: state.selectedInstrument.quote,
  id: selectSelectedInstrumentId(state),
  selectedBidAsk: selectSelectedInstrumentBidAsk(state),
  quoteDecimals: state.selectedInstrument.quoteDecimals,
  products: state.products,
  selectedInstrument: state.selectedInstrument,
  orderbook: state.orderbook,
  orderStatus: state.orderStatus.status,
});

const mapDispatchToProps = dispatch => ({
  placeOrder: order => dispatch(placeOrder(order)),
  loadData: () => dispatch(loadAccounts()),
  loadOrderBook: instrument => dispatch(loadL2Data(instrument)),
});

OrderEntry.propTypes = propTypes;
OrderEntry.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrderEntry);
