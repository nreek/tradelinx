import React, { PureComponent } from 'react';

// React Components
import StandardUiWrapper from './StandardUiWrapper';

import MarketOverview from './trade/MarketOverview';
import OrderBook from './trade/OrderBook';
import OrderEntry from './trade/OrderEntry';
import Orders from './trade/Orders';

import ErrorBoundary from '../../elements/ErrorBoundary';

class StandardTrade extends PureComponent {
  render() {
    return (
      <StandardUiWrapper title='Trade' translation='TRADE'>
        <ErrorBoundary>
          <MarketOverview />
        </ErrorBoundary>
        <ErrorBoundary>
          <OrderBook />
        </ErrorBoundary>
        <ErrorBoundary>
          <OrderEntry />
        </ErrorBoundary>
        <ErrorBoundary>
          <Orders />
        </ErrorBoundary>
      </StandardUiWrapper>
    );
  }
}

export default StandardTrade;
