import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';

const propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  loading: PropTypes.bool,
  loadingStatus: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.string,
};

const defaultProps = {
  className: '',
  disabled: false,
  onClick: () => {},
  loading: false,
  loadingStatus: false,
  type: 'button',
};

class Button extends PureComponent {
  onClickHandler = (e) => {
    this.props.onClick(e);
  };

  renderValue = () => {
    if (this.props.children || this.props.value) {
      return this.props.children || this.props.value;
    }

    switch (this.props.type.toLowerCase()) {
      case 'close':
        return _t('Close', 'BUTTON.CLOSE');
      case 'submit':
        return _t('Submit', 'BUTTON.SUBMIT');
      default:
        return '';
    }
  };

  renderLoadingIcon = loadingStatus => (loadingStatus ? <i className="fa fa-spinner fa-spin" /> : null);

  render() {
    const {
      className,
      disabled,
      onFocus,
      onBlur,
      loading,
      loadingStatus,
      type,
      value,
    } = this.props;

    return (
      <button
        type={type === 'submit' ? 'submit' : 'button'}
        value={value}
        className={`button ${className} ${disabled ? 'disabled' : ''} ${
          loadingStatus ? 'loading' : ''
        }`}
        onClick={this.onClickHandler}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
      >
        <span className="text-container">{this.renderValue()}</span>
        {loading ? (
          <span className="icon-container">
            {this.renderLoadingIcon(loadingStatus)}
          </span>
        ) : null}
      </button>
    );
  }
}

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
