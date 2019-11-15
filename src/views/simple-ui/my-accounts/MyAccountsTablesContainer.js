import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { loadOrders } from '../../../actions';
import AccountHistory from './AccountHistory';
import FilledOrders from '../../trade-ui/FilledOrders';


import WidgetWrapper from '../../../elements/WidgetWrapper';

export class MyAccountsTablesContainer extends Component {
  state = {
    tabs: [
      // Tabs must be in same order of components in render function
      _t('Account History', 'MY_ACCOUNTS_TABLES.ACCOUNT_HISTORY'),
      _t('Order History', 'MY_ACCOUNTS_TABLES.ORDER_HISTORY'),

    ],
    classNames: [
      // Class names are used for CSS styling
      'account-history',
      'filled-orders'
    ],
  };

  componentDidMount() {
    this.props.loadData();
  }

  // TODO: Filter out Trade Reports based on showBlockTradeUI? Still a thing?
  render() {
    return (
      <WidgetWrapper tabs={this.state.tabs} classNames={this.state.classNames}>
          <AccountHistory />
          <FilledOrders />
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
)(MyAccountsTablesContainer);


