/**
 * `timeInterval` types:
 * - `one-time` - Constant Key: MM_TYPE_ONE_TIME
 * - `recurring` - Constant Key: MM_TYPE_RECURRING
 *
 * `startTime` formats:
 * - Full date and time for `one-time` @example `2019-05-04 22:10+00:00`
 * - Only time for `recurring` @example `22:10+00:00`
 *
 * `type`:
 * - `one-time` - Constant Key: MM_EVERY_DAY
 * - `Days of week` - Constant Key: MM_DAYS_OF_WEEK
 * - `Days of month` - Constant Key: MM_DAYS_OF_MONTH
 *
 * `Days of week` and `Days of month` should include addition property {Array} `values`
 *
 * `values` of `Days of week`: enum (mon, tue, wed, thu, fri, sat, sun)
 * `values` of `Days of month`: enum number (1, 2, ... 31)
 *
 * `durationMins` - Numbers of minutes for `Maintenance Mode`
 * `maintenanceModeMessage` - Message for `Manintenance Mode`
 * `maintenanceModeMsgTranslation` - Translation for `Manintenance Mode`
 *
 * `Warning message` options:
 *
 * `displayWarningBeforeMaintenance` - {Boolean} - Enable/Disable Maintenance Message Before Maintenance Mode
 * `displayWarningMinsBefore` - {Number} - Display Maintenance Message Before Maintenance Mode in Minutes
 * `warningMessage` - Message for `Manintenance Message`
 * `warningMessageTranslation` - Translation for `Manintenance Message`
 *
 */

const maintenanceMode = {
  enabled: false, // Enables or disables maintenance mode
  enabledMessage: false, // Enables or disables maintenance message on the top of the page
  url: '', // Can be empty, undefined, or 'none'
};

export default maintenanceMode;
