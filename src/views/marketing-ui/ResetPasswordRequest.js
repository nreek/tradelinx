import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { resetPasswordFields, changePasswordWithCodeFields } from '../../../config/formConfig';

// Redux
import { passwordResetRequest, changePasswordWithCode } from '../../actions';
import { selectPasswordResetRequestStatus } from '../../reducers';
import { status } from '../../constants/statuses';

// Components
import FormContainer from '../../elements/FormContainer';

class ResetPasswordRequest extends Component {
  state = {
    isSubmitted: false,
    username: '',
  }

  submit = (data) => {
    this.setState({ username: data.email, isSubmitted: true });
    this.props.passwordResetRequest(data.email);
  };

  submitChangePasswordWithCode = (passwordData) => {
    if (passwordData.newPassword === passwordData.confirmPassword) {
      const { username } = this.state;
      this.setState({ passwordData }, () => {
        const passwordPayload = {
          username: username || this.props.username,
          code: passwordData.code,
          password: passwordData.newPassword,
          new_password: passwordData.confirmPassword,
        };

        this.props.changePasswordWithCode(passwordPayload);
      });
    }
  }

  renderForm = () => (
    <Fragment>
      <p className="password-reset-input-instructions">
        {_t(
          'Enter the email as associated with your account to receive a password reset link.',
          'RESET_PASSWORD.MSG',
        )}
      </p>
      <FormContainer
        fields={resetPasswordFields}
        onSubmit={this.submit}
        className="signup-code"
        submitText={_t('Submit', 'RESET_PASSWORD.LOGIN_RESET_PASSWORD_BTN')}
        translation="RESET_PASSWORD"
      />
    </Fragment>
  );

  renderRequestSuccess = () => (
    <Fragment>
      <p>
        {_t(
          'Password reset details have been sent to your email.',
          'RESET_PASSWORD.SUCCESS',
        )}
      </p>
    </Fragment>
  );

  renderRequestFailed = () => (
    <Fragment>
      <p>
        {this.props.passwordResetRequestErrorMessage
        || _t(
          'Something went wrong. Please, try again later.',
          'RESET_PASSWORD.FAILED',
        )
        }
      </p>
    </Fragment>
  );

  renderRequestSuccess = () => {
    if (this.props.passwordResetRequestStatus === status.verify) {
      const { changePasswordWithCodeStatus } = this.props;

      if (changePasswordWithCodeStatus === status.success) {
        return (
          <Fragment>
            <p>{_t(
              'Your password was successfully changed. Please',
              'RESET_PASSWORD.CHANGED_1'
            )}
              <a href="/login">{_t(
                'Login',
                'RESET_PASSWORD.LOGIN'
              )}</a>
            {_t(
              'to continue.',
              'RESET_PASSWORD.CHANGED_2'
            )}
            </p>
          </Fragment>
        );
      }
      return (
        <Fragment>
          <p>
            {_t(
              'A code has been sent to your email. Use the form below to change your password:',
              'RESET_PASSWORD.SUCCESS',
            )}
          </p>
          {this.renderPasswordSubmitForm()}
          {this.renderChangePasswordWithCodeErrors()}
        </Fragment>
      );
    }
    return (
      <Fragment>
        <p>
          {_t(
            'Password reset details have been sent to your email.',
            'RESET_PASSWORD.SUCCESS',
          )}
        </p>
      </Fragment>
    );
  };

  renderPasswordSubmitForm = () => {
    // if (this.props.changePasswordWithCodeStatus === 'NONE') {
    return (
      <Fragment>
        <FormContainer
          allowSubmit={this.state.passwordsMatch}
          className="signup-code"
          fields={changePasswordWithCodeFields}
          onSubmit={this.submitChangePasswordWithCode}
        />
      </Fragment>
    );
    // }
  }

  renderChangePasswordWithCodeErrors = () => {
    const { changePasswordWithCodeStatus, changePasswordWithCodeError } = this.props;
    if (changePasswordWithCodeStatus === status.failed) {
      const errorMessage = changePasswordWithCodeError.message !== null
        ? changePasswordWithCodeError.message : changePasswordWithCodeError;
      return (
        <ul className="form-errors">
          {errorMessage}
        </ul>
      );
    }
    return null;
  }

  renderResetPasswordStatus = () => {
    const { passwordResetRequestStatus } = this.props;
    if (passwordResetRequestStatus === status.success || passwordResetRequestStatus === status.verify) {
      return this.renderRequestSuccess();
    } else if (passwordResetRequestStatus === status.failed) {
      return this.renderRequestFailed();
    }
    return this.renderForm();
  };

  render() {
    const { passwordResetRequestStatus } = this.props;
    
    if (passwordResetRequestStatus === status.verify || this.state.isSubmitted) {
      return this.renderResetPasswordStatus();
    } else {
      return this.renderForm();
    }
  }
}

const mapStateToProps = state => ({
  passwordResetRequestStatus: selectPasswordResetRequestStatus(state),
  passwordResetRequestErrorMessage: state.user.passwordResetRequestErrorMessage,
  changePasswordWithCodeStatus: state.user.changePasswordWithCodeStatus,
  changePasswordWithCodeError: state.user.changePasswordWithCodeError,
});

const mapDispatchToProps = dispatch => ({
  passwordResetRequest: email => dispatch(passwordResetRequest(email)),
  changePasswordWithCode: passwordPayload => dispatch(changePasswordWithCode(passwordPayload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResetPasswordRequest);
