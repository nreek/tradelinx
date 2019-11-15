import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';

import OrderEntrySummary from './order-entry/OrderEntrySummary';
import OrderEntryForm from './order-entry/OrderEntryForm';
import OrderEntryActionButtons from './order-entry/OrderEntryActionButtons';
import {
  selectSelectedInstrumentBidAsk,
  selectSelectedInstrumentId,
  selectProducts,
} from '../../../reducers';
import {
  base,
  quote,
  quoteDecimals,
  selectedInstrumentAll,
} from '../../../reducers/selectedInstrument';
import { orderStatusString } from '../../../reducers/orderStatus';
import { placeOrder, loadAccounts, loadL2Data } from '../../../actions';
import { advancedOrderTypes } from '../../../constants';
import 'react-toastify/dist/ReactToastify.css';

const BUY = 'buy';
const SELL = 'sell';
const MARKET = 'market';
const LIMIT = 'limit';
const STOP = 'stop';
const GTD = 'gtd';

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
      { key: LIMIT, label: _t('Limit - Good Til Canceled', 'ORDER_ENTRY.LIMIT_GTC') },
      { key: LIMIT, label: _t('Limit - Fill Or Kill', 'ORDER_ENTRY.LIMIT_FOK') },
      { key: LIMIT, label: _t('Limit - Immediate Or Cancel', 'ORDER_ENTRY.LIMIT_IOC') },
      { key: LIMIT, label: _t('Limit - Good Til Date', 'ORDER_ENTRY.LIMIT_GTD') },
      { key: LIMIT, label: _t('Limit - Day', 'ORDER_ENTRY.LIMIT_DAY') },
      { key: STOP, label: _t('Stop - Good Til Canceled', 'ORDER_ENTRY.STOP_GTC') },
      { key: STOP, label: _t('Stop - Fill Or Kill', 'ORDER_ENTRY.STOP_FOK') },
      { key: STOP, label: _t('Stop - Immediate Or Cancel', 'ORDER_ENTRY.STOP_IOC') },
      { key: STOP, label: _t('Stop - Good Til Date', 'ORDER_ENTRY.STOP_GTD') },
      { key: STOP, label: _t('Stop - Day', 'ORDER_ENTRY.STOP_DAY') },
    ],
    currentType: MARKET,
    currentAction: BUY,
    displayType: 'MARKET',
    showDropdown: false,
    amount: '',
    limitPrice: '',
    stopPrice: '',
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

  setOrderType = (orderType) => {
    const orderTypeArray = orderType.split(' - ');
    const [currentOrderType, currentAdvancedType] = orderTypeArray;
    const orderTypeAbbreviation = advancedOrderTypes.find(
      x => x.name.toUpperCase() === currentAdvancedType,
    );
    this.setState({
      currentType: currentOrderType.toLowerCase(),
      advancedOrderType: currentOrderType === 'MARKET' ? 'gtc' : orderTypeAbbreviation.value,
      displayType: orderType,
      showDropdown: !this.state.showDropdown,
    });
  };

  setOrderAction = action => this.setState({ currentAction: action });

  handleInputChange = (decimalPlaces, name) => (e) => {
    const { value } = e.target;
    const splitNum = value.split('.');
    if (name === 'expireDate') {
      this.setState({ [name]: new Date(value).getTime() });
    } else if (value === '.') {
      this.setState({ [name]: value });
    } else if (
      !isNaN(value)
      && (splitNum.length === 1 || (splitNum.length === 2 && splitNum[1].length <= decimalPlaces))
    ) {
      this.setState({ [name]: value });
    }
  };

  handleInputUnfocus = (e) => {
    const { name, value } = e.target;
    if (!value) {
      this.setState({ [name]: '' });
    }
  };

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

  renderTypeSelect = () => (
    <div
      className="order-entry-select tab"
      onClick={() => this.setState({ showDropdown: !this.state.showDropdown })}
    >
      <span className="display-name">{this.state.displayType}</span>
      <i className="far fa-ellipsis-h" />
      <i className={this.state.showDropdown ? 'far fa-chevron-up' : 'far fa-chevron-down'} />
    </div>
  );

  renderDropDown = () => this.state.orderTypes.map((type, index) => (
    <div
      className={
          this.state.displayType === type.label.toUpperCase()
            ? 'drop-down-item block active'
            : 'drop-down-item block'
        }
      key={index}
      onClick={() => this.setOrderType(event.target.textContent)}
    >
      {type.label.toUpperCase()}
    </div>
  ));

  render() {
    const {
      activeOrder,
      currentAction,
      amount,
      limitPrice,
      stopPrice,
      currentType,
      advancedOrderType,
    } = this.state;
    const { selectedInstrument, products } = this.props;
    const baseProduct = products[selectedInstrument.base] || {};

    return (
      <div className="order-entry component">
        <div className="component-header">
          <h1>{_t('Trade', 'ORDER_ENTRY.TITLE')}</h1>
        </div>
        <div className="component-content">
          <Fragment>
            <div className="order-entry-type-container">
              {this.renderTypeSelect()}
              <div className="order-entry-buy-sell">
                <OrderEntryActionButtons
                  setOrderAction={this.setOrderAction}
                  currentAction={currentAction}
                  BUY={BUY}
                  SELL={SELL}
                />
              </div>
            </div>
            {this.state.showDropdown ? (
              <div className="order-entry-select-open">
                <PerfectScrollbar>{this.renderDropDown()}</PerfectScrollbar>
              </div>
            ) : null}
            <div className="order-entry-amount">
              <h2 className="transaction-action" >{_t(
                `Amount To {action}`,
                'ORDER_ENTRY.AMOUNT_TO',
                { action: currentAction }
              )}</h2>
              <div className='currency-container'>
                <img
                  alt=''
                  className={`currency-icon ${selectedInstrument.base}-icon`}
                  src={`images/icons/currency-icons/black/${selectedInstrument.base}.svg`}
                  />
                <h2 className="currency-name">
                  {baseProduct.name ? baseProduct.name.toUpperCase() : null}
                </h2>
              </div>
            </div>
            <div className="order-entry-form">
              <OrderEntryForm
                currentType={currentType}
                currentAction={currentAction}
                amount={amount}
                advancedOrderType={advancedOrderType}
                handleInputChange={this.handleInputChange}
                handleInputUnfocus={this.handleInputUnfocus}
                overAllState={this.state}
              />
            </div>
            <div className="order-entry-summary">
              <OrderEntrySummary
                amount={amount}
                limitPrice={limitPrice}
                stopPrice={stopPrice}
                currentType={currentType}
                currentAction={currentAction}
                getMarketPrice={this.getMarketPrice}
                getLimitPrice={this.getLimitPrice}
              />
            </div>
            <div className="order-entry-buttons">
              <button
                className="place-order-button button"
                type="button"
                onClick={amount !== '' ? this.placeOrder : null}
              >
                {_t('Place Order', 'ORDER_ENTRY.PLACE_ORDER')}
              </button>
            </div>
            {activeOrder === false ? <ToastContainer /> : null}
          </Fragment>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  base: base(state), // TODO: replace with selectors!
  quote: quote(state),
  id: selectSelectedInstrumentId(state),
  selectedBidAsk: selectSelectedInstrumentBidAsk(state),
  quoteDecimals: quoteDecimals(state),
  orderStatus: orderStatusString(state),
  selectedInstrument: selectedInstrumentAll(state),
  products: selectProducts(state),
  orderbook: state.orderbook,
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
