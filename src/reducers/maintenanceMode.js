import types from '../actions/types';

const STATUS = false;
const URL = 'none';

export const maintenanceMode = (state = { status: STATUS }, action) => {
  switch (action.type) {
    case types.app.maintenanceModeStatus:
      return { ...state, status: action.status };

    case types.app.maintenanceModeMsg:
      return { ...state, msg: action.msg };

    default:
      return state;
  }
};

export const isMaintenanceModeEnabled = state => state.maintenanceMode.status || false;
export const getMaintenanceModeUrl = state => state.config.maintenanceMode.url || URL;
export const getMaintenanceModeMsg = state => state.maintenanceMode.msg;
