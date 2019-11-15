import types from '../actions/types';

export const instruments = (state = {}, action) => {
  switch (action.type) {
    case types.state.setInstruments:
      return action.instruments.reduce((result, instrument) => {
        result[instrument.id] = instrument;
        return result;
      }, {});

    default:
      return state;
  }
};

export const selectInstruments = state => state.instruments;
