import types from '../actions/types';

export const orders = (state = {}, action) => {
  switch (action.type) {
    case types.state.updateOrder:
      if (action.exchange === action.order.destination) {
        const newState = { ...state };
        newState[action.order.id] = action.order;
        return newState;
      }
      return state;

    default:
      return state;
  }
};

export const selectOrders = state => state.orders;
