import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { changePassword } from '../../../../config/formConfig';
// REDUX
import { newPassword, newPasswordFailed, newPasswordPending, newPasswordNone } from '../../../actions';
import { selectPasswordStatus } from '../../../reducers';
//
import FormContainer from '../../../elements/FormContainer';
import FileUploadButton from '../../../elements/form-controls/FileUploadButton';
import SecuritySettings from '../settings/SecuritySettings';
import PhoneNumber from '../settings/PhoneNumber';
import ErrorBoundary from '../../../elements/ErrorBoundary';

class Security extends Component {
  state = {
    formState: {},
    passwordData: null,
    passwordsMatch: false,
    setValue: null,
  };

  changePassword = (id) => {
    if (id != 'NONE') {
      this.props.newPasswordPending();
    } else {
      this.props.newPasswordNone();
    }
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.newPasswordStatus !== this.props.newPasswordStatus) {
    }
  };

  submit = (passwordData) => {
    if (passwordData.newPassword === passwordData.confirmPassword) {
      this.setState(
        {
          passwordData,
          setValue: {
            'Confirm Password': '',
            'New Password': '',
            'Old Password': '',
          },
        },
        () => {
          const passwordPayload = {
            password: passwordData.newPassword,
            new_password: passwordData.confirmPassword,
            old_password: passwordData.oldPassword,
          };
          this.props.newPassword(passwordPayload);
        },
      );
    }
  };

  onFormChange = (formState) => {
    this.setState({ formState }, () => {
      if (
        this.passwordConfirmed(formState['New Password'].value, formState['Confirm Password'].value)
      ) {
        this.setState({ passwordsMatch: true });
      } else {
        this.setState({ passwordsMatch: false });
      }
    });
  };

  passwordConfirmed = (password, confirmPassword) => password === confirmPassword;

  renderFormErrors = () => {
    const { passwordsMatch, formState } = this.state;
    const { newPasswordStatus } = this.props;
    const confirmPW = 'Confirm Password';

    return (
      <ul className="form-errors">
        {!passwordsMatch && formState[confirmPW] && formState[confirmPW].active &&
          <li className="passwords-not-matching">
            {_t(
              'Passwords do not match, confirm both passwords are identical.',
              'SETTINGS.ERROR_PASSWORDS_NOT_MATCHING',
            )}
          </li>
        }
        {newPasswordStatus === 'FAILED' &&
          <li className="wrong-old-password">
            {_t(
              'Wrong old password.',
              'SETTINGS.ERROR_WRONG_OLD_PASSWORD',
            )}
          </li>
        }
      </ul>
    );
  };

  renderInputs = () => (
    <Fragment>
      <FormContainer
        allowSubmit={this.state.passwordsMatch}
        className="change-password"
        fields={changePassword}
        onChange={this.onFormChange}
        onSubmit={this.submit}
        setValue={this.state.setValue}
      />
      {this.renderFormErrors()}
    </Fragment>
  );

  render() {
    return (
      <div className="security-settings component">
        <div className="component-header">
          <h1>{_t('Security', 'SETTINGS_SECURITY.TITLE')}</h1>
        </div>
        <div className="component-content security-content">
          <section className="phone-number">
            <h2>{_t('Phone number', 'SETTINGS_SECURITY.PHONE_NUMBER')}</h2>
            <ErrorBoundary>
              <PhoneNumber />
            </ErrorBoundary>
          </section>
          <section className="two-fa">
            <h2>{_t('2-step Verification', 'SETTINGS_SECURITY.TWO_FA')}</h2>
            <ErrorBoundary>
              <SecuritySettings translation="SETTINGS" />
            </ErrorBoundary>
          </section>
          <section className="password-reset">
            <h2>{_t('Change password', 'SETTINGS_SECURITY.CHANGE_PASSWORD')}</h2>
            {this.renderInputs()}
          </section>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  newPasswordStatus: selectPasswordStatus(state),
});

const mapDispatchToProps = dispatch => ({
  newPassword: passwordPayload => dispatch(newPassword(passwordPayload)),
  newPasswordPending: () => dispatch(newPasswordPending()),
  newPasswordFailed: () => dispatch(newPasswordFailed()),
  newPasswordNone: () => dispatch(newPasswordNone()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Security);
