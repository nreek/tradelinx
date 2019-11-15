import types from '../actions/types';

export const setFxBlueChartTimeFrame = (state = {}, action) => {
  switch (action.type) {
    case types.user.setFxBlueChartTimeFrame:
      return action.timeFrame;
    default:
      return state;
  }
};
