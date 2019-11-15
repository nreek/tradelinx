import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { loadUserSettings, getUserProfile } from '../../actions';

// React Components
import StandardUiWrapper from './StandardUiWrapper';
import { mobileSetting } from '../../reducers/displayMobile';
import ProfileSettings from './settings/ProfileSettings';
import Notifications from './settings/Notifications';
import Security from './settings/Security';

import ErrorBoundary from '../../elements/ErrorBoundary';

class StandardSettings extends Component {
  state = {
    options: [
      { key: 'Profile Settings', component: <ProfileSettings /> },
     /* { key: 'Notifications', component: <Notifications /> },*/
      { key: 'Security', component: <Security /> },
    ],
    currentOption: 'Profile Settings',
  };

  componentDidMount() {
    this.props.loadUserSettings();
    this.props.getUserProfile();
  }

  handleClick = (event) => {
    const { currentOption } = this.state;
    if (currentOption !== event.target.textContent) {
      this.setState({
        currentOption: event.target.textContent,
      });
    }
  };

  renderNav = () => {
    const { options, currentOption } = this.state;
    return options.map((option, i) => (
      <div
        key={i}
        onClick={() => this.handleClick(event)}
        className={currentOption === option.key ? 'nav-item block active' : 'nav-item block'}
      >
        <div>{option.key}</div>
      </div>
    ));
  };

  renderOption = () => {
    const { options, currentOption } = this.state;
    return options.map((option, i) => (currentOption === option.key ? option.component : null));
  };

  renderMobile = () => (
    <StandardUiWrapper title="Settings" translation="SETTINGS">
      <ErrorBoundary>
        <ProfileSettings />
      </ErrorBoundary>
      <ErrorBoundary>
        <Notifications />
      </ErrorBoundary>
      <ErrorBoundary>
        <Security />
      </ErrorBoundary>
    </StandardUiWrapper>
  );

  renderDesktop = () => (
    <StandardUiWrapper title="Settings" translation="SETTINGS">
      <ErrorBoundary>
        <div className="nav-settigns component">
          <div className="component-header" onClick={this.props.handleClick}>
            <h1>SETTINGS</h1>
          </div>
          {this.renderNav()}
        </div>
      </ErrorBoundary>
      <ErrorBoundary>{this.renderOption()}</ErrorBoundary>
    </StandardUiWrapper>
  );

  render() {
    const { options, currentOption } = this.state;
    return this.props.displayMobile ? this.renderMobile() : this.renderDesktop();
  }
}

const mapStateToProps = state => ({
  settings: state.settings,
  displayMobile: mobileSetting(state),
});

const mapDispatchToProps = dispatch => ({
  loadUserSettings: () => dispatch(loadUserSettings()),
  getUserProfile: () => dispatch(getUserProfile()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StandardSettings);
