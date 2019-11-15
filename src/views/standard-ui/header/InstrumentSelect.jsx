import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import enhanceWithClickOutside from 'react-click-outside';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Fade from 'react-reveal';
import { CSSTransition } from 'react-transition-group';

import {
  selectSelectedInstrument,
  selectInstruments,
  selectTickers,
  selectProducts,
} from '../../../reducers';
import { changeInstrument } from '../../../actions';

import { formatNumberToLocale, capitalize, toSnakeCase } from '../../../util/helpers';

class InstrumentSelect extends Component {
  state = {
    filter: '',
    filterFavorites: false,
    sort: '',
    showDropdown: false,
    favorites: [],
  };

  sortOptions = [
    'ascending',
    'descending',
  ];

  componentDidMount() {
    if (localStorage.userFavorites) {
      // TODO: Update once a service to add this to a user's account is completed
      const favorites = JSON.parse(localStorage.userFavorites);
      this.setState({ favorites });
    }
  }

  onFilterChange = e => this.setState({ filter: e.target.value.toUpperCase() });

  toggleDropdown = () => this.setState({ showDropdown: !this.state.showDropdown });

  toggleFavorites = () => this.setState({ filterFavorites: !this.state.filterFavorites });

  setSort = (sort) => {
    if (sort !== this.state.sort) {
      this.setState({ sort })
    } else {
      this.setState({ sort: '' })
    }
  }

  changeInstrument = instrument => () => {
    this.props.changeInstrument(instrument.id);
    this.setState({ filter: '' });

    this.props.closeDropdown && this.props.closeDropdown();
    this.toggleDropdown()
  };

  addToFavorites = (instrument) => {
    // TODO: Update once a service to add this to a user's account is completed
    const { favorites } = this.state;
    if (!favorites.includes(instrument)) {
      favorites.push(instrument);
    } else {
      const favIndex = favorites.indexOf(instrument);
      favorites.splice(favIndex, 1);
    }

    localStorage.userFavorites = JSON.stringify(favorites);
    this.setState({ favorites });
  };

  renderInstrumentRow = (instrument) => {
    const {
      id, base, quote, quoteDecimals,
    } = instrument;
    const { selectedInstrument, tickers } = this.props;
    const { favorites } = this.state;

    let ticker = null;
    let priceChangeClass = '';
    const isTickerAvailable = Object.keys(tickers).length && tickers[id];

    if (isTickerAvailable) {
      ticker = tickers[id];
      priceChangeClass = ticker.price_24h_change > 0 ? 'up' : ticker.price_24h_change < 0 ? 'down' : '';
    }

    return (
      <div
        key={id}
        className={`instrument-row block ${id === selectedInstrument.id ? 'active' : ''}`}
        onClick={this.changeInstrument(instrument)}
      >
        <span className="instrument-symbol block-segment">
          <img alt='' className={`currency-icon ${instrument.base}-icon`} src={`images/icons/currency-icons/black/${instrument.base}.svg`} />
          <span>{base} / {quote}</span>
        </span>
        <span className={`instrument-price ${priceChangeClass} block-segment`}>
          {ticker && formatNumberToLocale(ticker.ask, quoteDecimals)}
        </span>
        {/* <span className="instrument-volume block-segment">
          {ticker && `${parseFloat(ticker.volume_24h_change).toFixed(2)} volume`}
        </span> */}
        <span 
          className={`instrument-favorite block-segment ${favorites.includes(id) ? 'favorited' : ''}`} 
          onClick={(e) => {
            e.stopPropagation();
            this.addToFavorites(id)
          }}
        >
          <i className='fas fa-star' />
        </span>
      </div>
    );
  };

  isInstrumentFiltered = id => !id.includes(this.state.filter);

