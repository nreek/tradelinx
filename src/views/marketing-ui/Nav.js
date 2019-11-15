import React, { Component, Fragment } from 'react';
import Scrollchor from 'react-scrollchor';

// Redux
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { authStatus, selectUserAuthStatus } from '../../reducers';

// Components

import Languages from '../../elements/Languages';

export class Nav extends Component {
  renderButtons = () => {
    if (this.props.blacklistMode) {
      return null;
    } if (this.props.authStatus === authStatus.success) {
      return (
        <li>
          <Link to="/home" className="login-btn login dashboard">
            {_t('Dashboard', 'MARKETING.DASHBOARD')}
          </Link>
        </li>
      );
    }
    return (
      <Fragment>
        <li className="signup">
          <Link to='signup'>
            {_t('Sign Up', 'MARKETING.NAV_ITEM_SIGNUP')}
          </Link>
        </li>
        <li>
          <Link to='login' className="login-btn login">
            {_t('Login', 'MARKETING.NAV_ITEM_LOGIN')}
          </Link>
        </li>
      </Fragment>
    );
  };

  render() {
    return (
      <nav className="nav">
        <div className="nav-container">
          <Scrollchor to="#top" className="logo">
            <img
              src="images/logos/company-logo-icon.png"
              className="logo-img"
            />
          </Scrollchor>
          <ul className="nav-items">
            {/* <li>

              <Languages />

            </li> */}
            <li>
              <Scrollchor animate={{ offset: -100 }} to="#features">
                {_t('Features', 'MARKETING.NAV_ITEM_FEATURES')}
              </Scrollchor>
            </li>
            <li>
              <Scrollchor animate={{ offset: -100 }} to="#about">
                {_t('About Us', 'MARKETING.NAV_ITEM_ABOUT')}
              </Scrollchor>
            </li>
            <li>
              <Scrollchor animate={{ offset: -100 }} to="#vision">
                {_t('Our Vision', 'MARKETING.NAV_ITEM_VISION')}
              </Scrollchor>
            </li>
            {this.renderButtons()}
          </ul>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = state => ({ authStatus: selectUserAuthStatus(state) });


export default connect(
  mapStateToProps,
  null,
)(Nav);
