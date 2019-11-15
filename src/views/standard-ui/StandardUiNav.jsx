import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { logout, setTheme } from '../../actions';

import companyLogo from '../../../images/logos/company-logo-small-alt.png';

export class StandardUiNav extends PureComponent {
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
      <nav className='standard-ui-nav'>
        <div className='logo-container'>
          <Link to="/home">
            <img src={companyLogo} />
          </Link>
        </div>
        <ul className="nav-links">
          <li className="item nav-link" title={_t('Home', 'NAV.HOME')}>
            <NavLink to="/home" activeClassName='active'>
              <i className="fas fa-th-large"/>
            </NavLink>
          </li>
          <li className="item nav-link" title={_t('Trade', 'NAV.TRADE')}>
            <NavLink to="/trade" activeClassName='active'>
              <i className="fas fa-exchange" />
            </NavLink>
          </li>
          <li className="item nav-link" title={_t('Wallet', 'NAV.WALLET')}>
            <NavLink to="/wallet" activeClassName='active'>
              <i className="fas fa-wallet" />
            </NavLink>
          </li>
          <li className="item nav-link" title={_t('KYC', 'NAV.KYC')}>
            <NavLink to="/kyc" activeClassName='active'>
              <i className="fas fa-user-alt" />
            </NavLink>
          </li>
          <li className="item nav-link" title={_t('Settings', 'NAV.SETTINGS')}>
            <NavLink to="/settings" activeClassName='active'>
              <i className="fas fa-cog" />
            </NavLink>
          </li>
          <li className="item nav-link" title={_t('Toggle Theme', 'NAV.TOGGLE_THEME')}>
            <a onClick={this.toggleTheme}>
              {this.props.siteTheme === 'light' ?
                <i className="fal fa-toggle-off" />
              :
                <i className="fal fa-toggle-on" />
              }
            </a>
          </li>
          <li className="item nav-link" title={_t('Log Out', 'NAV.LOGOUT')}>
            <a onClick={this.onLogout}>
              <i className="fas fa-sign-out-alt" />
            </a>
          </li>
        </ul>
      </nav>
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
  )(StandardUiNav),
);
