import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import enhanceWithClickOutside from 'react-click-outside';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Notification from './sidebar/Notification';

import { logout } from '../../actions';

import { notificationBuilder } from '../../util/dummy-data-generators'; // TODO: Remove when we're getting notifications from somewhere
const notifications = notificationBuilder(12); // TODO: Remove when we're getting notifications from somewhere

class StandardUiSidebar extends Component {
  handleClickOutside = () => this.props.showSidebar && this.props.toggleSidebar();

  onLogout = () => {
    this.props.logout();
    this.props.history.push('/');
  };

  renderNotifications = () => {
    return notifications.map((notification, index) => (
      <Notification notification={notification} key={index} />
    ))
  }

  render() {
    const { showSidebar, toggleSidebar, username } = this.props;

    return (
      <aside className={`standard-ui-sidebar ${showSidebar ? 'open' : ''}`}>
        <div className='sidebar-header'>
          <h1 className='sidebar-username' onClick={toggleSidebar}>
            {username}
          </h1>
          <i className='fas fa-user-circle sidebar-profile-picture' />
          <button className='button sidebar-logout-button' onClick={this.onLogout}>
            {_t('Sign Out', 'SIDEBAR.LOGOUT')}
          </button>
        </div>
        <PerfectScrollbar>
          <div className='notifications-container'>
            {this.renderNotifications()}
          </div>
        </PerfectScrollbar>
      </aside>
    )
  }
}

StandardUiSidebar = enhanceWithClickOutside(StandardUiSidebar);

const mapStateToProps = state => ({
  username: state.user.username,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StandardUiSidebar);