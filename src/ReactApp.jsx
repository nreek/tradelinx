import React, { Component } from 'react';
import { connect } from 'react-redux';

// react-router Routes
import * as simpleUI from './views/simple-ui';
import * as marketingUI from './views/marketing-ui';
import * as standardUI from './views/standard-ui';
import TradeUI from './views/trade-ui/TradeUI';
import Verification from './views/Verification';
import PasswordReset from './views/PasswordReset';
import ErrorBoundary from './elements/ErrorBoundary';
import MaintenanceOverlay from './views/MaintenanceOverlay';
import BlacklistCheck from './views/BlacklistCheck';
import RequiresAuth from './views/hoc/RequiresAuth';
import Router from './views/hoc/Router';
import { selectSiteTheme } from './reducers';

const components={
  ...simpleUI,
  ...marketingUI,
  ...standardUI,
  TradeUI,
  Verification,
  PasswordReset,
};

const ReactApp = (props) => (
  <div className={`app theme-${props.siteTheme}`}>
    <ErrorBoundary>
      <MaintenanceOverlay>
        <BlacklistCheck>
          <Router 
            components={components}
            requiresAuth={RequiresAuth} 
          />
        </BlacklistCheck>
      </MaintenanceOverlay>
    </ErrorBoundary>
  </div>
);

const mapStateToProps = state => ({
  siteTheme: selectSiteTheme(state),
})

export default connect (
  mapStateToProps,
  null
)(ReactApp);
