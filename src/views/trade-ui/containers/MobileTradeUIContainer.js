import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import WidgetWrapper from '../../../elements/WidgetWrapper';
import TradeHeader from '../TradeHeader';
import OrderEntry from '../OrderEntry';
import AccountBalances from '../AccountBalance';
import Charts from './ChartContainer';
import Book from './OrderBookTradesContainer';
import Orders from './OrdersTablesContainer';
import Instruments from './InstrumentSelectContainer';


// Makeshift component putting OrderEntry and AccountBalances on the same tab
const Trade = () => {
  const tabs = ['Order Entry', 'Balances'];
  const classNames = ['order-entry', 'account-balance'];
  return (
    <WidgetWrapper tabs={tabs} classNames={classNames}>
      <OrderEntry />
      <AccountBalances />
    </WidgetWrapper>
  );
};

export class MobileUIContainer extends Component {
  state = {
    currentWidget: this.props.tradeUi.mobileInitialComponent || 'Trade',
    widgets: {
      Charts: <Charts />,
      Book: <Book />,
      Trade: <Trade />,
      Orders: <Orders />,
    },
  };

  componentDidMount() {
    if (!this.props.tradeUi.dropdownInstrumentSelect) {
      this.setState({
        widgets: {
          ...this.state.widgets,
          Pairs: <Instruments />,
        },
      });

      document.querySelector('.current-instrument').addEventListener('click', () => {
        this.setState({
          currentWidget: 'Pairs',
        });
      });
    }
  }

  setCurrentWidget = (widget) => {
    this.setState({ currentWidget: widget });
  };

  renderNav = () => Object.keys(this.state.widgets).map((widget, index) => (
    <span
      key={index}
      className={this.state.currentWidget === widget ? 'active' : ''}
      onClick={() => this.setCurrentWidget(widget)}
    >
      {widget}
    </span>
  ));

  renderCurrentWidget = () => this.state.widgets[this.state.currentWidget];

  render() {
    return (
      <Fragment>
        <header className="mobile-header">
          <TradeHeader />
        </header>
        <div className="mobile-nav">{this.renderNav()}</div>
        <div className="mobile-content">{this.renderCurrentWidget()}</div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ config }) => ({
  tradeUi: config.tradeUi,
});

export default connect(
  mapStateToProps,
  null,
)(MobileUIContainer);
