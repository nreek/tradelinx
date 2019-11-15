import { createSelector } from 'reselect';
import types from '../actions/types';
import { selectOrders } from './orders';

export const orderEvents = (state = [], action) => {
  let newState = [];
  switch (action.type) {
    case types.state.refreshOrderEvents:
      return action.events.slice(); // TODO: do we really need to copy array here?

    case types.state.newOrderEvents:
      newState = state.slice();
      action.events.forEach(event => newState.push(event));
      return newState;

    default:
      return state;
  }
};

export const selectOrderEvents = state => state.orderEvents;

export const allowedOrdersStatuses = {
  open: ['new', 'partially_filled', 'pending_new',],
  filled: ['completely_filled', 'partially_filled',],
  inactive: ['rejected', 'canceled', 'replaced', 'expired', 'suspended',],
};

export const selectOpenOrders = createSelector(
  selectOrders,
  events => events && Object.values(events).filter(event =>
    allowedOrdersStatuses.open.includes(event.status)
    || allowedOrdersStatuses.open.includes(event.order_status)
  ),
);

export const selectInactiveOrders = createSelector(
  selectOrderEvents,
  events => events.filter(event => allowedOrdersStatuses.inactive.includes(event.order_status)),
);

// TODO: do we want this to include partial fills too? also this doesn't include vwaps!
export const selectFilledOrders = createSelector(
  selectOrderEvents,
  events => events.filter(event => allowedOrdersStatuses.filled.includes(event.order_status)),
);
