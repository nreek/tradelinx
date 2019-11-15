import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Components
import Button from '../../../elements/Button';
import Table from '../../../elements/table/Table';
import Paginator from '../../../elements/Paginator';
import { floor, } from '../../../util/helpers';
import {
  selectProducts,
  selectBalances,
  selectMaxTableRowsBalances,
  selectExcludeDeposit,
  selectExcludeWithdraw,
  selectDefaultDecimalsCrypto,
} from "../../../reducers";

import { loadAccounts, } from '../../../actions';

const propTypes = {
  t: PropTypes.string,
};

const defaultProps = {
  t: 'ACCOUNT_HISTORY',
};

export class CurrentBalances extends PureComponent {
  state = {
    page: 1,
    filter: '',
    filteredProductSymbols: [],
    sort: {},
    prodBalances: [],
  }

  componentDidMount() {
    this.props.loadAccounts();
    this.setState({ filteredProductSymbols: Object.keys(this.props.products) });
  }

  componentDidUpdate(prevProps) {
    const { balances, products, } = this.props;
    const productsSymbol = Object.keys(products);

    if (Object.keys(prevProps.products).length !== productsSymbol.length) {
      this.setState({ filteredProductSymbols: productsSymbol });
    }
    if (
      productsSymbol.length
      && Object.keys(balances).length 
      && (
        !this.state.prodBalances.length 
        || balances !== prevProps.balances
      )
    ) {
      const prodBalances = Object.entries(products)
        .map((prodArray) => {
          prodArray[1].balance = +this.getBalance(prodArray[0]);
          prodArray[1].hold = +this.getHoldAmount(prodArray[0]);
          return prodArray[1];
        });
      this.setState({ prodBalances });
    }
  }

  setPage = page => this.setState({ page });

  setSort = (sortedCategory) => {
    const { category, direction } = this.state.sort;
    let sort = {};

    if (sortedCategory) {
      if (category !== sortedCategory || (category === sortedCategory && direction !== 'ascending')) {
        sort = { category: sortedCategory, direction: 'ascending' };
      } else if (category === sortedCategory && direction !== 'descending') {
        sort = { category: sortedCategory, direction: 'descending' };
      }
    }

    this.setState({ sort });
  };

  setModal = (action, product) => this.props.showModal(action, this.props.products[product]);

  onFilterChange = (e) => {
    let filter = e.target.value;
    let filteredProductSymbols = [];
    const { products } = this.props;

    if (filter) {
      Object.values(products).forEach((product, index) => {
        if ((product.id.toUpperCase()).indexOf(filter.toUpperCase()) !== -1) { // || (product.name.toUpperCase()).indexOf(filter.toUpperCase()) !== -1) {
          filteredProductSymbols.push(product.id);
        }
      });
    } else {
      filteredProductSymbols = Object.keys(products);
      filter = '';
    }
    this.setState({ filteredProductSymbols, filter });
  }

  sortProducts = (products) => {
    const { category, direction } = this.state.sort;

    const sortedProducts = products.sort((a, b) => {
      if (direction === 'descending') {
        if (a[category] < b[category]) {
          return 1;
        }
        return -1;
      } if (direction === 'ascending') {
        if (a[category] > b[category]) {
          return 1;
        }
        return -1;
      }
    });
    return sortedProducts;
  }

  highlightSearchText = (str) => {
    const { filter } = this.state;
    const textArr = [];

    const filterIndex = str.toUpperCase().indexOf(filter.toUpperCase());

    if (filterIndex !== -1) {
      const startFragment = str.slice(0, filterIndex);
      const highlightedText = str.substr(filterIndex, filter.length);
      const endFragment = str.slice(filterIndex + filter.length, str.length);

      if (startFragment) textArr.push({ text: startFragment, highlight: false });
      if (highlightedText) textArr.push({ text: highlightedText, highlight: true });
      if (endFragment) textArr.push({ text: endFragment, highlight: false });
    } else {
      textArr.push({ text: str, highlight: false });
    }

    return textArr;
  }

  renderTableHeader = () => {
    const { t } = this.props;
    const { category, direction } = this.state.sort;
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell className="product" onClick={() => { this.setSort('id'); }}>
            <span className={category === 'id' ? direction : ''}>{_t('Currency', `${t}.CURRENCY`)}</span>
          </Table.HeaderCell>
          <Table.HeaderCell className="balance" onClick={() => { this.setSort('balance'); }}>
            <span className={category === 'balance' ? direction : ''}>{_t('Balance', `${t}.BALANCE`)}</span>
          </Table.HeaderCell>
          <Table.HeaderCell className="hold" onClick={() => { this.setSort('hold'); }}>
            <span className={category === 'hold' ? direction : ''}>{_t('Hold', `${t}.HOLD`)}</span>
          </Table.HeaderCell>
          <Table.HeaderCell className="account-actions">
            {_t('Account Actions', `${t}.ACCOUNT_ACTIONS`)}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  };

