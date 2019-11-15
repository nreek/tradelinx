import React, { PureComponent } from 'react';

class TableRow extends PureComponent {
  render() {
    return <tr className="row">{this.props.children}</tr>;
  }
}

export default TableRow;
