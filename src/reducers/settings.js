import types from '../actions/types';

export const settings = (state = {}, action) => {
  switch (action.type) {
    case types.state.setUserSettingsPending:
      return { status: 'pending' };

    case types.state.setUserSettings:
      return { ...action.settings, status: 'success' };

    case types.state.setUserSettingsError:
      return { ...action.error, status: 'error' };

    case types.state.setUpdateSettingsPending:
      return { ...state, updateStatus: 'pending', updateMessage: '' };

    case types.state.setUpdateSettingsAccepted:
      return {
        ...state,
        ...action.updatedSettings,
        updateStatus: 'success',
        updateMessage: 'Settings successfully updated',
      };

    case types.state.setUpdateSettingsError:
      return { ...state, updateStatus: 'error', updateMessage: action.error };
    default:
      return state;
  }
};