  renderInstrumentSortFilter = () => {
    const { sort, filterFavorites} = this.state;

    const sortFilters = [(
      <span
        className={`instrument-sort-filter ${filterFavorites ? 'active' : ''} tab`}
        onClick={this.toggleFavorites}
      >
        {_t(`Favorites`, `INSTRUMENT_SELECT.FILTER_FAVORITES`)}
      </span>
    )]

    this.sortOptions.forEach((sortOption, index) => {
      sortFilters.push(
        <span
          className={`instrument-sort-filter ${sortOption === sort ? 'active' : ''} tab`}
          onClick={() => this.setSort(sortOption)}
          key={sortFilters.length + index}
        >
          {_t(`${capitalize(sortOption)}`, `INSTRUMENT_SELECT.FILTER_${toSnakeCase(sortOption, 'uppercase')}`)}
        </span>
      )
    });

    return sortFilters;
  };

  renderInstruments = () => {
    const { instruments, tickers } = this.props;
    const { sort, filterFavorites, favorites } = this.state;

    let filteredInstruments = Object.values(instruments);

    switch (sort) {
      case 'favorites':
        filteredInstruments = filteredInstruments.filter(instrument => favorites.includes(instrument.id));
        break;
      case 'ascending':
        filteredInstruments = filteredInstruments
          .sort((a,b) => {
            const aInstrument = a.id;
            const bInstrument = b.id;
            return aInstrument.localeCompare(bInstrument);
          });
        break;
      case 'descending':
          filteredInstruments = filteredInstruments
          .sort((a,b) => {
            const aInstrument = a.id;
            const bInstrument = b.id;
            return bInstrument.localeCompare(aInstrument);
          });
        break;
      case 'all':
      default:
        break;
    }

    if (filterFavorites) {
      filteredInstruments = filteredInstruments.filter(instrument => {
        return favorites.some(favorite => favorite === instrument.id) }
      );
    }

    const renderedInstruments = [];
    for (const instrument of filteredInstruments) {
      if (!this.isInstrumentFiltered(instrument.id)) {
        renderedInstruments.push(this.renderInstrumentRow(instrument));
      }
    }

    return renderedInstruments;
  };

  render() {
    const { showDropdown, showList } = this.state;
    const { selectedInstrument, products } = this.props;
    const baseProduct = products[selectedInstrument.base] || {};

    return (
      <Fragment>
        <div className={`dropdown-instrument-select ${showDropdown ? 'open' : ''}`}>
          <div className={`current-instrument-container ${showDropdown ? 'open' : ''}`}>
            <div className="current-instrument" onClick={this.toggleDropdown}>
              <img
                className={`currency-icon ${selectedInstrument.base}-icon`}
                src={selectedInstrument.base ? `images/icons/currency-icons/black/${selectedInstrument.base}.svg` : null}
              />
              <span className="instrument-symbol">
                {`${baseProduct.name} / ${
                  selectedInstrument.quote
                }`}
              </span>
              {this.state.showDropdown ? (
                <i className="fal fa-angle-up" />
              ) : (
                <i className="fal fa-angle-down" />
              )}
            </div>
            <div className="instrument-select-input">
              <i className="fal fa-search" />
              <input
                onChange={this.onFilterChange}
                onKeyUp={this.onKeyUp}
                placeholder={_t('Search Pairs', 'INSTRUMENT_SELECT.SEARCH_PLACEHOLDER')}
                value={this.state.filter}
                onFocus={() => !showDropdown && this.toggleDropdown()}
              />
            </div>
          </div>
          {showDropdown && (
            <Fragment>
              <div className="instruments-list">
                <div className="instrument-sort-filters">{this.renderInstrumentSortFilter()}</div>
                {/* <Fade
                cascade
                collapse
                appear={showDropdown}
                when={showDropdown}
                duration={100}
              > */}
                <PerfectScrollbar>{this.renderInstruments()}</PerfectScrollbar>
                {/* </Fade> */}
              </div>
            </Fragment>
          )}
        </div>
        {showDropdown && <div className="backdrop" onClick={this.toggleDropdown} />}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  instruments: selectInstruments(state),
  products: selectProducts(state),
  selectedInstrument: selectSelectedInstrument(state),
  tickers: selectTickers(state),
});

const mapDispatchToProps = dispatch => ({
  changeInstrument: instrument => dispatch(changeInstrument(instrument)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InstrumentSelect);
