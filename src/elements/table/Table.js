import React, { PureComponent } from 'react';

import TableBody from './TableBody';
import TableCell from './TableCell';
import TableHeader from './TableHeader';
import TableHeaderCell from './TableHeaderCell';
import TableRow from './TableRow';

class Table extends PureComponent {
  render() {
    return <table className="table">{this.props.children}</table>;
  }
}

Table.Body = TableBody;
Table.Cell = TableCell;
Table.Header = TableHeader;
Table.HeaderCell = TableHeaderCell;
Table.Row = TableRow;

export default Table;
