import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

const propTypes = {
  errorMessages: PropTypes.array,
};

const defaultProps = {
  errorMessages: [],
};

class ErrorTooltip extends Component {
  render() {
    if (this.props.errorMessages.length === 0) {
      return null;
    }
    return (
      <Fragment>
        <p
          className="form-icon-container"
          data-tip={this.props.errorMessages.join('<br />')}
          data-html
        >
          <i className="far error-icon fa-info-circle" />
        </p>
        <ReactTooltip />
      </Fragment>
    );
  }
}

ErrorTooltip.propTypes = propTypes;
ErrorTooltip.defaultProps = defaultProps;

export default ErrorTooltip;
