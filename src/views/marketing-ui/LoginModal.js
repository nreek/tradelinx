import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';

// Redux
import { connect } from 'react-redux';
import { authNone, login as loginAction } from '../../actions';
import {
  authError as errorTypes,
  authStatus as statusTypes,
  selectUserAuthError,
  selectUserAuthStatus,
  selectPasswordResetRequestStatus,
} from '../../reducers';
import { status } from '../../constants'

// Components
import Form from '../../elements/form-controls/Form';
import Modal from '../../elements/Modal';
import TextInput from '../../elements/form-controls/TextInput';
import Submit from '../../elements/form-controls/Submit';
import ResetPasswordRequest from './ResetPasswordRequest';

// Utils
import ConnectionError from '../../util/connectionError';
import Spinner from '../../elements/Spinner';

const propTypes = {
  onClose: PropTypes.func,
  login: PropTypes.func,
};

const pending = 'PENDING';

export class LoginModal extends Component {
  state = {
    formFields: { username: '', password: '', verificationCode: '', confirmationCode: '' },
    resetPassword: false,
  };

  formChangeHandler = name => (e) => {
    const { value } = e.target;
    this.setState((prevState) => {
      const formFields = { ...prevState.formFields, [name]: value };
      return { formFields };
    });
  };

  submit = (e) => {
    const { formFields } = this.state;
    const { login } = this.props;
    login(
      formFields.username,
      formFields.password,
      formFields.verificationCode,
      formFields.confirmationCode,
    );
  };

  instructNone = () => (<div key="0" className="form-instructions" />);

  instructInvalidCredentials = () => (
    <div key="0" className="form-instructions">
      <div className="error">
        {_t('Incorrect username or password.', 'LOGIN.ERROR_INVALID_CREDENTIALS')}
      </div>
    </div>
  );

  instructInvalidVerification = () => (
    <div key="0" className="form-instructions">
      {_t(
        'Enter the verification code from Google Authenticator to continue logging in.',
        'LOGIN.VERIFICATION_CODE_INSTRUCTIONS',
      )}
      <div className="error">
        {_t(
          'Invalid verification code. Check code and try again.',
          'LOGIN.ERROR_INVALID_VERIFICATION_CODE',
        )}
      </div>
    </div>
  );

  instructVerificationRequired = () => (
    <div key="0" className="form-instructions">
      {_t(
        'Enter verification code from Google Authenticator to continue logging in.',
        'LOGIN.VERIFICATION_CODE_INSTRUCTIONS',
      )}
    </div>
  );

  instructConnectionError = () => (
    <div key="0" className="form-instructions">
      {_t(
        'Something went wrong. We\'re working on solving the problem. Please, try again later.',
        'LOGIN.CONNECTION_ERROR',
      )}
    </div>
  );

  instructInvalidConfirmationCode = () => (
    <div key="0" className="form-instructions">
      {_t(
        'Enter the confirmation code that was sent to your email address.',
        'LOGIN.CONFIRMATION_CODE_INSTRUCTIONS',
      )}
    </div>
  );

  getLoginForm = error => (
    <div key="1" className="login-form">
      <TextInput
        className={error ? 'error' : ''}
        name="Email"
        onChange={this.formChangeHandler('username')}
        value={this.state.formFields.username}
        translation={_t('Email', 'MARKETING.EMAIL')}
        placeholder="Email"
      />
      <TextInput
        className={error ? 'error' : ''}
        name="Password"
        hideInput
        onChange={this.formChangeHandler('password')}
        value={this.state.formFields.password}
        translation={_t('Password', 'MARKETING.PASSWORD')}
        placeholder="Password"
      />
    </div>
  );

  getVerificationForm = error => (
    <div key="1" className="verification-code-form">
      <TextInput
        placeholder="Verification Code"
        className={error ? 'error' : ''}
        name="Verification Code"
        onChange={this.formChangeHandler('verificationCode')}
        value={this.state.formFields.verificationCode}
        translation={_t('Verification Code', 'MARKETING.VERIFICATION_CODE')}
      />
    </div>
  );

  getConfirmationCodeForm = error => (
    <div key="3" className="verification-code-form">
      <TextInput
        className={error ? 'error' : ''}
        name="Confirmation Code"
        onChange={this.formChangeHandler('confirmationCode')}
        value={this.state.formFields.confirmationCode}
        translation={_t('Confirmation Code', 'MARKETING.CONFIRMATION_CODE')}
      />
    </div>
  );

  getForgotPasswordLink = () => (
    <div key="2" className="form-message">
      <p className="forgot-password">{_t('Forgot your password?', 'LOGIN.RESET_PASSWORD_MSG')}</p>
      <p>
          <span className="link" onClick={() => this.setState({resetPassword: true})}>
            {_t('Click here to reset.', 'LOGIN.RESET_PASSWORD')}
          </span>
      </p>
    </div>
  );

  // TODO: translation keys:
  renderForm = (authStatus, authError) => {
    if (authStatus === statusTypes.none || authStatus === statusTypes.pending) {
      return ([this.instructNone(), this.getLoginForm(false)]);
    }

    if (authStatus === statusTypes.failed) {
      if (authError.error === errorTypes.invalidCredentials) {
        return ([
          this.instructInvalidCredentials(),
          this.getLoginForm(true),
        ]);
      }

      if (authError.error === errorTypes.verificationCode) {
        return ([
          this.instructVerificationRequired(),
          this.getVerificationForm(true),
        ]);
      }

      if (authError.error === errorTypes.invalidVerificationCode) {
        return ([
          this.instructInvalidVerification(),
          this.getVerificationForm(true),
        ]);
      }

      if (authError.name && authError.name === ConnectionError.name) {
        return ([
          this.instructConnectionError(),
          this.getLoginForm(true),
        ]);
      }

      if (
        authError.error === errorTypes.confirmationCode
        || authError.error === errorTypes.invalidConfirmationCode
      ) {
        return ([
          this.instructInvalidConfirmationCode(),
          this.getConfirmationCodeForm(true),
        ]);
      }
    }
    return undefined;
  };

  renderLoader = () => this.props.authStatus === pending
    ? <Spinner />
    : null;

  render() {
    const { authStatus, authNone, authError, passwordResetRequestStatus } = this.props;
    const { formFields, resetPassword } = this.state;
    if (authStatus === statusTypes.success) {
      return <Redirect to="/home" />;
    }

    return (
      <div className="login-modal">
        { this.renderLoader() }
        <Modal className="marketing-modal">
          {passwordResetRequestStatus === status.verify || resetPassword
            ? (<ResetPasswordRequest />)
            : (
              <Form onSubmit={this.submit}>
                {this.renderForm(authStatus, authError)}
                {this.getForgotPasswordLink()}
                <Submit
                  onSubmit={this.submit}
                  value="LOGIN"
                  formValid={formFields.username && formFields.password}
                />
              </Form>
            )}
        </Modal>
        <Link to="/home" onClick={() => { authNone(); }}>
          <img src="/images/icons/xThin.svg" className="xIcon" />
        </Link>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authStatus: selectUserAuthStatus(state),
  authError: selectUserAuthError(state),
  passwordResetRequestStatus: selectPasswordResetRequestStatus(state),
  state,
});

const mapDispatchToProps = dispatch => ({
  authNone: () => dispatch(authNone()),
  login: (user, pass, verificationCode, confirmationCode) => dispatch(loginAction(user, pass, verificationCode, confirmationCode)),
});

LoginModal.propTypes = propTypes;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginModal);
