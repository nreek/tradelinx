import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { getUserProfile } from '../../actions';

// React Components
import StandardUiWrapper from './StandardUiWrapper';

import AccountLevels from './kyc/AccountLevels';
import PersonalDetails from './kyc/PersonalDetails';
import DocumentVerification from './kyc/DocumentVerification';

import ErrorBoundary from '../../elements/ErrorBoundary';

class StandardProfile extends PureComponent {
  componentDidMount() {
    this.props.getUserProfile();
  }

  render() {
    return (
      <StandardUiWrapper title="Profile" translation='PROFILE'>
        <ErrorBoundary>
          <AccountLevels />
        </ErrorBoundary>
        <ErrorBoundary>
          <PersonalDetails />
        </ErrorBoundary>
        <ErrorBoundary>
          <DocumentVerification />
        </ErrorBoundary>
      </StandardUiWrapper>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getUserProfile: () => dispatch(getUserProfile()),
})

export default connect(
  null,
  mapDispatchToProps,
)(StandardProfile);
