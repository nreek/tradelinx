import types from '../actions/types';
import { status } from '../constants/statuses';

export const exchangeSettings = (state = {}, action) => {
  switch (action.type) {
    case types.state.exchangeSettingsPending:
      return { status: status.pending };

    case types.state.exchangeSettingsSuccess:
      return { ...action.settings, status: status.success };

    case types.state.exchangeSettingsFailed:
      return { ...action.error, status: status.failed };

    default:
      return state;
  }
};

export const selectExchangeSettings = state => state.exchangeSettings;
