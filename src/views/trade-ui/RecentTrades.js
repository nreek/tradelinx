import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { loadOrderEvents } from '../../actions';
import { selectTrades, selectSelectedInstrumentId } from '../../reducers';
// import { getFormattedDate } from '../../util/helpers';

class RecentTrades extends Component {
  componentDidMount() {
    this.props.loadData();
  }

  renderRows() {
    const rows = [];
    for (let i = this.props.data.length - 1; i >= 0; --i) {
      const row = this.props.data[i];
      rows.push(
        <div key={i} className={`recent-trades-row ${row.side}`}>
          <span className="recent-trades-price">{row.price}</span>
          <span className="recent-trades-size">{row.quantity}</span>          
        </div>,
      );
    }
    return rows;
  }

  render() {
    return (
      <Fragment>
        <div className="recent-trades-header">
          <span className="recent-trades-price">{_t('Price', 'RECENT_TRADES.PRICE')}</span>
          <span className="recent-trades-size">{_t('Size', 'RECENT_TRADES.SIZE')}</span>          
        </div>
        <div className="recent-trades-rows">{this.renderRows()}</div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  data: selectTrades(state),
  instrumentId: selectSelectedInstrumentId(state),
});

const mapDispatchToProps = dispatch => ({
  loadData: () => dispatch(loadOrderEvents()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RecentTrades);
