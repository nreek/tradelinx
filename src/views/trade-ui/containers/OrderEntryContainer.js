import React, { Component } from 'react';

import OrderEntry from '../OrderEntry';
import WidgetWrapper from '../../../elements/WidgetWrapper';


export default class OrderEntryContainer extends Component {
  state = {
    tabs: [_t('Order Entry', 'ORDER_ENTRY.TITLE')],
    classNames: ['order-entry'],
  };

  render() {
    return (
      <WidgetWrapper tabs={this.state.tabs} classNames={this.state.classNames}>
        <OrderEntry />
      </WidgetWrapper>
    );
  }
}
