# Maintenance mode

##### Frontend team can enable Maintenance mode  and message via config file.
##### Maintenance mode  and message have their own `actions`, `reducer` and `epics` where are set logic (`maintenanceMode.js` and `maintenanceMessage.js`).
#### Config `./config/maintenanceMode.js`

```
`enabled`: false, // Enables/disables maintenance mode
`enabledMessage`: false, // Enables/disables maintenance message on the top of the page
`url`: '', // Can be empty, undefined, or 'none'
```

###### Scheduled section of maintenance mode
```
`timeInterval` types:
  - `one-time` - Constant Key: MM_TYPE_ONE_TIME
  - `recurring` - Constant Key: MM_TYPE_RECURRING

 `startTime` formats:
  - Full date and time for `one-time` @example `2019-05-04 22:10+00:00`
  - Only time for `recurring` @example `22:10+00:00`
 
`type`:
 - `one-time` - Constant Key: MM_EVERY_DAY
 - `Days of week` - Constant Key: MM_DAYS_OF_WEEK
 - `Days of month` - Constant Key: MM_DAYS_OF_MONTH
 
 `Days of week` and `Days of month` should include addition property {Array} `values`:
  - `values` of `Days of week`: enum (mon, tue, wed, thu, fri, sat, sun)
  - `values` of `Days of month`: enum number (1, 2, ... 31)

 `durationMins` - Numbers of minutes for `Maintenance Mode`
 `maintenanceModeMessage` - Message for `Manintenance Mode`
 `maintenanceModeMsgTranslation` - Translation for `Manintenance Mode`

 #`Warning message` options:

 `displayWarningBeforeMaintenance` - {Boolean} - Enable/Disable Maintenance Message Before Maintenance Mode
 `displayWarningMinsBefore` - {Number} - Display Maintenance Message Before Maintenance Mode in Minutes
 `warningMessage` - Message for `Manintenance Message`
 `warningMessageTranslation` - Translation for `Manintenance Message`
```

###### Example of `One time Manintenance mode` with enabled `Manintenance Message`

```
const maintenanceMode = {
  enabled: false
  enabledMessage: false,
  url: '',
  scheduled: [
    {
      timeInterval: 'one-time',
      startTime: '2019-05-07 11:10+00:00',
      durationMins: 90.0,
      maintenanceModeMessage: 'Our website is currently unavailable. Maintenance is scheduled to be completed by 7:30 UTC one-time',
      maintenanceModeMsgTranslation: 'MAINTENANCE_MODE.ERROR',
      displayWarningBeforeMaintenance: true,
      displayWarningMinsBefore: 30.0,
      warningMessage: 'Certain portions of our website may be unavailable due to scheduled maintenance starting at 6:00 UTC',
      warningMessageTranslation: 'MAINTENANCE_MODE.WARNING_MSG',
    },
  ]
}
```
###### In this example we will see: 
- Maintenance mode one time on 2019-05-07 at 11:10+00:00.
- This Maintenance mode takes 90 minutes.
- We will see Maintenance message 30 minutes before Maintenance mode.
- For both Maintenance mode and message we can set default Text and translate for this text, but translation should be added to frontend.

###### Example of `Recurring  Every day Manintenance mode` with enabled `Manintenance Message`

```
{
      timeInterval: 'recurring',
      type: 'Every day',
      startTime: '14:33:00+00:00',
      durationMins: 120,
      maintenanceModeMessage: 'Out website is currently unavailable due to scheduled maintenance. Maintenance is expected to be completed by 10:00 UTC Every day',
      maintenanceModeMsgTranslation: 'MAINTENANCE_MODE.ERROR',
      displayWarningBeforeMaintenance: true,
      displayWarningMinsBefore: 30.0,
      warningMessage: 'Certain portions of our website may be unavailable due to scheduled weekly maintenance starting at 8:00 UTC',
      warningMessageTranslation: 'MAINTENANCE_MODE.WARNING_MSG',
    },
````
###### In this example we will see: 
- Maintenance mode Recurring  Every day at 14:33:00+00:00.
- This Maintenance mode takes 120 minutes.
- We will see Maintenance message 30 minutes before Maintenance mode.
- For both Maintenance mode and message we can set default Text and translate for this text, but translation should be added to frontend.

###### Example of `Recurring  Days of week Manintenance mode` with enabled `Manintenance Message`
```
{
      timeInterval: 'recurring',
      type: 'Days of week',
      values: ['sat'],
      startTime: '01:53:00+00:00',
      durationMins: 120,
      maintenanceModeMessage: 'Out website is currently unavailable due to scheduled maintenance. Maintenance is expected to be completed by 10:00 UTC Days of week',
      maintenanceModeMsgTranslation: 'MAINTENANCE_MODE.ERROR',
      displayWarningBeforeMaintenance: true,
      displayWarningMinsBefore: 30.0,
      warningMessage: 'Certain portions of our website may be unavailable due to scheduled weekly maintenance starting at 8:00 UTC',
      warningMessageTranslation: 'MAINTENANCE_MODE.WARNING_MSG',
    },
```
###### In this example we will see: 
- Maintenance mode Recurring  Days of week on Saturday at 01:53:00+00:00.
- This Maintenance mode takes 120 minutes.
- We will see Maintenance message 30 minutes before Maintenance mode.
- For both Maintenance mode and message we can set default Text and translate for this text, but translation should be added to frontend.

###### Example of `Recurring  Days of month Manintenance mode` with enabled `Manintenance Message`
```
{
    timeInterval: 'recurring',
    type: 'Days of month',
    values: [4, 15, 25],
    startTime: '01:53:00+00:00',
    durationMins: 120,
    maintenanceModeMessage: 'Out website is currently unavailable due to scheduled maintenance. Maintenance is expected to be completed by 10:00 UTC Days of month',
    maintenanceModeMsgTranslation: 'MAINTENANCE_MODE.ERROR',
    displayWarningBeforeMaintenance: true,
    displayWarningMinsBefore: 30.0,
    warningMessage: 'Certain portions of our website may be unavailable due to scheduled weekly maintenance starting at 8:00 UTC',
    warningMessageTranslation: 'MAINTENANCE_MODE.WARNING_MSG',
}
```
###### In this example we will see: 
- Maintenance mode Recurring  Every month on 4, 15, 25 at 01:53:00+00:00.
- This Maintenance mode takes 120 minutes.
- We will see Maintenance message 30 minutes before Maintenance mode.
- For both Maintenance mode and message we can set default Text and translate for this text, but translation should be added to frontend.

#### We can use mix of different types of schedules 

