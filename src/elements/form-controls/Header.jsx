import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
// Helpers
import { toDashCase, toAllCaps, translate } from '../../util/helpers';
import ErrorTooltip from '../ErrorTooltip';

const propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  translation: PropTypes.string,
  headerType: PropTypes.number,
};

const defaultProps = {
  className: '',
  name: '',
  translation: '',
  headerType: 1,
};

class Header extends PureComponent {
  render() {
    const {
      headerType,
      name,
      className,
      translation,
    } = this.props;
    const translatedName = _t(
      name,
      `${translation}.${toAllCaps(name)}`,
    );
    const header = React.createElement(`h${headerType}`, {}, translatedName);

    return (
      <div className={`form-field header ${className}`}>{header}</div>
    );
  }
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
