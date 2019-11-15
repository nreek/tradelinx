import React from 'react';
import { connect } from 'react-redux';

import { selectTickers, selectSelectedInstrument } from '../../../reducers';
import { formatNumberToLocale } from '../../../util/helpers';

const InstrumentStats = ({ selectedInstrument, tickers }) => {
  const ticker = tickers[selectedInstrument.id] || {};
  const pxChangeClass = ticker.price_24h_change > 0 ? 'positive' : ticker.price_24h_change < 0 ? 'negative' : '';

  return (
    <div className="instrument-stats">
      <div className="stats-last-price">
        <span className="last-price instrument-stat">
          <h1 className="last-price-label instrument-stat-label">
            {_t('Last Price', 'INSTRUMENT_STATS.LAST_PRICE')}
          </h1>
          &nbsp;|&nbsp;
          <h1 className="last-price-value instrument-stat-value">
            {formatNumberToLocale(ticker.bid, 2)}
          </h1>
        </span>
        <span className="price-24h-change instrument-stat">
          <h1 className="price-24h-change-label instrument-stat-label">
            {_t('24h Change', 'INSTRUMENT_STATS.24H_CHANGE')}
          </h1>
          &nbsp;|&nbsp;
          <h1 className={`price-24h-change-value instrument-stat-value ${pxChangeClass}`}>
            {formatNumberToLocale(ticker.price_24h_change, 1)}
%
          </h1>
        </span>
      </div>
      <div className="stats-high-low">
        <span className="price-low instrument-stat">
          <h1 className="price-low-label instrument-stat-label">
            {_t('24h Low', 'INSTRUMENT_STATS.24H_LOW')}
          </h1>
          &nbsp;|&nbsp;
          <h1 className="price-low-value instrument-stat-value">
            {formatNumberToLocale(+ticker.price_24h_min, 2)}
          </h1>
        </span>
        <span className="price-high instrument-stat">
          <h1 className="price-high-label instrument-stat-label">
            {_t('24h High', 'INSTRUMENT_STATS.24H_HIGH')}
          </h1>
          &nbsp;|&nbsp;
          <h1 className="price-high-value instrument-stat-value">
            {formatNumberToLocale(+ticker.price_24h_max, 2)}
          </h1>
        </span>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  selectedInstrument: selectSelectedInstrument(state),
  tickers: selectTickers(state),
});

export default connect(
  mapStateToProps,
  null,
)(InstrumentStats);
