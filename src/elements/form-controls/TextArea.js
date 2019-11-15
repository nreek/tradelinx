import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
// Helpers
import { toDashCase, toAllCaps, translate } from '../../util/helpers';
import ErrorTooltip from '../ErrorTooltip';

const propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  value: PropTypes.string,
  details: PropTypes.string,
  label: PropTypes.string,
};

const defaultProps = {
  className: '',
  placeholder: '',
  value: '',
};

class TextArea extends PureComponent {
  render() {
    const translatedName = _t(
      this.props.name,
      `${this.props.translation}.${toAllCaps(this.props.name)}`,
    );

    return (
      <label className={`form-field text-area ${this.props.className}`}>
        <div className="field-label">
          {this.props.label || translatedName}
          {this.props.required ? <span className="form-required">*</span> : ''}
          {this.props.details && (
            <div className="field-details">{this.props.details}</div>
          )}
        </div>
        <div className="field-content">
          <ErrorTooltip errorMessages={this.props.errorMessages} />
          <textarea
            placeholder={
              _t(
                this.props.placeholder,
                `${this.props.translation}.${toAllCaps(
                  this.props.name,
                )}_PLACEHOLDER`,
              ) || translatedName
            }
            name={toDashCase(this.props.name)}
            onChange={this.props.onChange}
            onFocus={this.props.onFocus}
            onBlur={this.props.onBlur}
            value={this.props.value}
          />
        </div>
      </label>
    );
  }
}

TextArea.propTypes = propTypes;
TextArea.defaultProps = defaultProps;

export default TextArea;
