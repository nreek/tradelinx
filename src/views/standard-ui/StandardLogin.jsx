import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

// Redux
import { connect } from 'react-redux';
import { authNone, login as loginAction } from '../../actions';
import { mobileSetting } from '../../reducers/displayMobile';
import {
  authError as errorTypes,
  authStatus as statusTypes,
  selectUserAuthError,
  selectUserAuthStatus,
} from '../../reducers/user';

// Components
import Form from '../../elements/form-controls/Form';
import Submit from '../../elements/form-controls/Submit';
import TextInput from '../../elements/form-controls/TextInput';
import StandardRequestPassword from './StandardRequestPassword';

// Utils
import ConnectionError from '../../util/connectionError';
import Spinner from '../../elements/Spinner';

const propTypes = {
  onClose: PropTypes.func,
  login: PropTypes.func,
};

const pending = 'PENDING';

export class StandardLogin extends Component {
  state = {
    formFields: {
      username: '', password: '', verificationCode: '', confirmationCode: '',
    },
    resetPassword: false,
  };

  formChangeHandler = name => (e) => {
    const { value } = e.target;
    this.setState((prevState) => {
      const formFields = { ...prevState.formFields, [name]: value };
      return { formFields };
    });
  };

  toggleResetPassword = () => this.setState({ resetPassword: !this.state.resetPassword });

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

  instructNone = () => <div key="0" className="form-instructions" />;

  instructInvalidCredentials = () => (
    <div key="0" className="form-instructions">
      <div className="error">
        {_t('Incorrect username or password.', 'LOGIN.ERROR_INVALID_CREDENTIALS')}
      </div>
    </div>
  );

  instructInvalidVerification = () => (
    <div key="0" className="form-instructions">
      <p>
        {_t(
          'Enter the verification code from Google Authenticator to continue logging in.',
          'LOGIN.VERIFICATION_CODE_INSTRUCTIONS',
        )}
      </p>
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
      <p>
        {_t(
          'Enter verification code from Google Authenticator to continue logging in.',
          'LOGIN.VERIFICATION_CODE_INSTRUCTIONS',
        )}
      </p>
    </div>
  );

  instructConnectionError = () => (
    <div key="0" className="form-instructions">
      {_t(
        "Something went wrong. We're working on solving the problem. Please try again later.",
        'LOGIN.ERROR_CONNECTION',
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
        className={`email ${error ? 'error' : ''}`}
        name="Email"
        onChange={this.formChangeHandler('username')}
        value={this.state.formFields.username}
        translation={_t('Email', 'LOGIN.EMAIL')}
        placeholder="Email"
      />
      <TextInput
        className={`password ${error ? 'error' : ''}`}
        name="Password"
        hideInput
        onChange={this.formChangeHandler('password')}
        value={this.state.formFields.password}
        translation={_t('Password', 'LOGIN.PASSWORD')}
        placeholder="Password"
      />
    </div>
  );

  getVerificationForm = error => (
    <div key="1" className="verification-code-form">
      <TextInput
        placeholder="Verification Code"
        className={`verification-code ${error ? 'error' : ''}`}
        name="Verification Code"
        onChange={this.formChangeHandler('verificationCode')}
        value={this.state.formFields.verificationCode}
        translation={_t('Verification Code', 'LOGIN.VERIFICATION_CODE')}
      />
    </div>
  );

  getConfirmationCodeForm = error => (
    <div key="3" className="confirmation-code-form">
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
      <p>
        <span className="link" onClick={() => this.setState({ resetPassword: true })}>
          {_t('Forgot Password?', 'LOGIN.RESET_PASSWORD_MSG')}
        </span>
      </p>
    </div>
  );

  // TODO: translation keys:
  renderForm = (authStatus, authError) => {
    if (authStatus === statusTypes.none || authStatus === statusTypes.pending) {
      return [this.instructNone(), this.getLoginForm(false)];
    }

    if (authStatus === statusTypes.failed) {
      if (authError.error === errorTypes.invalidCredentials) {
        return [
          this.instructInvalidCredentials(),
          this.getLoginForm(true),
          this.getForgotPasswordLink(),
        ];
      }

      if (authError.error === errorTypes.verificationCode) {
        return [this.instructVerificationRequired(), this.getVerificationForm(true)];
      }

      if (authError.error === errorTypes.invalidVerificationCode) {
        return [this.instructInvalidVerification(), this.getVerificationForm(true)];
      }

      if (authError.name && authError.name === ConnectionError.name) {
        return [this.instructConnectionError(), this.getLoginForm(true)];
      }

      if (
        authError.error === errorTypes.confirmationCode
        || authError.error === errorTypes.invalidConfirmationCode
      ) {
        return [this.instructInvalidConfirmationCode(), this.getConfirmationCodeForm(true)];
      }
    }
    return undefined;
  };

  renderLoader = () => (this.props.authStatus === pending ? <Spinner /> : null);

  render() {
    const {
      authStatus, authNone, authError, passwordResetRequestStatus,
    } = this.props;
    const { formFields, resetPassword } = this.state;

    if (authStatus === statusTypes.success) {
      return <Redirect to="/home" />;
    }

    return (
      <CSSTransition in appear timeout={500} classNames="fade">
        <div className="login-container">
          <div className="login-ui">
            <img className="logo" src="./images/logos/company-logo.png" />
            {this.renderLoader()}
            {resetPassword ? ( // || passwordResetRequestStatus === status.verify
              <StandardRequestPassword />
            ) : (
              <Form onSubmit={this.submit}>
                {this.renderForm(authStatus, authError)}
                <Submit
                  onSubmit={this.submit}
                  value="Login"
                  formValid={formFields.username && formFields.password}
                />
              </Form>
            )}
            <div className="links-container">
              <Link to="/signup" className="sign-up-link">
                {_t('Sign Up', 'LOGIN.SIGN_UP')}
              </Link>
              <a className="reset-password-link" onClick={this.toggleResetPassword}>
                {!resetPassword
                  ? _t('Forgot Password?', 'LOGIN.RESET_PASSWORD_MSG')
                  : _t('Log In', 'LOGIN.LOG_IN')}
              </a>
            </div>
            <Link
              to="/home"
              onClick={() => {
                authNone();
              }}
            >
              {this.props.displayMobile ? (
                <img src="/images/icons/xThinBlack.svg" className="xIcon" />
              ) : (
                <img src="/images/icons/xThin.svg" className="xIcon" />
              )}
            </Link>
          </div>
          <div className="login-banner" />
        </div>
      </CSSTransition>
    );
  }
}

const mapStateToProps = state => ({
  authStatus: selectUserAuthStatus(state),
  authError: selectUserAuthError(state),
  displayMobile: mobileSetting(state),
  passwordResetRequestStatus: state.user.passwordResetRequestStatus,
  state,
});

const mapDispatchToProps = dispatch => ({
  authNone: () => dispatch(authNone()),
  login: (user, pass, verificationCode, confirmationCode) => dispatch(loginAction(user, pass, verificationCode, confirmationCode)),
});

StandardLogin.propTypes = propTypes;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StandardLogin);
