import React, { PureComponent, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import ScrollingTicker from '../../elements/ScrollingTicker';
import InstrumentSelect from './header/InstrumentSelect';
import InstrumentStats from './header/InstrumentStats';

import { formatNumberToLocale } from '../../util/helpers';

export class StandardUiHeader extends PureComponent {
  render() {
    return (
      <header className="standard-ui-header">
        {window.location.pathname === '/trade' ?
          <Fragment>
            <InstrumentSelect />
            <InstrumentStats />
          </Fragment>
        :
          <div className='scrolling-ticker-container'>
            <ScrollingTicker />
          </div>
        }
        <div className='side-buttons'>
          <span className='notification-icon' onClick={this.props.toggleSidebar}>
            <i className="fas fa-envelope" />
          </span>
          <Link to='/settings'>
            <h2 className='username'>
              {this.props.username}
            </h2>
          </Link>
          <span className='user-icon'>
            <i className='fas fa-user-circle' /> {/* TODO: USER PROFILE PIC HERE */}
          </span>
        </div>
      </header>
    );
  }
}

const mapStateToProps = state => ({
  username: state.user.username,
});

export default connect(
  mapStateToProps,
  null,
)(StandardUiHeader);
