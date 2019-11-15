import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';

import { logout } from '../../actions';
import Balances from './sidebar/Balances';
import companyLogo from '../../../images/logos/company-logo-alt.png';


export class Sidebar extends PureComponent {
  onLogout = () => {
    this.props.logout();
  };

  render() {
    return (
      <ul className="sidebar">
        <i
          className="far fa-times fa-2x sidebar-icon-close"
          onClick={() => this.props.toggleSidebar()
          }
        />
        <li className="logo-container">
          <NavLink to="/home">
            <img src={companyLogo} />
          </NavLink>
        </li>
        <li className="item nav-link">
          <NavLink to="/home">
            <i className="fas fa-home" />
            {_t('Home', 'SIDEBAR.HOME')}
          </NavLink>
        </li>
        <li className="item nav-link">
          <NavLink to="/buy-sell">
            <i className="fas fa-exchange" />
            {_t('Buy / Sell', 'SIDEBAR.BUY_SELL')}
          </NavLink>
        </li>
        <li className="item nav-link">
          <NavLink to="/my-accounts">
            <i className="fas fa-university" />
            {_t('My Accounts', 'SIDEBAR.MY_ACCOUNTS')}
          </NavLink>
        </li>
        <li className="item nav-link">
          <NavLink to="/trade">
            <i className="fas fa-chart-line" />
            {_t('Pro Trade', 'SIDEBAR.PRO_TRADE')}
          </NavLink>
        </li>
        <li className="item balances-container">
          <Balances />
        </li>
        <li className="item nav-link">
          <NavLink to="/settings">
            <i className="fas fa-cog" />
            {_t('Settings', 'SIDEBAR.SETTINGS')}
          </NavLink>
        </li>
        <li className="item nav-link">
          <NavLink to="/help">
            <i className="fas fa-question-circle" />
            {_t('Help', 'SIDEBAR.HELP')}
          </NavLink>
        </li>
        <li className="item nav-link">
          <a onClick={this.onLogout}>
            <i className="fas fa-sign-out-alt" />
            {' '}
            {_t('Logout', 'SIDEBAR.LOGOUT')}
          </a>
        </li>
      </ul>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Sidebar),
);
