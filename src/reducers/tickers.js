import types from '../actions/types';

export const tickers = (state = {}, action) => {
  switch (action.type) {
    case types.state.updateTickers:
    case types.state.refreshTickers:
      return action.ticks.reduce(
        (result, tick) => {
          result[tick.security_id] = tick;
          return result;
        },
        { ...state },
      );

    default:
      return state;
  }
};

export const selectTickers = state => state.tickers;
