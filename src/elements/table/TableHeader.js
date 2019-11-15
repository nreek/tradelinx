import React, { PureComponent } from 'react';

class TableHeader extends PureComponent {
  render() {
    return <thead className="table-header">{this.props.children}</thead>;
  }
}

export default TableHeader;
