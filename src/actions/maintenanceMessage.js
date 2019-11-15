import types from './types';

export const maintenanceMessageEnabled = (status, isConnectionError) => ({
  type: types.app.maintenanceMessageEnabled,
  status,
  isConnectionError,
});

export const maintenanceMessageStatus = status => ({
  type: types.app.maintenanceMessageStatus,
  status,
});

export const maintenanceMessageMsg = msg => ({
  type: types.app.maintenanceMessageMsg,
  msg,
});
