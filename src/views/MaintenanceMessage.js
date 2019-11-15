import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getMaintenanceMessageMsg } from '../reducers';

import '../../scss/maintenance-message.scss';

const DEFAULT_TEXT = 'Some pages are temporarily unavailable.';
const DEFAULT_TRANSLATE = 'MAINTENANCE_MESSAGE';

const propTypes = {
  t: PropTypes.string,
  pageType: PropTypes.string, // Expected values are: 'marketing-ui' or 'simple-ui' or 'trade-ui'
  data: PropTypes.instanceOf(Object),
};

const defaultProps = {
  t: 'MAINTENANCE_MODE',
  pageType: 'marketing-ui',
  get data() {
    return {
      translate: `${this.t}.${DEFAULT_TRANSLATE}`,
      msg: DEFAULT_TEXT,
    };
  },
};

export class MaintenanceMessage extends Component {
  state = {
    isClosed: false,
  };

  handleCloseClick = () => {
    this.setState({ isClosed: true });
  };

  render() {
    const { pageType, msg } = this.props;

    const isClosedClass = this.state.isClosed ? 'maintenance-message--closed' : '';
    return (
      <div className={`maintenance-message maintenance-message--${pageType} ${isClosedClass}`}>
        <div className={`maintenance-message-container maintenance-message-container--${pageType}`}>
          <div
            className="maintenance-message-content"
            dangerouslySetInnerHTML={{
              __html: _t(msg.msg, msg.translate),
            }}
          />
          <div className="maintenance-message-close" onClick={this.handleCloseClick}>
            <i className="fas fa-window-close" />
          </div>
        </div>
      </div>
    );
  }
}

MaintenanceMessage.propTypes = propTypes;
MaintenanceMessage.defaultProps = defaultProps;

const mapStateToProps = state => ({
  data: getMaintenanceMessageMsg(state),
  state,
});

export default connect(
  mapStateToProps,
  null,
)(MaintenanceMessage);
