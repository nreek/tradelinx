import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';

import { toDashCase, toAllCaps, } from '../../util/helpers';

class FormLabel extends PureComponent {
  render() {
    return (
      <div
        className={`form-label ${this.props.className}`}
        dangerouslySetInnerHTML={{
          __html:
          _t(
            this.props.text || this.props.name,
            `${this.props.translation}.${toAllCaps(this.props.name)}`
          )
          || this.props.text || this.props.name,
        }}
      />
    );
  }
}

FormLabel.defaultProps = {
  className: '',
  name: '',
};

FormLabel.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  text: PropTypes.string,
  translation: PropTypes.string,
};

export default FormLabel;
