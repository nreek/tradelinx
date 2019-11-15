import React, { Component } from 'react';

import AccountBalance from '../AccountBalance';
import WidgetWrapper from '../../../elements/WidgetWrapper';

export default class AccountBalanceContainer extends Component {
  state = {
    tabs: [_t('Account Balance', 'ACCOUNT_BALANCE.TITLE')],
    classNames: ['account-balance'],
  };

  render() {
    return (
      <WidgetWrapper tabs={this.state.tabs} classNames={this.state.classNames}>
          <AccountBalance />
      </WidgetWrapper>
    );
  }
}
