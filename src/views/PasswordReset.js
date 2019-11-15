import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { passwordResetCommit } from '../actions';
import { selectPasswordResetCommitError, selectPasswordResetCommitStatus } from '../reducers';

import { status } from '../constants';

// Components
import Button from '../elements/Button';
import Form from '../elements/form-controls/Form';
import TextInput from '../elements/form-controls/TextInput';

import '../../scss/email-ui.scss';
import logo from '../../images/logos/company-logo-white.png';


// TODO: validations, styling, error handling
class PasswordReset extends Component {
  state = {
    newPassword: '',
    confirmNewPassword: '',
    formValid: false,
    redirect: null,
  };

  submit = () => {
    if (this.state.formValid) {
      // NOTE: temp solution - URL sent by APP API is not encoded (and includes
      // `=` in hash)
      const hash = this.props.location.search.match(/hash=([^&]*)/)[1];
      this.props.passwordResetCommit(hash, this.state.newPassword);
    }
  };

  onChange = name => (e) => {
    this.setState({ [name]: e.target.value }, this.formValidations);
  };

  formValidations = () => {
    if (
      this.state.newPassword.length >= 8
      && this.state.confirmNewPassword.length >= 8
      && this.state.newPassword === this.state.confirmNewPassword
    ) {
      this.setState({ formValid: true });
    } else {
      this.setState({ formValid: false });
    }
  };

  passwordResetForm = () => (
    <Fragment>
      <p className="password-reset-instructions">
        {_t('Enter your new password below.', 'PASSWORD_RESET.INSTRUCTIONS')}
      </p>
      <Form onSubmit={this.submit}>
        <TextInput
          name="New Password"
          onChange={this.onChange('newPassword')}
          value={this.state.newPassword}
          hideInput
        />
        <TextInput
          name="Confirm New Password"
          onChange={this.onChange('confirmNewPassword')}
          value={this.state.confirmNewPassword}
          hideInput
        />
        <div className="action-button">
          <Button
            value="Set Password"
            loading
            loadingStatus={
              this.props.passwordResetCommitStatus === status.pending
            }
            disabled={!this.state.formValid}
            type="submit"
          />
        </div>
      </Form>
    </Fragment>
  );

  renderError = () => {
    if (
      this.props.passwordResetCommitError.message
      === 'Password has already been changed or request is expired.'
    ) {
      return (
        <div>
          <p>
            {_t(
              'Password has already been changed or request is expired.',
              'PASSWORD_RESET.REQUEST_EXPIRED',
            )}
          </p>
        </div>
      );
    }
    return (
      <div>
        <p>
          {_t(
            'Something went wrong, please try again',
            'PASSWORD_RESET.GENERAL_ERROR',
          )}
        </p>
      </div>
    );
  };

  renderSuccess = () => (
    <div className="password-reset-success">
      <p>
        {_t(
          'Your password has been successfully changed.',
          'PASSWORD_RESET.SUCCESS_MSG',
        )}
      </p>
      <div className="action-button">
        <Button onClick={() => this.setState({ redirect: 'login' })}>
          {_t('Login', 'PASSWORD_RESET.LOGIN')}
        </Button>
      </div>
    </div>
  );

  renderPasswordResetStatus = () => {
    if (this.props.passwordResetCommitStatus === status.failed) {
      return (
        <div className="error-container">
          {this.renderError()}
          <div className="action-button">
            <Button onClick={() => this.setState({ redirect: 'login' })}>
              {_t('Login', 'PASSWORD_RESET.LOGIN')}
            </Button>
            <Button onClick={() => this.setState({ redirect: 'home' })}>
              {_t('Close', 'PASSWORD_RESET.CLOSE')}
            </Button>
          </div>
        </div>
      );
    } if (this.props.passwordResetCommitStatus === status.success) {
      return this.renderSuccess();
    }
    return this.passwordResetForm();
  };

  render() {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{ pathname: '/', state: { modal: this.state.redirect } }}
        />
      );
    }

    return (
      <div className="ui-container">
        <div className="ui-child">
          <div className="logo">
            <img src={logo} />
          </div>
          <div className="ui-status">{this.renderPasswordResetStatus()}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  passwordResetCommitStatus: selectPasswordResetCommitStatus(state),
  passwordResetCommitError: selectPasswordResetCommitError(state),
});

const mapDispatchToProps = dispatch => ({
  passwordResetCommit: (hash, newPassword) => dispatch(passwordResetCommit(hash, newPassword)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PasswordReset);
