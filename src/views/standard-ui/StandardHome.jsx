import React, { PureComponent } from 'react';

// React Components
import StandardUiWrapper from './StandardUiWrapper';

import PortfolioOverview from './home/PortfolioOverview';
import MarketActivity from './home/MarketActivity';
import Headlines from './home/Headlines';
import AccountActivity from './home/AccountActivity';

import ErrorBoundary from '../../elements/ErrorBoundary';

class StandardHome extends PureComponent {
  render() {
    return (
      <StandardUiWrapper title="Home" translation="HOME">
        <ErrorBoundary>
          <PortfolioOverview />
        </ErrorBoundary>
        <ErrorBoundary>
          <MarketActivity />
        </ErrorBoundary>
        <ErrorBoundary>
          <Headlines />
        </ErrorBoundary>
        <ErrorBoundary>
          <AccountActivity />
        </ErrorBoundary>
      </StandardUiWrapper>
    );
  }
}

export default StandardHome;
