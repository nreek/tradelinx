import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { selectSelectedInstrument, selectSelectedInstrumentBidAsk } from '../../reducers';


export class SimpleUiHeader extends PureComponent {
  render() {
    const { base, quote } = this.props.selectedInstrument;
    const { ask, bid } = this.props.selectedBidAsk;
    return (
      <div className="header">
        <div>
          <div
            className="header-hamburger-button"
            onClick={this.props.toggleSidebar}
          >
            <i className="far fa-bars fa-2x" />
          </div>
          <div className="market-value">
            {ask}{' - '}{base}/{quote}
          </div>
          <div>
            <Link to="/help">
              {_t('HELP', 'HEADER.HELP')}
            </Link>
            <Link to="/settings" className="text-lightblue">
              {this.props.username}
            </Link>
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  selectedInstrument: selectSelectedInstrument(state),
  selectedBidAsk: selectSelectedInstrumentBidAsk(state),
  username: state.user.username,
});

export default connect(
  mapStateToProps,
  null,
)(SimpleUiHeader);
