import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  loadTickers,
  unsubscribeCurrentBars,
  loadOrderEvents,
  orderEventsFinished,
} from '../../actions';
import {
  isMaintenanceMessageEnabled,
  finishedLoadingOrders,
  orderEventTimeStamp
} from '../../reducers';

import TradeHeader from './TradeHeader';
import AccountBalanceContainer from './containers/AccountBalanceContainer';
import ChartContainer from './containers/ChartContainer';
import InstrumentSelectContainer from './containers/InstrumentSelectContainer';
import OrderBookTradesContainer from './containers/OrderBookTradesContainer';
import OrderEntryContainer from './containers/OrderEntryContainer';
import OrdersTablesContainer from './containers/OrdersTablesContainer';
import MobileTradeUIContainer from './containers/MobileTradeUIContainer';
import MaintenanceMessage from '../MaintenanceMessage';
import ErrorBoundary from '../../elements/ErrorBoundary';

import 'react-toastify/dist/ReactToastify.css';
import '../../../scss/trade.scss';

const MOBILE_MAX_WIDTH = 687;
const MEDIUM_MIN_WIDTH = 795;
const LARGE_MIN_WIDTH = 1055;
const EX_LARGE_MIN_WIDTH = 1500;

const propTypes = {
  isMaintenanceModeEnabled: PropTypes.bool,
};

const defaultProps = {
  isMaintenanceModeEnabled: false,
};

export class TradeUI extends Component {
  state = {
    currentUI: 'desktop',
    columns: 3,
  };

  checkResolution = () => {
    const viewportWidth = window.innerWidth;
    const { columns, currentUI } = this.state;
    if (viewportWidth <= MOBILE_MAX_WIDTH && currentUI === 'desktop') {
      this.setState({ currentUI: 'mobile' });
    } else if (viewportWidth > MOBILE_MAX_WIDTH && currentUI === 'mobile') {
      this.setState({ currentUI: 'desktop' });
    }
    if (viewportWidth > MOBILE_MAX_WIDTH && viewportWidth < MEDIUM_MIN_WIDTH && columns !== 1) {
      this.setState({ columns: 1 });
    }
    if (viewportWidth >= MEDIUM_MIN_WIDTH && viewportWidth < LARGE_MIN_WIDTH && columns !== 2) {
      this.setState({ columns: 2 });
    }
    if (viewportWidth >= LARGE_MIN_WIDTH && viewportWidth < EX_LARGE_MIN_WIDTH && columns !== 3) {
      this.setState({ columns: 3 });
    }
  };

  componentDidMount() {
    this.checkResolution();
    window.addEventListener('resize', this.checkResolution);
    this.props.loadTickers();
    this.props.loadData();
  }

  componentDidUpdate() {
    const { finishedLoadingOrders, orderEventTimeStamp, loadData } = this.props;
    if (finishedLoadingOrders === false) {
      loadData(orderEventTimeStamp);
    }
  }

  componentWillUnmount() {
    this.props.orderEventsFinished(false);
  }

  render() {
    const viewportWidth = window.innerWidth;
    const { columns, currentUI } = this.state;

    return (
      <div className="trade-ui-container">
        {this.props.isMaintenanceMessageEnabled && <MaintenanceMessage pageType="trade-ui" />}
        {this.state.currentUI === 'desktop' ? (
          <Fragment>
            <header className="trade-header">
              <TradeHeader toggleModal={this.toggleModal} />
            </header>
            <div className="trade-ui">
              <div className="column column-1">
                {!this.props.tradeUi.dropdownInstrumentSelect && (
                  <div className="component instrument-select" id="instrument-select">
                    <ErrorBoundary>
                      <InstrumentSelectContainer />
                    </ErrorBoundary>
                  </div>
                )}
                {columns >= 2 && (
                  <div className="component" id="order-book">
                    <ErrorBoundary>
                      <OrderBookTradesContainer />
                    </ErrorBoundary>
                  </div>
                )}
              </div>
              {columns >= 1 && (
                <div className="column column-2">
                  <div className="component price-chart" id="charts">
                    <ErrorBoundary>
                      {viewportWidth > MOBILE_MAX_WIDTH ? <ChartContainer /> : null}
                    </ErrorBoundary>
                  </div>
                  <div className="component orders-table" id="orders-table">
                    <ErrorBoundary>
                      <OrdersTablesContainer />
                    </ErrorBoundary>
                  </div>
                </div>
              )}
              {columns >= 1 && (
                <div className="column column-3">
                  <div className="component order-entry" id="order-entry">
                    <ErrorBoundary>
                      <OrderEntryContainer toggleModal={this.toggleModal} />
                    </ErrorBoundary>
                  </div>
                  <div className="component account-balance" id="account-balance">
                    <ErrorBoundary>
                      <AccountBalanceContainer />
                    </ErrorBoundary>
                  </div>
                </div>
              )}
            </div>
          </Fragment>
        ) : (
          <div className="mobile-trade-ui">
            <MobileTradeUIContainer />
          </div>
        )}
      </div>
    );
  }
}

TradeUI.propTypes = propTypes;
TradeUI.defaultProps = defaultProps;

const mapStateToProps = state => ({
  tradeUi: state.config.tradeUi,
  isMaintenanceMessageEnabled: isMaintenanceMessageEnabled(state),
  finishedLoadingOrders: finishedLoadingOrders(state),
  orderEventTimeStamp: orderEventTimeStamp(state),
});

const mapDispatchToProps = dispatch => ({
  loadTickers: () => dispatch(loadTickers()),
  unsubscribeCurrentBars: () => dispatch(unsubscribeCurrentBars()),
  loadData: orderEventTimeStamp => dispatch(loadOrderEvents(orderEventTimeStamp)),
  orderEventsFinished: payload => dispatch(orderEventsFinished(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TradeUI);
