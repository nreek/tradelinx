import { createSelector } from 'reselect';

export const exchange = (state = '') => state;
export const selectExchange = createSelector(
  state => state.exchange,
  exchange => exchange,
);
