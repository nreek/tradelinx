import types from '../actions/types';

export const displayMobile = (state = false, action) => {
  switch (action.type) {
    case types.state.setDisplayMobile:
      return action.payload;
    default:
      return state;
  }
};

export default displayMobile;

export const mobileSetting = state => state.displayMobile;
