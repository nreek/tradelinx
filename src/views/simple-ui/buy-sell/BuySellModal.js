import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

// Components
import { connect } from 'react-redux';
import Modal from '../../../elements/Modal';
import Button from '../../../elements/Button';
import { getFee, floor } from '../../../util/helpers';

// Redux
import { selectConfig, selectProducts, selectSelectedInstrumentBidAsk } from '../../../reducers';
import { placeOrder } from '../../../actions';

const propTypes = {
  amount: PropTypes.number,
};

const defaultProps = {
  amount: 0,
};

export class BuySellModal extends Component {
  state = { workflowStep: 'placeOrder' };

  componentDidUpdate = (prevProps) => {
    if (prevProps.orderStatus.status !== this.props.orderStatus.status) {
      if (this.props.orderStatus.status === 'accepted') {
        this.setState({ workflowStep: 'orderAccepted' });
      } else if (this.props.orderStatus.status === 'pending') {
        this.setState({ workflowStep: 'orderPending' });
      } else {
        this.setState({ workflowStep: 'orderRejected' });
      }
    }
  };

  placeOrder = (transactionType) => {
    const order = {
      id: this.props.selectedInstrument.id,
      type: 'market',
      side: transactionType,
      quantity: this.props.quantity,
      timeInForce: 'gtc', // TODO: obviously shouldn't be hardcoded!
      price: 0,
    };
    this.props.placeOrder(order);
  };

  renderGeneralError = () => (
    <Fragment>
      <h3 className="error-message">
        {_t('Sorry, something went wrong. Please close and try again.', 'BUY_SELL.GENERAL_ERROR')}
      </h3>
      <div className="action-button">
        <Button onClick={this.props.onClose} type="close" />
      </div>
    </Fragment>
  );

  renderOrderPending = () => (
    <Fragment>
      <h3 className="error-message">
        {_t('Your order was placed with status pending.', 'BUY_SELL.PENDING_MESSAGE')}
      </h3>
      <div className="action-button">
        <Button onClick={this.props.onClose} type="close" />
      </div>
    </Fragment>
  );

  renderOrderAccepted = () => (
    <Fragment>
      <h1 className="buy-sell-modal-title">
        {_t('Your order was successfully placed.', 'BUY_SELL.ORDER_SUCCESS')}
      </h1>
      <div className="action-button">
        <Button onClick={this.props.onClose} type="close" />
      </div>
    </Fragment>
  );

  renderOrderRejected = () => (
    <Fragment>
      <h3 className="error-message">
        {_t('There was an error placing your order.', 'BUY_SELL.ERROR_TITLE')}
      </h3>
      {this.props.orderStatus.message.includes('Insufficient') ? (
        <p>
          {_t('You have insufficient funds to complete this transaction.', 'BUY_SELL.ERROR_TEXT')}
        </p>
      ) : (
        this.props.orderStatus.message
      )}
      <div className="action-button">
        <Button onClick={this.props.onClose} type="close" />
      </div>
    </Fragment>
  );

  getMarketPrice = () => {
    const { selectedBidAsk, transactionType } = this.props;

    switch (transactionType) {
      case 'buy':
        return selectedBidAsk.ask; // If buying, get ask price
      case 'sell':
        return selectedBidAsk.bid; // If selling, get bid price
      default:
        return 0; // Should not happen
    }
  };

  renderPlaceOrder = () => {
    const {
      quote, base, selectedInstrument, quantity, transactionType, balances,
    } = this.props;
    const { fees, quantityDecimals, quoteDecimals } = selectedInstrument;
    const marketPrice = this.getMarketPrice();
    const product = transactionType === 'buy' ? base : quote;
    const decimal = transactionType === 'buy' ? quoteDecimals : quantityDecimals;
    const amountValue = transactionType === 'buy' ? quantity : quantity * marketPrice;
    const fee = getFee(amountValue, transactionType, fees);
    const net = amountValue - fee;
    const total = quantity * marketPrice;

    return (
      <Fragment>
        <h1 className="buy-sell-modal-title">{_t('Confirm Order', 'BUY_SELL.MODAL_TITLE')}</h1>
        <p>
          {_t(
            'You are about to {transactionType} {base} at the price below',
            'BUY_SELL.BUY_MODAL_TEXT',
            {
              transactionType,
              base: selectedInstrument.base,
            },
          )}
        </p>
        <ul>
          <li>
            {transactionType === 'buy'
              ? _t('Total Cost ({quote})', 'BUY_SELL.TOTAL_COST', {
                quote: selectedInstrument.quote,
              })
              : _t('Total {base} Sold', 'BUY_SELL.TOTAL_SOLD', {
                base: selectedInstrument.base,
              })}
            <span>{transactionType === 'buy' ? total : quantity}</span>
          </li>
          <li>
            {_t('Total Received ({base})', 'BUY_SELL.TOTAL_RECEIVED', {
              base: product,
            })}
            <span>{amountValue}</span>
          </li>
          {/* TODO: do not hardcode transaction fee */}
          <li>
            {_t('Transaction Fees ({base})', 'BUY_SELL.TRANSACTION_FEES', {
              base: selectedInstrument.base,
            })}
            <span>{fee}</span>
          </li>
          {/* TODO: Do the correct math for below w/o hardcoded transaction fee */}
          <li>
            {_t('Net Amount Received ({base})', 'BUY_SELL.NET_AMOUNT_RECEIVED', {
              base: selectedInstrument.base,
            })}
            <span>{net}</span>
          </li>
        </ul>
        {this.props.orderStatus != 'pending' ? (
          <div className="action-button">
            <Button
              onClick={() => this.placeOrder(transactionType)}
              loading
              loadingStatus={this.props.orderStatus.status === 'pending'}
            >
              {transactionType === 'buy'
                ? _t('Place Buy Order', 'BUY_SELL.PLACE_BUY_ORDER')
                : _t('Place Sell Order', 'BUY_SELL.PLACE_SELL_ORDER')}
            </Button>
          </div>
        ) : null}
      </Fragment>
    );
  };

  renderWorkflowStep = () => {
    const step = this.state.workflowStep;
    const workflowSteps = {
      generalError: this.renderGeneralError,
      orderRejected: this.renderOrderRejected,
      orderAccepted: this.renderOrderAccepted,
      placeOrder: this.renderPlaceOrder,
      orderPending: this.renderOrderPending,
    };
    if (workflowSteps[step]) {
      return workflowSteps[step]();
    }
    return workflowSteps.generalError();
  };

  render() {
    return (
      <Modal onClose={this.props.onClose}>
        <div className="buy-sell-modal-wrapper">{this.renderWorkflowStep()}</div>
      </Modal>
    );
  }
}

BuySellModal.propTypes = propTypes;
BuySellModal.defaultProps = defaultProps;

const mapStateToProps = state => ({
  base: state.selectedInstrument.base,
  quote: state.selectedInstrument.quote,
  orderStatus: state.orderStatus,
  products: selectProducts(state),
  selectedInstrument: state.selectedInstrument,
  selectedBidAsk: selectSelectedInstrumentBidAsk(state),
  balances: state.balances,
});

const mapDispatchToProps = dispatch => ({
  placeOrder: order => dispatch(placeOrder(order)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BuySellModal);
