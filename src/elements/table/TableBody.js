import React, { PureComponent } from 'react';

class TableBody extends PureComponent {
  render() {
    return <tbody className="table-body">{this.props.children}</tbody>;
  }
}

export default TableBody;
