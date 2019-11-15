import types from '../actions/types';

export const setTheme = (state = {}, action) => {
  switch (action.type) {
    case types.app.setTheme:
      return action.theme;
    default:
      return state;
  }
};

export const selectSiteTheme = state => state.siteTheme;
export default setTheme;
