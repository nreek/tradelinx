import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';

// Helpers
import { toDashCase, toAllCaps } from '../../util/helpers';

class RadioInput extends PureComponent {
  renderRadioOptions = () => this.props.options.map(option => (
    <div className="radio-option-container" key={option.name}>
      <label>
        <div className="radio-option">
          <div className="radio-button">
            <input
              type="radio"
              name={toDashCase(this.props.name)}
              value={option.value}
              onChange={this.props.onChange}
              checked={this.props.value === option.value}
            />
          </div>
          <div className="radio-button-label">
            {_t(
              option.name,
              `${this.props.translation}.${toAllCaps(option.name)}`
            )}
          </div>
        </div>
      </label>
    </div>
  ));

  render() {
    const translatedName = _t(
      this.props.name,
      `${this.props.translation}.${toAllCaps(this.props.name)}`
    );
    return (
      <label className={`radio-input form-field ${this.props.className}`}>
        <div className="field-label">
          {`${translatedName}${this.props.required ? '*' : ''}`}
          {this.props.details && (
            <div className="field-details">
              {_t(
                this.props.details,
                `${this.props.translation}.${toAllCaps(this.props.name)}_DETAILS`,
              )}
            </div>
          )}
        </div>
        <div className="radio-input-options">{this.renderRadioOptions()}</div>
      </label>
    );
  }
}

RadioInput.defaultProps = {
  className: '',
  placeholder: '',
  value: '',
};

RadioInput.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  value: PropTypes.string,
  options: PropTypes.array,
  details: PropTypes.string,
  translation: PropTypes.string,
};

export default RadioInput;
