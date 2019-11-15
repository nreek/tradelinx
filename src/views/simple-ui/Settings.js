import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { loadUserSettings, getUserProfile, kycRequestStatus, getKycStatus } from '../../actions';

// Components
import AccountInformation from './settings/AccountInformation';
import SecuritySettings from './settings/SecuritySettings';
import SimpleUiWrapper from './SimpleUiWrapper';
import Spinner from '../../elements/Spinner';
import FormContainer from '../../elements/FormContainer';
import ErrorBoundary from '../../elements/ErrorBoundary';


export class Settings extends PureComponent {
  t = 'SETTINGS'; // Translation

  componentDidMount() {
    this.props.loadUserSettings();
    this.props.getUserProfile();
    this.props.getKycStatus();
    this.props.kycRequestStatus();
  }

  // TODO: Move Password reset into its own component
  renderContent = () => (
    <div>
      <ErrorBoundary>
        <AccountInformation translation={this.t} />
      </ErrorBoundary>
      <ErrorBoundary>
        <SecuritySettings translation={this.t} />
      </ErrorBoundary>
    </div>
  );

  // TODO: Account Verification
  render() {
    return (
      <SimpleUiWrapper
        title="Settings"
        pageHeader="Update Account Information"
        description="By keeping your account information up to date you allow us to provide the prompt and high quality service you deserve. Your changes will be effective immediately."
        pageClass="settings"
      >
        {this.props.settings.status === 'success' ? (
          this.renderContent()
        ) : (
          <div className="loader-container">
            <div className="loader">
              <Spinner />
            </div>
          </div>
        )}
      </SimpleUiWrapper>
    );
  }
}

const mapStateToProps = state => ({
  settings: state.settings,
});

const mapDispatchToProps = dispatch => ({
  loadUserSettings: () => dispatch(loadUserSettings()),
  getUserProfile: () => dispatch(getUserProfile()),
  kycRequestStatus: () => dispatch(kycRequestStatus()),
  getKycStatus: () => dispatch(getKycStatus()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);
