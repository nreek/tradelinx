import types from './types';

export const maintenanceModeEnabled = status => ({
  type: types.app.maintenanceModeEnabled,
  status,
});

export const maintenanceModeStatus = status => ({
  type: types.app.maintenanceModeStatus,
  status,
});

/**
 *
 * @param {Object} msg
 *
 * @example { msg: `Some message`, translate: `MAINTENANCE_MODE.MSG` }
 */
export const maintenanceModeMsg = msg => ({
  type: types.app.maintenanceModeMsg,
  msg,
});
