import types from '../actions/types';
import { selectTickers } from './tickers';
import { createSelector } from 'reselect/lib/index';

export const selectedInstrument = (state = {}, action) => {
  switch (action.type) {
    case types.state.setInstrument:
      return action.instrumentObj;

    case types.error.invalidInstrument:
      return {}; // TODO: some other way to identify error?

    default:
      return state;
  }
};

export const selectSelectedInstrument = state => state.selectedInstrument;
export const selectSelectedInstrumentId = state => state.selectedInstrument.id;

export const selectSelectedInstrumentTicker = createSelector(
  selectSelectedInstrumentId,
  selectTickers,
  (instrumentId, tickers) => tickers[instrumentId],
);

export const selectSelectedInstrumentBidAsk = createSelector(
  selectSelectedInstrumentTicker,
  ticker => (ticker
    ? { bid: ticker.bid, ask: ticker.ask }
    : { bid: 0, ask: 0 }), // TODO: sure we want to identify error this way?

);
export default selectedInstrument;

export const selectedInstrumentAll = state => state.selectedInstrument;
export const selectedInstrumentId = state => state.selectedInstrument.id;
export const quote = state => state.selectedInstrument.quote;
export const base = state => state.selectedInstrument.base;
export const quoteDecimals = state => state.selectedInstrument.quoteDecimals;
export const historicalBars = state => state.historicalBars;
