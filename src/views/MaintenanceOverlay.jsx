import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getMaintenanceModeMsg, isMaintenanceModeEnabled } from '../reducers';
import '../../scss/maintenance-mode.scss';


const DEFAULT_TEXT = 'This page is currently undergoing maintenance.';
const DEFAULT_TRANSLATE = 'MAINTENANCE_MODE.CONTENT';

const propTypes = {
  msg: PropTypes.instanceOf(Object),
  enabled: PropTypes.bool,
  children: PropTypes.element.isRequired,
};

const defaultProps = {
  msg: {
    translate: DEFAULT_TRANSLATE,
    msg: DEFAULT_TEXT,
  },
  enabled: false,
};


export class MaintenanceOverlay extends PureComponent {
  render() {
    const { enabled, msg, children } = this.props;
    if (!enabled) {
      return ([children]);
    }

    return (
      <div className="maintenance-mode">
        <div className="maintenance-mode-container">
          <div className="logo-container">
            <img
              src="images/logos/company-logo-white.png"
              className="login-home-splash-logo company-logo-svg"
            />
          </div>
          <div
            className="maintenance-mode-content"
            dangerouslySetInnerHTML={{
              __html: _t(msg.msg, msg.translate),
            }}
          />
        </div>
      </div>
    );
  }
}

MaintenanceOverlay.propTypes = propTypes;
MaintenanceOverlay.defaultProps = defaultProps;

const mapStateToProps = state => ({
  msg: getMaintenanceModeMsg(state),
  enabled: isMaintenanceModeEnabled(state),
});

export default connect(
  mapStateToProps,
  null,
)(MaintenanceOverlay);
