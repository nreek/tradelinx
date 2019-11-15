import types from '../actions/types';

const STATUS = false;
const URL = 'none';

export const maintenanceMessage = (state = { status: STATUS }, action) => {
  switch (action.type) {
    case types.app.maintenanceMessageStatus:
      return { ...state, status: action.status };

    case types.app.maintenanceMessageMsg:
      return { ...state, msg: action.msg };

    default:
      return state;
  }
};

export const isMaintenanceMessageEnabled = state => state.maintenanceMessage.status || false;
export const getMaintenanceMessageUrl = state => state.config.maintenanceMessage.url || URL;
export const getMaintenanceMessageMsg = state => state.maintenanceMessage.msg;
