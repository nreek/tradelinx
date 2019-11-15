import React, { Component } from 'react';

import RecentTrades from '../RecentTrades';
import WidgetWrapper from '../../../elements/WidgetWrapper';


export default class RecentTradesContainer extends Component {
  state = {
    tabs: [_t('Recent Trades', 'RECENT_TRADES.TITLE')],
    classNames: ['recent-trades'],
  };

  render() {
    return (
      <WidgetWrapper tabs={this.state.tabs} classNames={this.state.classNames}>
        <RecentTrades />
      </WidgetWrapper>
    );
  }
}
