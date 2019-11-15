import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { logout, setTheme } from '../../actions';

export class StandardUiMobileNav extends PureComponent {

  renderTabDots = () => this.props.totalTabs.map((x, i) => (
      <span key={i} className={this.props.position === i ? 'tab-dot-selected' : 'tab-dots'} onClick={() => this.props.onDotClick(i)} />
    ));


  onLogout = () => {
    this.props.logout();
    this.props.history.push('/');
  };

  toggleTheme = () => {
    if (this.props.siteTheme === 'light') {
      this.props.setTheme('dark');
    } else {
      this.props.setTheme('light');
    }
  }

  render() {
    return (
      <Fragment>
        <a className="mobile-logout" onClick={this.onLogout}>
          <i className="fas fa-sign-out-alt" />
        </a>
        <nav className="standard-ui-mobile-nav">
          <div className="dot-container">
            <div className="side-arrow-left" onClick={() => this.props.onDotClick('left')}>
              <i className="fas fa-chevron-left"></i>
            </div>
            <div className='dots'>
              {this.renderTabDots()}
            </div>
            <div className="side-arrow-right" onClick={() => this.props.onDotClick('right')}>
              <i className="fas fa-chevron-right"></i>
            </div>
          </div>
          <ul className="nav-links">
            <li className="item nav-link" title={_t('Home', 'NAV.HOME')}>
              <NavLink to="/home" activeClassName="active">
                <i className="fas fa-th-large" />
                dashboard
              </NavLink>
            </li>
            <li className="item nav-link" title={_t('Wallet', 'NAV.WALLET')}>
              <NavLink to="/wallet" activeClassName="active">
                <i className="fas fa-wallet" />
                wallet
              </NavLink>
            </li>
            <li className="item nav-link" title={_t('Trade', 'NAV.TRADE')}>
              <NavLink to="/trade" activeClassName="active">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="45px"
                  height="45px"
                  viewBox="0 0 24 24"
                >
                  <path fill="none" d="M0 0h24v24H0V0z" />
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM6.5 9l3.15-3.15c.2-.2.51-.2.71 0L13.5 9H11v4H9V9H6.5zm7.85 9.15c-.2.2-.51.2-.71 0L10.5 15H13v-4h2v4h2.5l-3.15 3.15z" />
                </svg>
              </NavLink>
            </li>
            <li className="item nav-link" title={_t('KYC', 'NAV.KYC')}>
              <NavLink to="/kyc" activeClassName="active">
                <i className="fas fa-user-alt" />
                account
              </NavLink>
            </li>
            <li className="item nav-link" title={_t('Settings', 'NAV.SETTINGS')}>
              <NavLink to="/settings" activeClassName="active">
                <i className="fas fa-cog" />
                settings
              </NavLink>
            </li>
          </ul>
        </nav>
      </Fragment>
    );
  }
}



const mapStateToProps = ({ user, siteTheme }) => ({
  user,
  siteTheme
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  setTheme: theme => dispatch(setTheme(theme))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(StandardUiMobileNav),
);
