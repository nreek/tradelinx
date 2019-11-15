import React, { Component } from 'react';

import OrderBook from '../OrderBook';
import RecentTrades from '../RecentTrades';
import WidgetWrapper from '../../../elements/WidgetWrapper';


export default class OrderBookTradesContainer extends Component {
  compactTabs = [_t('Order Book', 'ORDER_BOOK.TITLE'), _t('Recent Trades', 'RECENT_TRADES.TITLE')];

  compactClasses = ['order-book', 'recent-trades'];

  expandedTabs = [_t('Order Book', 'ORDER_BOOK.TITLE')];

  expandedClasses = ['order-book'];

  state = {
    tabs: this.compactTabs,
    classNames: this.compactClasses,
  };

  // componentDidMount() {
  //   this.checkResolution();
  //   window.addEventListener('resize', this.checkResolution);
  // }
  //
  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.checkResolution);
  // }

  // checkResolution = () => {
  //   if (window.innerWidth < 1500 && JSON.stringify(this.state.tabs) !== JSON.stringify(this.compactTabs)) {
  //     this.setState({
  //       tabs: this.compactTabs,
  //       classNames: this.compactClasses,
  //     });
  //   } else if (window.innerWidth >= 1500 && JSON.stringify(this.state.tabs) !== JSON.stringify(this.expandedTabs)) {
  //     this.setState({
  //       tabs: this.expandedTabs,
  //       classNames: this.expandedClasses,
  //     });
  //   }
  // };

  render() {
    return (
      <WidgetWrapper tabs={this.state.tabs} classNames={this.state.classNames}>
        <OrderBook />
        {JSON.stringify(this.state.tabs) === JSON.stringify(this.compactTabs) && <RecentTrades />}
      </WidgetWrapper>
    );
  }
}
