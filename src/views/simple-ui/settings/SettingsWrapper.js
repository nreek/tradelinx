import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { toAllCaps, toDashCase } from '../../../util/helpers';

const propTypes = {
  name: PropTypes.string.isRequired,
  translation: PropTypes.string,
};

class SettingsWrapper extends PureComponent {
  render() {
    const {
      name, translation, children, className,
    } = this.props;
    return (
      <div className={`settings-container ${className}`}>
        <h4>{_t(name, `${translation}.${toAllCaps(name)}_NAME`)}</h4>
        <div className="settings-content">{children}</div>
      </div>
    );
  }
}

SettingsWrapper.propTypes = propTypes;

export default SettingsWrapper;
