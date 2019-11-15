import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';

const propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onSubmit: PropTypes.func,
};

const defaultProps = {
  className: '',
  formValid: true,
  value: 'Submit',
};

class Submit extends PureComponent {
  onSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit(e);
  };

  render() {
    const disabled = !this.props.formValid ? ' disabled' : '';

    return (
      <div className={this.props.className}>
        <input
          type="submit"
          value={this.props.value}
          className={`form-field submit-button ${
            this.props.className
          }${disabled}`}
          onClick={this.onSubmit}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          disabled={!this.props.formValid}
        />
      </div>
    );
  }
}

Submit.propTypes = propTypes;
Submit.defaultProps = defaultProps;

export default Submit;
