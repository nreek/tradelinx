import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Helpers
import { toDashCase, toAllCaps } from '../../util/helpers';
import ErrorTooltip from '../ErrorTooltip';

const propTypes = {
  details: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  hideLabel: PropTypes.bool,
  writeOnce: PropTypes.bool,
};

const defaultProps = {
  className: '',
  options: [],
  placeholder: '',
  hideLabel: false,
  writeOnce: false,
};

class Select extends PureComponent {
  constructor(props) {
    super(props);
    this.translatedName = _t(
      this.props.name,
      `${this.props.translation}.${toAllCaps(this.props.name)}`,
    );
  }

  renderSelectOptions = () => {
    const selectOptions = this.props.options.map((option, index) => (
      <option key={`option.value+${index}`} value={option.value}>
        {_t(
          option.name,
          `${this.props.translation}.${toAllCaps(option.name)}`,
        )}
      </option>
    ));

    if (this.props.placeholder) {
      selectOptions.unshift(
        <option key="placeholder" value="" disabled>
          {_t(
            this.props.placeholder,
            `${this.props.translation}.${toAllCaps(
              this.props.name,
            )}_PLACEHOLDER`,
          )}
        </option>,
      );
    }

    return selectOptions;
  };

  render() {
    return (
      <label
        className={`form-field select ${this.props.className
          || `${toDashCase(this.props.name)}`}`}
      >
        {!this.props.hideLabel && (
          <div className="field-label">
            {this.translatedName}
            {this.props.required ? (
              <span className="form-required">*</span>
            ) : (
              ''
            )}
            {this.props.details && (
              <div className="field-details">{this.props.details}</div>
            )}
          </div>
        )}
        <div
          className={
            this.props.writeOnce ? 'field-content-disabled' : 'field-content'
          }
        >
          <ErrorTooltip errorMessages={this.props.errorMessages} />

          <select
            name={toDashCase(this.props.name)}
            onFocus={this.props.onFocus}
            onChange={this.props.onChange}
            value={this.props.value}
            readOnly={this.props.writeOnce}
            disabled={this.props.writeOnce}
          >
            {this.renderSelectOptions()}
          </select>
        </div>
      </label>
    );
  }
}

Select.propTypes = propTypes;
Select.defaultProps = defaultProps;

export default Select;
