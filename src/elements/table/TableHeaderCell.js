import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  className: PropTypes.string,
};

const defaultProps = {
  className: '',
};

class TableHeaderCell extends PureComponent {
  render() {
    return (
      <th className={`header-cell ${this.props.className}`} onClick={this.props.onClick}>
        {this.props.children}
      </th>
    );
  }
}

TableHeaderCell.propTypes = propTypes;
TableHeaderCell.defaultProps = defaultProps;

export default TableHeaderCell;
