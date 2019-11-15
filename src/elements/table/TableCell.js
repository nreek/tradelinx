import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  className: PropTypes.string,
};

const defaultProps = {
  className: '',
};

class TableCell extends PureComponent {
  render() {
    return (
      <td className={`cell ${this.props.className}`} colSpan={this.props.colSpan}>{this.props.children}</td>
    );
  }
}

TableCell.propTypes = propTypes;
TableCell.defaultProps = defaultProps;

export default TableCell;
