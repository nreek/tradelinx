import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getEmail } from '../../../reducers/user';
import { getUploadedFile } from '../../../reducers/defaultFileUpload';
import { selectBaseCurrency } from '../../../reducers';
import FileUploadButton from '../../../elements/form-controls/FileUploadButton';
import { defaultUploadFile } from '../../../actions';

class ProfileSettings extends Component {
  uploadFile = (e) => {
    this.props.defaultUploadFile(e.target.value);
  };

  render() {
    const {
      email, exchangeBaseCurrency, defaultUploadFile, test,
    } = this.props;

    return (
      <div className="profile-settings component">
        <div className="component-header">
          <h1>{_t('Profile Settings', 'SETTINGS_PROFILE.TITLE')}</h1>
        </div>
        <div className="component-content profile-content">
          <section className="profile-pic">
            <img
              className="document-icon"
              src='../../../../images/PROPIC.jpg'
            />
          <h2>{_t('Change Profile Picture', 'SETTINGS_PROFILE.CHANGE_PIC')}</h2>
            <p>
              {_t('Max File Size is 10 MB', 'SETTINGS_PROFILE.MAX_FILE_SIZE', {
                maxFileSize: '10 MB',
              })}
            </p>
            <div className="document-upload">
              <FileUploadButton
                translation="PROFILE_PIC"
                name=""
                onFileAccepted={e => this.uploadFile(e)}
              />
            </div>
          </section>
          <div className="display-name-container">
            <label>{_t('Email', 'SETTINGS_PROFILE.EMAIL_INPUT')}</label>
            <input disabled placeholder={email || ''} />
          </div>
          <div className="display-name-container">
            <label>{_t('Time Zone', 'SETTINGS_PROFILE.TIME_ZONE_INPUT')}</label>
            <input disabled placeholder="(GMT - 05:00) Eastern Time (US and Canada)" />
          </div>
          <div className="local-currency-container">
            <label>{_t('Local Currency', 'SETTINGS_PROFILE.LOCAL_CURRENCY')}</label>
            <input disabled placeholder={exchangeBaseCurrency || ''} />
            <button className="save">{_t('Save', 'SETTINGS_PROFILE.SAVE_BUTTON')}</button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  email: getEmail(state),
  exchangeBaseCurrency: selectBaseCurrency(state),
  profilePic: getUploadedFile(state),
  test: state.defaultFileUpload,
});

const mapDispatchToProps = dispatch => ({
  defaultUploadFile: file => dispatch(defaultUploadFile(file)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileSettings);
