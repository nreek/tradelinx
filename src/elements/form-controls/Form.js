import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  className: PropTypes.string,
  onSubmit: PropTypes.func,
};

const defaultProps = {
  className: '',
  onSubmit: () => {},
};

class Form extends PureComponent {
  onSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit();
  };

  render() {
    return (
      <form className={this.props.className} onSubmit={this.onSubmit}>
        {this.props.children}
      </form>
    );
  }
}

export default Form;
