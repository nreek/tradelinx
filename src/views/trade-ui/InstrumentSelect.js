import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import enhanceWithClickOutside from 'react-click-outside';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { changeInstrument } from '../../actions';

export class InstrumentSelect extends Component {
  state = { filter: '' };

  onFilterChange = e => this.setState({ filter: e.target.value.toUpperCase() });

  changeInstrument = instrument => () => {
    this.props.changeInstrument(instrument.id);
    this.setState({ filter: '' });

    this.props.closeDropdown && this.props.closeDropdown();
  };

  renderInstrumentRow = (instrument) => {
    const {
      id, base, quote, quoteDecimals,
    } = instrument;
    const { selectedInstrument, tickers } = this.props;
    const isTickerAvailable = Object.keys(tickers).length && tickers[id];
    return (
      <div
        key={id}
        className={`instrument-row ${
          id === selectedInstrument.id ? 'selected' : ''
        }`}
        onClick={this.changeInstrument(instrument)}
      >
        <span className="instrument-symbol">{id}</span>
        {isTickerAvailable ? (
          <span className="instrument-price">{tickers[id].ask}</span>
        ) : null}
        {isTickerAvailable ? (
          <span className="instrument-percent">
            {`${parseFloat(
              tickers[id].price_24h_change,
            ).toFixed(2)}%`}
          </span>
        ) : null}
      </div>
    );
  };

  isInstrumentFiltered = id => !id.includes(this.state.filter);

  renderInstruments = () => {
    const { instruments } = this.props;

    const renderedInstruments = [];
    for (const id in instruments) {
      if (!this.isInstrumentFiltered(id)) {
        renderedInstruments.push(this.renderInstrumentRow(instruments[id]));
      }
    }

    return renderedInstruments;
  };

  render() {
    return (
      <Fragment>
        <div className="instrument-select-input">
          <i className="fal fa-search" />
          <input
            onChange={this.onFilterChange}
            onKeyUp={this.onKeyUp}
            placeholder={_t('Search Pairs', 'INSTRUMENT_SELECT.SEARCH_PLACEHOLDER')}
            value={this.state.filter}
          />
        </div>
        <div className="instruments">
          <PerfectScrollbar>
            {this.renderInstruments()}
          </PerfectScrollbar>
        </div>
      </Fragment>
    );
  }
}

// TODO: use selectors:
const mapStateToProps = ({ instruments, selectedInstrument, tickers }) => ({
  instruments,
  selectedInstrument,
  tickers,
});

const mapDispatchToProps = dispatch => ({
  changeInstrument: instrument => dispatch(changeInstrument(instrument)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InstrumentSelect);
