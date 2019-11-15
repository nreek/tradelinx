import types from '../actions/types';

export const connectingQueue = (state = new Map(), action) => {
  switch (action.type) {
    case types.state.connectingQueueAdd:
      const newState = new Map(state);
      newState.set(action.action.type, action.action);
      
      return newState;
    default:
      return state;
  }
};
