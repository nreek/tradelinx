/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { initalSchema } from '../../../../config/formConfig';

// Redux
import { updateUserProfile, defaultUploadFile, getFile } from '../../../actions';
import { status } from '../../../constants/statuses'; 
import {
  selectKycStatus,
  selectUserProfile,
  selectDefaultFileUploadStatus,
  selectFile
} from '../../../reducers';

// Components
import DocumentDownload from './DocumentDownload';
import FormContainer from '../../../elements/FormContainer';
import Spinner from '../../../elements/Spinner';

class VerifyModal extends Component {
  state = {
    kycFormData: null,
    ageValidation: true,
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.userProfile
      && prevProps.userProfile.status !== this.props.userProfile.status
      && this.props.userProfile.status === status.success
      && this.props.userProfile.document
    ) {
      this.props.getFile(this.props.userProfile.document);
    }

    // Checks if file upload was successfull, so it can trigger profile update.
    if (
      prevProps.selectDefaultFileUploadStatus
      && this.props.selectDefaultFileUploadStatus
      && prevProps.selectDefaultFileUploadStatus.status === status.pending
      && this.props.selectDefaultFileUploadStatus.status === status.success
    ) {
      this.submitUpdatedUserProfile(this.props.selectDefaultFileUploadStatus.filename);
    }
  }

  submitUpdatedUserProfile = (uploadedFilename = '') => {
    const { kycFormData } = this.state;
    const date = new Date(kycFormData.dateOfBirth);
    const milliseconds = date.getTime();

    const kycFormDataPayload = {
      custom_profile: JSON.stringify({
        country: kycFormData.country,
        street_address: kycFormData.streetAddress,
        city: kycFormData.city,
        date_of_birth: milliseconds,
        surname: kycFormData.surname,
        phone_number: kycFormData.phoneNumber,
        state_province: kycFormData['state/province'],
        given_name: kycFormData.givenName,
        middle_name: kycFormData.middleName,
        postal_code: kycFormData.postalCode,
        document: uploadedFilename,
      }),
    };
    this.props.updateUserProfile(kycFormDataPayload);
  }

  onSubmit = (kycFormData) => {
    const date = new Date(kycFormData.dateOfBirth);
    const milliseconds = date.getTime();
    const yearsOld = moment().diff(milliseconds, 'years');


    if (yearsOld >= 18) {
      this.setState(
        {
          kycFormData: { ...kycFormData },
          ageValidation: true,
        },
        () => {
          if (kycFormData.document) {
            this.props.defaultUploadFile(kycFormData.document);
          } else {
            this.submitUpdatedUserProfile();
          }
        },
      );
    } else {
      this.setState({
        ageValidation: false,
      });
    }
  };

  renderForm = () => {
    const { userProfile, schema } = this.props;
    const schemaStatus = (schema || {}).status || {};
    const properties = (schema || {}).properties || {};

    let renderedFields = [];

    if (Object.keys(properties).length) {
      renderedFields = [...properties];
    }

    const documentExists = renderedFields.find(field => field.name === 'Document')
      && userProfile.document
      && this.props.file
      && this.props.file.status === status.success;

    // Checks if schema includes document and if it already has a value and remove if it does
    // if (documentExists) {
    //   renderedFields = renderedFields.filter(field => field.name !== 'Document');
    // }

    // {name: "Given name", required: true, type: "text", placeholder: "Francis", writeOnce: true}

    return (
      <div>
        <h2>{_t('Verify Account', 'VERIFY.HEADER')}</h2>
        {(this.props.kycStatus.status === 'rejected' || this.props.kycStatus.status === 'failed')
          && (
          <p className="verify-error">
            {_t(
              'There was an issue with your information and it was declined. Please review your information and submit it again. Contact support at support@shiftmarkets.com for details.',
              'VERIFY.REJECTED',
            )}
          </p>
          )
        }
        <p>
          {_t(
            'Complete the verification steps to raise your limits and enable instant buys.',
            'VERIFY.DESCRIPTION',
          )}
        </p>
        <p>
          {_t(
            'Please complete the following steps to enable deposits, withdrawals, and trading.',
            'VERIFY.INSTRUCTIONS',
          )}
        </p>
        {userProfile
          && userProfile.status === 'SUCCESS'
          && schemaStatus === 'SUCCESS'
          && renderedFields.length ? (
            <FormContainer
              className="kyc-form"
              fields={renderedFields}
              initialValues={initalSchema(userProfile)}
              key="kyc-form"
              onSubmit={this.onSubmit}
              submitText="Submit"
              translation="VERIFY"
              footer={
                documentExists && this.props.file.status === status.success ? (
                  <DocumentDownload fileName={this.props.userProfile.document} />
                ) : null
              }
            />
          ) : (
            <div className="loader-container">
              <div className="loader">
                <Spinner />
              </div>
            </div>
          )}
        <p />
        {this.state.ageValidation == false ? (
          <p className="verify-error">
            {_t('Must be 18 years or older', 'VERIFY.AGE_VALIDATION_MESSAGE')}
          </p>
        ) : null}
      </div>
    );
  };

  renderPending = () => (
    <div className="verfication-pending">
      <h2>{_t('Your Verification is pending.', 'VERIFY.PENDING_HEADING')}</h2>
      <p>
        {_t(
          "Your information has been submitted and is pending verification. We'll update you when verification is complete.",
          'VERIFY.PENDING_ONE',
        )}
      </p>
    </div>
  );

  renderApproved = () => (
    <div className="verfication-pending">
      <h2>{_t('Congratulations! Your account has been fully verified.', 'VERIFY.APPROVED_HEADING')}</h2>
    </div>
  );

  renderError = () => (
    <div className="verfication-pending">
      <h2>
        {_t('An error was encountered please contact customer support', 'VERIFY.ERROR_HEADING')}
      </h2>
    </div>
  );

  renderVerifyStep = () => {
    const verifyStep = {
      form: this.renderForm,
      pending: this.renderPending,
      edit: this.renderEdit,
      approved: this.renderApproved,
      error: this.renderError,
    };

    if (this.props.kycStatus.status === 'not_started'
      || this.props.kycStatus.status === 'rejected'
      || this.props.kycStatus.status === 'failed'
    ) {
      return verifyStep.form();
    }
    if (this.props.kycStatus.status === 'pending'
      || this.props.kycStatus.status_code === 'OK'
      || this.props.kycStatus.status === 'approved'
      || this.props.kycStatus.status === 'in_progress'
    ) {
      return verifyStep.pending();
    }
    if (this.props.kycStatus.status === 'succeeded') {
      return verifyStep.approved();
    }
    return verifyStep.error();
  };

  render() {
    return this.renderVerifyStep();
  }
}

// TODO: refactor userLocation to use selector
const mapStateToProps = state => ({
  userLocation: state.user.location,
  kycStatus: selectKycStatus(state),
  userProfile: selectUserProfile(state),
  schema: state.user.extendedProfileSchema,
  email: state.user.username,
  updateProfileStatus: state.user.updateProfileStatus,
  selectDefaultFileUploadStatus: selectDefaultFileUploadStatus(state),
  file: selectFile(state),
});

const mapDispatchToProps = dispatch => ({
  updateUserProfile: kycFormDataPayload => dispatch(updateUserProfile(kycFormDataPayload)),
  defaultUploadFile: file => dispatch(defaultUploadFile(file)),
  getFile: accessor => dispatch(getFile(accessor)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VerifyModal);
