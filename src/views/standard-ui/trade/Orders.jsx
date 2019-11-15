import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { finishedLoadingOrders, orderEventTimeStamp } from '../../../reducers/orderStatus';
import { loadOrderEvents, loadOrders } from '../../../actions';
import FilledOrders from './orders/FilledOrders';
import OpenOrders from './orders/OpenOrders';
import InactiveOrders from './orders/InactiveOrders';
import WithdrawStatus from './orders/WithdrawStatus';

class Orders extends Component {
  state = {
    showDropdown: false,
    options: [
      { key: _t('Open Orders', 'ORDER_TABLES.OPEN_ORDERS'), component: <OpenOrders /> },
      { key: _t('Filled Orders', 'ORDER_TABLES.FILLED_ORDERS'), component: <FilledOrders /> },
      { key: _t('Inactive Orders', 'ORDER_TABLES.INACTIVE_ORDERS'), component: <InactiveOrders /> },
      { key: _t('Withdraw Status', 'ORDER_TABLES.WITHDRAW_STATUS'), component: <WithdrawStatus /> },
    ],
    currentOption: _t('Open Orders', 'ORDER_TABLES.OPEN_ORDERS'),
  };

  componentDidMount() {
    this.props.loadData();
  }

  componentDidUpdate() {
    const { finishedLoadingOrders, orderEventTimeStamp, loadData } = this.props;
    if (finishedLoadingOrders === false) {
      loadData(orderEventTimeStamp);
    }
  }

  renderTypeSelect = () => (
    <div
      className="orders-select tab"
      onClick={() => this.setState({ showDropdown: !this.state.showDropdown })}
    >
      <span className="display-name">{this.state.currentOption.toUpperCase()}</span>
      <i className={this.state.showDropdown ? 'far fa-chevron-up' : 'far fa-chevron-down'} />
    </div>
  );

  renderDropDown = () => this.state.options.map((option, index) => (
    <div
      className={
          this.state.currentOption === option.key
            ? 'drop-down-item block active'
            : 'drop-down-item block'
        }
      key={index}
      onClick={() => this.setState({
        currentOption: event.target.textContent,
        showDropdown: !this.state.showDropdown,
      })
        }
    >
      {option.key}
    </div>
  ));

  renderSelectedComponent = () => this.state.options.map((option, index) => (
    <Fragment key={index}>{this.state.currentOption === option.key ? option.component : null}</Fragment>
  ));

  render() {
    return (
      <div className="orders component">
        <div className="component-header">
          <h1>{_t("Orders", "ORDER_TABLES.TITLE")}</h1>
        </div>
        <div className="component-content">
          <div className="order-select-container">{this.renderTypeSelect()}</div>
          {this.state.showDropdown ? (
            <div className="order-select-open">
              <PerfectScrollbar>{this.renderDropDown()}</PerfectScrollbar>
            </div>
          ) : null}
          <div id="orders-table">{this.renderSelectedComponent()}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  finishedLoadingOrders: finishedLoadingOrders(state),
  orderEventTimeStamp: orderEventTimeStamp(state),
});

const mapDispatchToProps = dispatch => ({
  loadData: orderEventTimeStamp => dispatch(loadOrderEvents(orderEventTimeStamp)),
  loadOrders: () => dispatch(loadOrders()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Orders);
