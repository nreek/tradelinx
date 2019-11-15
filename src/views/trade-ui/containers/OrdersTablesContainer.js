import React, { Component } from 'react';
import { connect } from 'react-redux';

import { loadOrders } from '../../../actions';

import OpenOrders from '../OpenOrders';
import FilledOrders from '../FilledOrders';
import InactiveOrders from '../InactiveOrders';
import WithdrawStatus from '../WithdrawStatus';
import WidgetWrapper from '../../../elements/WidgetWrapper';


export class OrdersTablesContainer extends Component {
  state = {
    tabs: [
      // Tabs must be in same order of components in render function
      _t('Open Orders', 'ORDER_TABLES.OPEN_ORDERS'),
      _t('Filled Orders', 'ORDER_TABLES.FILLED_ORDERS'),
      _t('Inactive Orders', 'ORDER_TABLES.INACTIVE_ORDERS'),
      _t('Withdraw Status', 'ORDER_TABLES.WITHDRAW_STATUS'),
    ],
    classNames: [
      // Class names are used for CSS styling
      'open-orders',
      'filled-orders',
      'inactive-orders',
      'withdraw-status',
    ],
  };

  componentDidMount() {
    this.props.loadData();
  }

  // TODO: Filter out Trade Reports based on showBlockTradeUI? Still a thing?
  render() {
    return (
      <WidgetWrapper tabs={this.state.tabs} classNames={this.state.classNames}>
          <OpenOrders />
          <FilledOrders />
          <InactiveOrders />
          <WithdrawStatus />
      </WidgetWrapper>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loadData: () => dispatch(loadOrders()),
});

export default connect(
  null,
  mapDispatchToProps,
)(OrdersTablesContainer);
