import types from '../actions/types';

export const selectedFxBlueChartTimeframe = (state = {}, action) => {
  switch (action.type) {
    case types.user.loadSelectedFxBlueChartTimeFrame:
      return action.loadSelectedFxBlueChartTimeFrame || null;
    case types.user.selectedFxBlueChartTimeFrame:
      return action.timeFrame;
    default:
      return state;
  }
};
