import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

// Redux
import { updateUserProfile, defaultUploadFile, getFile, getKycStatus } from '../../../actions';
import { selectKycStatus, selectUserProfile } from '../../../reducers/user';
import { status } from '../../../constants/statuses';
import { selectDefaultFileUploadStatus, selectFile, selectConfig } from '../../../reducers';

// React components
import DocumentDownload from './document-verification/DocumentDownload';
import FileUploadButton from '../../../elements/form-controls/FileUploadButton';

// Helper functions
import { toAllCaps, toCamelCase, capitalize } from '../../../util/helpers';

class DocumentVerification extends Component {
  iconMap = {
    photoId: <i className="fas fa-id-card" />
  }

  componentDidUpdate(prevProps) {
    const { userProfile, selectDefaultFileUploadStatus } = this.props;

    if (
      prevProps.userProfile
      && prevProps.userProfile.status !== userProfile.status
      && userProfile.status === status.success
      && userProfile.document
    ) {
      this.props.getFile(userProfile.document);
      this.props.getKycStatus();
    }

    // Checks if file upload was successful, so it can trigger profile update.
    if (
      prevProps.selectDefaultFileUploadStatus
      && selectDefaultFileUploadStatus
      && prevProps.selectDefaultFileUploadStatus.status === status.pending
      && selectDefaultFileUploadStatus.status === status.success
    ) {
      this.submitUpdatedUserProfile(selectDefaultFileUploadStatus.filename);
    }
  }

  submitUpdatedUserProfile = (uploadedFilename = '') => {
    const { userProfile } = this.props;
    const profile = {
      country: userProfile.country || '',
      street_address: userProfile.street_address || '',
      city: userProfile.city || '',
      date_of_birth: userProfile.date_of_birth || null,
      surname: userProfile.surname || '',
      phone_number: userProfile.phone_number || '',
      state_province: userProfile.state_province || '',
      given_name: userProfile.given_name || '',
      middle_name: userProfile.middle_name || '',
      postal_code: userProfile.postal_code || '',
      document: uploadedFilename,
    };
    const payload = {
      custom_profile: JSON.stringify(profile),
    };
    this.props.updateUserProfile(payload);
  }

  uploadFile = (e) => {
    this.props.defaultUploadFile(e.target.value);
  }

  renderDocumentUploads = () => {
    const { userProfile, kycStatus, file } = this.props;
    return this.props.config.documentUploads.map((document, index) => {
      const { name } = document;
      const icon = this.iconMap[toCamelCase(name)];
      return (
        <section className='document-upload-section' key={index}>
          <div className='document-icon'>
            {icon}
          </div>
          <h2>{_t(name, `KYC_DOCUMENTS.${toAllCaps(name)}`)}</h2>
          <p>{_t('Max File Size is 10 MB', 'KYC_DOCUMENTS.MAX_FILE_SIZE', { maxFileSize: '10 MB' })}</p>
          <div className='document-upload'>
            {userProfile && userProfile.status !== status.pending && !userProfile.document ?
              <FileUploadButton 
                translation='KYC_DOCUMENTS' 
                name='' 
                onFileAccepted={(e) => this.uploadFile(e)} 
              />
            : kycStatus && file.value ?
              <Fragment>
                {kycStatus.status === 'succeeded' && <i className='far fa-check' />}
                <h4>{kycStatus.status}</h4>
                <DocumentDownload 
                  file={file}
                />
              </Fragment>
            : null}
          </div>
        </section>
      )
    })
  }

  render() {
    return (
      <div className='document-verification component'>
        <div className='component-header'>
          <h1>{_t('Document Verification', 'KYC_DOCUMENTS.TITLE')}</h1>
        </div>
        <div className='component-content'>
          {this.props.userProfile && this.renderDocumentUploads()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  kycStatus: selectKycStatus(state),
  userProfile: selectUserProfile(state),
  selectDefaultFileUploadStatus: selectDefaultFileUploadStatus(state),
  file: selectFile(state),
  config: selectConfig(state),
});

const mapDispatchToProps = dispatch => ({
  updateUserProfile: documentsPayload => dispatch(updateUserProfile(documentsPayload)),
  defaultUploadFile: file => dispatch(defaultUploadFile(file)),
  getFile: accessor => dispatch(getFile(accessor)),
  getKycStatus: () => dispatch(getKycStatus()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DocumentVerification);