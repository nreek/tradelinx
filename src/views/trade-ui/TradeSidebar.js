import React, { Component } from 'react';
import { connect } from 'react-redux';
import enhanceWithClickOutside from 'react-click-outside';
import { NavLink } from 'react-router-dom';

import { logout } from '../../actions';
import Balances from '../simple-ui/sidebar/Balances';


class TradeSidebar extends Component {
  handleClickOutside = () => this.props.showSidebar && this.props.closeSidebar();

  render() {
    return (
      <div className={`sidebar ${this.props.showSidebar ? 'open' : ''}`}>
        <div className="sidebar-header">
          {_t('Options', 'TRADE_SIDEBAR.OPTIONS')}
          <i
            className="far fa-times"
            onClick={() => this.props.closeSidebar()}
          />
        </div>
        <NavLink to="/home" className="sidebar-option">
          <span className="sidebar-icon">
            <i className="fal fa-home" />
          </span>
          {_t('Home', 'SIDEBAR.HOME')}
        </NavLink>
        <NavLink to="/buy-sell" className="sidebar-option">
          <span className="sidebar-icon">
            <i className="fal fa-exchange" />
          </span>
          {_t('Buy / Sell', 'SIDEBAR.BUY_SELL')}
        </NavLink>
        <NavLink to="/my-accounts" className="sidebar-option">
          <span className="sidebar-icon">
            <i className="fal fa-university" />
          </span>
          {_t('My Accounts', 'SIDEBAR.MY_ACCOUNTS')}
        </NavLink>
        <NavLink to="/trade" className="sidebar-option">
          <span className="sidebar-icon">
            <i className="fal fa-chart-line" />
          </span>
          {_t('Pro Trade', 'SIDEBAR.PRO_TRADE')}
        </NavLink>
        <Balances className="sidebar-option" />
        <NavLink to="/settings" className="sidebar-option">
          <span className="sidebar-icon">
            <i className="fal fa-cog" />
          </span>
          {_t('Settings', 'SIDEBAR.SETTINGS')}
        </NavLink>
        <NavLink to="/help" className="sidebar-option">
          <span className="sidebar-icon">
            <i className="fal fa-question-circle" />
          </span>
          {_t('Help', 'SIDEBAR.HELP')}
        </NavLink>
        <a className="sidebar-option" onClick={this.props.logout}>
          <span className="sidebar-icon">
            <i className="fal fa-sign-out-alt" />
          </span>
          {_t('Logout', 'SIDEBAR.LOGOUT')}
        </a>
      </div>
    );
  }
}

TradeSidebar = enhanceWithClickOutside(TradeSidebar);

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TradeSidebar);
