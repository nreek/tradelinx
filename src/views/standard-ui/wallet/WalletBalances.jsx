import React, { Component } from 'react';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

// Redux
import { 
  selectBalances,
  selectProducts,
  selectConfig,
} from '../../../reducers';

// Helpers
import { formatNumberToLocale, toSnakeCase, capitalize } from '../../../util/helpers';

class WalletBalances extends Component {
  state = {
    type: 'crypto',
    filter: '',
    sort: '',
    favorites: [],
  }

  sortOptions = [
    'favorites',
    'ascending',
    'descending',
  ]

  componentDidMount() {
    if (localStorage.userFavorites) { // TODO: Update once a service to add this to a user's account is completed
      let favorites = JSON.parse(localStorage.userFavorites);
      this.setState({ favorites });
    }
  }

  toggleSortDropdown = () => this.setState({ showSortDropdown: !this.state.showSortDropdown });

  setSort = (sort) => {
    if (sort !== this.state.sort) {
      this.setState({ sort });
    } else {
      this.setState({ sort: null });
    }
  }

  setType = type => this.setState({ type });
  onFilterChange = e => this.setState({ filter: e.target.value.toUpperCase() });
  
  isProductFiltered = id => !(id.toUpperCase().includes(this.state.filter));

  renderProducts = () => {
    const { products, balances, setCurrency, baseCurrency, currentCurrency } = this.props;
    const { favorites, sort, type } = this.state;

    let filteredProducts = Object.entries(products);

    switch(sort) {
      case 'favorites':
        filteredProducts = filteredProducts
          .filter(([productId, product]) => {
            return favorites.reduce((foundProduct, favorite) => foundProduct || favorite.includes(productId), false);
          });
        break;
      case 'ascending':
        filteredProducts = filteredProducts
          .sort((a,b) => {
            const aProduct = a[0];
            const bProduct = b[0];
            return aProduct.localeCompare(bProduct);
          });
        break;
      case 'descending':
          filteredProducts = filteredProducts
          .sort((a,b) => {
            const aProduct = a[0];
            const bProduct = b[0];
            return bProduct.localeCompare(aProduct);
          });
        break;
      case 'all':
      default:
        break;
    }
    
    return filteredProducts
      .filter(([productId, product]) => {
        return (product.type === type) && (!this.isProductFiltered(product.name) || !this.isProductFiltered(productId))
      })
      .map(([productId, product], index) => {
        const balance = (balances[productId] || {}).total;
          return (
            <div 
              className={`currency ${productId} block ${productId === currentCurrency.id ? 'active' : ''}`} 
              onClick={() => this.props.setCurrency(product)} key={index}
              >
              <div className='currency-label block-segment'>
                <img alt='' className={`currency-icon ${productId}-icon`} src={`images/icons/currency-icons/black/${productId}.svg`} />
                <h2 className='currency-name'>
                  {product.name}
                </h2>
              </div>
              <div className='currency-balance block-segment'>
                <span>{_t('Balance', 'WALLETS.BALANCE')}</span>
                <span className='balance-value'>{formatNumberToLocale(balance, product.decimals)}</span>
              </div>
            </div>
          )
      })
  }

  renderSortDropdown = () => {
    const { sort } = this.state;
    return (
      <div className='sort-dropdown'>
        {this.sortOptions.map((sortOption, index) => {
          return (
            <p className='sort-option' onClick={() => this.setSort(sortOption)} key={index}>
              <i className={`far fa-${sort === sortOption ? 'dot-' : ''}circle`} />
              &nbsp;
              <span>{_t(capitalize(sortOption), `WALLETS.${toSnakeCase(sortOption, 'uppercase')}`)}</span>
            </p> 
          )
        })}
      </div>
    )
  }

  render() {
    const { type } = this.state;

    return (
      <div className='wallet-balances component'>
        <div className='component-header'>
          <h1>{_t('Wallets', 'WALLETS.TITLE')}</h1>
        </div>
        <div className='component-content'>
          <div className='wallet-filter-bar'>
            <div className="filter-input-container">
              <i className="fal fa-search" />
              <input
                onChange={this.onFilterChange}
                placeholder={_t('Search', 'WALLETS.SEARCH_PLACEHOLDER')}
                value={this.state.filter}
              />
            </div>
            <div className='filter-sort-container'>
              <h2>{_t('Sort', 'WALLETS.SORT')}</h2>
              &nbsp;
              {this.state.showSortDropdown ?
                <i className='far fa-ellipsis-h-alt' onClick={this.toggleSortDropdown} />
              :
                <i className='far fa-ellipsis-h' onClick={this.toggleSortDropdown} />
              }
              {this.state.showSortDropdown && 
                this.renderSortDropdown()
              }
            </div>
          </div>
          <div className='wallet-type-select'>
            <div 
              className={`crypto-type-select type-select tab ${type === 'crypto' ? 'active' : ''}`} 
              onClick={() => this.setType('crypto')}
            >
              {_t('Crypto', 'WALLETS.CRYPTO')}
            </div>
            <div 
              className={`fiat-type-select type-select tab ${type === 'fiat' ? 'active' : ''}`} 
              onClick={() => this.setType('fiat')}
            >
              {_t('Fiat', 'WALLETS.FIAT')}
            </div>
          </div>
          <PerfectScrollbar className='currency-list'>
            {this.renderProducts()}
          </PerfectScrollbar>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  balances: selectBalances(state),
  products: selectProducts(state),
  config: selectConfig(state),
  baseCurrency: state.config.baseCurrency,
});

export default connect(
  mapStateToProps,
  null
)(WalletBalances);