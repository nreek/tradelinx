import React, { Component, Fragment } from 'react';

class Notifications extends Component {
  render() {
    return (
      <div className="notifications-settings component">
        <div className="component-header">
          <h1>{_t('Notifications', 'SETTINGS_NOTIFICATIONS.TITLE')}</h1>
        </div>
        <div className="component-content notifications-content">
          <h2>{_t('Email me when', 'SETTINGS_NOTIFICATIONS.SUB_TITLE')}</h2>
          <div>
            <label className="checkbox-container">
              <input type="checkbox" />
              <span className="checkbox-custom" />
              <div className="checkbox-label">{_t('I send or receive digital currency', 'SETTINGS_NOTIFICATIONS.NOTIFICATION_ONE')}</div>
            </label>
          </div>
          <div>
            <label className="checkbox-container">
              <input type="checkbox" />
              <span className="checkbox-custom" />
              <div className="checkbox-label">{_t('I receive orders', 'SETTINGS_NOTIFICATIONS.NOTIFICATION_TWO')}</div>
            </label>
          </div>
          <div>
            <label className="checkbox-container">
              <input type="checkbox" />
              <span className="checkbox-custom" />
              <div className="checkbox-label">{_t('There are recommended actions for my account', 'SETTINGS_NOTIFICATIONS.NOTIFICATION_THREE')}</div>
            </label>
          </div>
          <button className="save">{_t('save', 'SETTINGS_NOTIFICATIONS.SAVE_BUTTON')}</button>
        </div>
      </div>
    );
  }
}

export default Notifications;
