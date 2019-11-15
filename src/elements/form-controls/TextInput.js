import React, { Component, Fragment } from 'react';
import { PropTypes } from 'prop-types';

import ErrorTooltip from '../ErrorTooltip';

// import MaskedInput from 'react-maskedinput';

// Helpers
import { toAllCaps, toDashCase, toCapsAndSpaces } from '../../util/helpers';

const propTypes = {
  className: PropTypes.string,
  details: PropTypes.string,
  hideInput: PropTypes.bool,
  label: PropTypes.string,
  mask: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  placeholder: PropTypes.string,
  translation: PropTypes.string,
  value: PropTypes.string.isRequired,
  errorMessages: PropTypes.array,
  writeOnce: PropTypes.bool,
  placeholderParam: PropTypes.instanceOf(Object),
  type: PropTypes.string,
};

const defaultProps = {
  className: '',
  hideInput: false,
  placeholder: '',
  value: '',
  errorMessages: [],
  writeOnce: false,
  disabled: true,
  placeholderParam: {},
  type: 'text',
};

export class TextInput extends Component {
  state = {
    hide: true,
  };

  toggleHide = () => {
    this.setState({
      hide: !this.state.hide,
    });
  };

  render() {
    const { placeholderParam, translation, name } = this.props;

    const translatedName = _t(name, `${translation}.${toAllCaps(name)}`);

    const placeholder = _t(
      this.props.placeholder,
      `${translation}.${toAllCaps(name)}_PLACEHOLDER`,
      placeholderParam,
    );

    const inputProps = {
      name: toDashCase(name),
      onChange: this.props.onChange,
      onFocus: this.props.onFocus,
      onBlur: this.props.onBlur,
      value: this.props.value,
    };

    return (
      <label className={`form-field text-input ${this.props.className}`}>
        <div className="field-label">
          {this.props.label || translatedName}
          {this.props.required ? <span className="form-required">*</span> : ''}
          {this.props.details && <div className="field-details">{this.props.details}</div>}
        </div>
        {this.props.mask ? (
          <div className="field-content">
            <ErrorTooltip errorMessages={this.props.errorMessages} />
            <MaskedInput mask={this.props.mask} {...inputProps} />
          </div>
        ) : (
          <div className={this.props.writeOnce ? 'field-content-disabled' : 'field-content'}>
            <ErrorTooltip errorMessages={this.props.errorMessages} />
            {this.props.hideInput ? (
              <div className="hide-show-password">
                <input
                  type={this.props.hideInput && this.state.hide ? 'password' : 'text'}
                  placeholder={placeholder}
                  autoComplete={this.props.hideInput && this.state.hide ? 'off' : 'on'}
                  disabled={this.props.writeOnce}
                  {...inputProps}
                />
                <i
                  onClick={this.toggleHide}
                  className={this.state.hide ? 'far fa-eye' : 'far fa-eye-slash'}
                />
              </div>
            ) : (
              <input
                placeholder={placeholder}
                autoComplete={this.props.hideInput ? 'off' : 'on'}
                type={this.props.type}
                disabled={this.props.writeOnce}
                {...inputProps}
              />
            )}
          </div>
        )}
      </label>
    );
  }
}

TextInput.propTypes = propTypes;
TextInput.defaultProps = defaultProps;

export default TextInput;
