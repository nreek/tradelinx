import types from '../actions/types';

export const trades = (state = [], action) => {
  let newState;
  switch (action.type) {
    case types.state.setTrades:
      newState = [];
      action.trades.forEach((trade) => {
        if (trade.exchange_id === action.exchange) {
          newState.push(trade);
        }
      });
      return newState;

    case types.state.updateBook:
      newState = state.slice();
      action.updates.forEach((layer) => {
        if (layer.action === 'trade' && layer.exchange_id === action.exchange) {
          newState.push(layer);
        }
      });
      return newState;

    case types.user.changeInstrument:
      return [];

    default:
      return state;
  }
};

export const selectTrades = state => state.trades;
