import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import InstrumentSelect from './InstrumentSelect';
import TradeSidebar from './TradeSidebar';

import Modal from '../../elements/Modal';

const HeaderTicker = (props) => {
  const tickerDataNumbers = {};
  for (const _ in props.tickerData) {
    if (typeof props.tickerData[_] !== 'undefined') {
      tickerDataNumbers[_] = parseFloat(props.tickerData[_]);
    } else {
      tickerDataNumbers[_] = 0;
    }
  }

  const {
    // lastPrice,
    price_24h_change,
    bid,
    ask,
    volume_24h_change,
    price_24h_min,
    price_24h_max,
  } = tickerDataNumbers;

  // TODOS:
  // * Fixed decimals based on product pairs
  // * Locale formatting RE: periods vs commas
  // * TRANSLATIONS
  return (
    <div className="header-ticker">
      {/* <div className="header-last-price">
        <span className="header-ticker-label">Last Price</span>
        <span className="header-ticker-value">{lastPrice.toFixed(2)}</span>{' '} */}
      {/* TODO: dynamic fixed decimals */}
      {/* </div> */}
      <div className="header-24hr-change">
        <span className="header-ticker-label">{_t('24 Hour Change', 'TRADE_HEADER.DAILY_CHANGE')}</span>
        <span
          className={`header-ticker-value ${
            price_24h_change < 0 ? 'negative' : ''
          }`}
        >
          {price_24h_change.toFixed(4)}
%
        </span>
      </div>
      <div className="header-bid">
        <span className="header-ticker-label">{_t('Bid', 'TRADE_HEADER.BID')}</span>
        <span className="header-ticker-value">
          {bid.toFixed(props.decimals)}
        </span>
      </div>
      <div className="header-ask">
        <span className="header-ticker-label">{_t('Ask', 'TRADE_HEADER.ASK')}</span>
        <span className="header-ticker-value">
          {ask.toFixed(props.decimals)}
        </span>
      </div>
      <div className="header-24hr-volume">
        <span className="header-ticker-label">{_t('24 Hour Volume', 'TRADE_HEADER.DAILY_VOLUME')}</span>
        <span className="header-ticker-value">
          {volume_24h_change.toFixed(0)}
        </span>
      </div>
      <div className="header-24hr-low">
        <span className="header-ticker-label">{_t('24 Hour Low', 'TRADE_HEADER.DAILY_LOW')}</span>
        <span className="header-ticker-value">
          {price_24h_min.toFixed(props.decimals)}
        </span>
      </div>
      <div className="header-24hr-high">
        <span className="header-ticker-label">{_t('24 Hour High', 'TRADE_HEADER.DAILY_HIGH')}</span>
        <span className="header-ticker-value">
          {price_24h_max.toFixed(props.decimals)}
        </span>
      </div>
    </div>
  );
};

class TradeHeader extends Component {
  state = {
    showSidebar: false,
    showModal: false,
    modalComponent: null,
    showDropdown: false,
  };

  openSidebar = () => this.setState({ showSidebar: true });

  closeSidebar = () => this.setState({ showSidebar: false });

  toggleDropdown = () => this.setState({ showDropdown: !this.state.showDropdown });

  openModal = (modalComponent = null) => {
    this.setState({
      showModal: true,
      showSidebar: false,
      modalComponent,
    });
  };

  closeModal = () => {
    this.setState({
      showModal: false,
      modalComponent: null,
    });
  };

  render() {
    const { dropdownInstrumentSelect } = this.props.tradeUi;
    const { showDropdown, showSidebar, showModal } = this.state;

    const tickerData = this.props.tickers[this.props.selectedInstrument.id];

    return (
      <Fragment>
        <Link to="/home">
          <div className="header-logo" />
        </Link>
        <div
          className={`header-instrument-select ${
            dropdownInstrumentSelect ? 'dropdown-button' : ''
          }`}
          onClick={dropdownInstrumentSelect ? this.toggleDropdown : null}
        >
          <span
            className={`current-instrument ${showDropdown ? 'selected' : ''}`}
          >
            {this.props.selectedInstrument.id}
          </span>
          {dropdownInstrumentSelect
            && (!showDropdown ? (
              <i className="fas fa-caret-down" />
            ) : (
              <i className="fas fa-caret-up" />
            ))}
          {dropdownInstrumentSelect
            && showDropdown && (
              <div
                className="dropdown-instrument-select"
                onClick={e => e.stopPropagation()}
              >
                <InstrumentSelect closeDropdown={this.toggleDropdown} />
              </div>
          )}
        </div>
        {this.props.tickers[this.props.selectedInstrument.id]
        && Object.keys(this.props.tickers).length !== 0 ? (
          <HeaderTicker
            tickerData={tickerData}
            decimals={this.props.selectedInstrument.quoteDecimals}
          />
          ) : null}
        <div className="header-accounts">
          <span className="header-user-info">
            {' '}
            {this.props.username}
          </span>
        </div>
        <div className="header-hamburger-button" onClick={this.openSidebar}>
          <i className="far fa-bars" />
        </div>
        <TradeSidebar
          showSidebar={showSidebar}
          closeSidebar={this.closeSidebar}
          openModal={this.openModal}
        />
        {showModal && (
          <Modal onClose={this.closeModal}>{this.state.modalComponent}</Modal>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = ({
  selectedInstrument, tickers, user, config,
}) => ({
  selectedInstrument,
  tickers,
  username: user.username,
  tradeUi: config.tradeUi,
});

export default connect(
  mapStateToProps,
  null,
)(TradeHeader);
