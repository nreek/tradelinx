import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-switch';

const propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.bool,
};

const defaultProps = {
  onChange: () => {},
};

class ToggleSwitch extends PureComponent {
  render() {
    return (
      <span className="toggle-container">
        <label>
          <Switch
            onChange={this.props.onChange}
            checked={this.props.value}
            id="normal-switch"
            onColor="#7acd45"
            className="switch"
          />
        </label>
      </span>
    );
  }
}

ToggleSwitch.propTypes = propTypes;
ToggleSwitch.defaultProps = defaultProps;

export default ToggleSwitch;