  renderTableBody = () => {
    const { rowsPerPage } = this.props;
    const { prodBalances, filteredProductSymbols, sort } = this.state;

    let filteredProducts = prodBalances.filter(product => filteredProductSymbols.indexOf(product.id) !== -1);
    if (sort.category) {
      filteredProducts = this.sortProducts(filteredProducts);
    }
    const startingIndex = (this.state.page - 1) * rowsPerPage;
    const selection = filteredProducts.slice(startingIndex, startingIndex + rowsPerPage);
    const rows = selection.map(product => this.renderTableRow(product));

    if (prodBalances.length > rowsPerPage) { // only fill in empty rows if there is pagination
      const rowsCount = rows.length;
      for (let i = 0; i < rowsPerPage - rowsCount; i++) {
        rows.push(
          <Table.Row key={rowsCount + i}>
            <Table.Cell className="product" />
            <Table.Cell />
            <Table.Cell />
            <Table.Cell className="account-actions" />
          </Table.Row>,
        );
      }
    }

    return (
      <Table.Body>
        {rows}
      </Table.Body>
    );
  }

  getBalance = (product) => {
    const balance = this.props.balances[product];
    const decimals = this.props.products[product].decimals || this.props.defaultDecimals;

    if (balance) {
      return balance.total === 0
        ? balance.total
        : floor(this.props.balances[product].total, decimals);
    }
    return 0;
  };

  getHoldAmount = (product) => {
    const balance = this.props.balances[product];
    const decimals = this.props.products[product].decimals || this.props.defaultDecimals;

    if (balance) {
      const holdAmount = floor(balance.total, decimals) - floor(balance.withdrawal, decimals);
      return holdAmount === 0
        ? 0
        : holdAmount.toFixed(this.props.products[product].decimals);
    }
    return 0;
  };

  renderTableRow = (product) => {
    const productMatchText = this.highlightSearchText(product.id);

    const productHighlighted = productMatchText.map((textFrag, index) => (
      <span className={textFrag.highlight ? 'highlight' : ''} key={index}>
        {textFrag.text}
      </span>
    ));

    return (
      <Table.Row key={product.id}>
        <Table.Cell className="product">{productHighlighted}</Table.Cell>
        <Table.Cell className="balance">{product.balance}</Table.Cell>
        <Table.Cell className="hold">{product.hold}</Table.Cell>
        <Table.Cell className="account-actions">
          {this.renderActionButtons(
            product.id,
            this.props.excludeDeposit,
            this.props.excludeWithdraw,
          )}
        </Table.Cell>
      </Table.Row>
    );
  };

  renderActionButtons = (product, excludeDeposit, excludeWithdraw) => (
    <div className="action-buttons">
      {!excludeDeposit.includes(product) && (
        <Button onClick={() => this.setModal('deposit', product)}>
          {_t('Deposit', `${this.props.t}.DEPOSIT`)}
        </Button>
      )}
      {!excludeWithdraw.includes(product) && (
        <Button onClick={() => this.setModal('withdraw', product)}>
          {_t('Withdraw', `${this.props.t}.WITHDRAW`)}
        </Button>
      )}
    </div>
  );

  renderCurrentBalancesTable = () => (
    <Table>
      {this.renderTableHeader()}
      {this.renderTableBody()}
    </Table>
  );

  render() {
    const { category } = this.state.sort;

    return (
      <div className="current-balances">
        <div className="current-balances-header">
          <h3>{_t('Current Balances', `${this.props.t}.CURRENT_BALANCES`)}</h3>
          <div className="balances-filter-container">
            {category
              && (
              <p className="clear-sort-button" onClick={() => this.setSort(null)}>
                <i className="fas fa-times-circle" />
&nbsp;
                {_t('Clear Sort', `${this.props.t}.CLEAR_SORT`)}
              </p>
              )
            }
            <input
              className="balances-filter"
              onChange={this.onFilterChange}
              placeholder={_t('Filter', `${this.props.t}.FILTER`)}
              value={this.state.filter}
            />
          </div>
        </div>
        {this.renderCurrentBalancesTable()}
        <div className="table-bottom-bar current-balances-bottom-bar">
          {Object.keys(this.props.products).length > this.props.rowsPerPage
            && (
            <div className={this.state.filteredProductSymbols.length < this.props.rowsPerPage ? 'hidden' : ''}>
              <Paginator
                currentPage={this.state.page}
                setPage={this.setPage}
                numItems={Object.keys(this.props.products).length}
                itemsPerPage={this.props.rowsPerPage}
              />
            </div>
            )
          }
        </div>
      </div>
    );
  }
}

CurrentBalances.propTypes = propTypes;
CurrentBalances.defaultProps = defaultProps;

const mapStateToProps = state => ({
  balances: selectBalances(state),
  products: selectProducts(state),
  rowsPerPage: selectMaxTableRowsBalances(state),
  excludeDeposit: selectExcludeDeposit(state),
  excludeWithdraw: selectExcludeWithdraw(state),
  defaultDecimals: selectDefaultDecimalsCrypto(state),
});

const mapDispatchToProps = dispatch => ({
  loadAccounts: () => dispatch(loadAccounts()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CurrentBalances);
