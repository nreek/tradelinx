import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Spinner from '../../elements/Spinner';

// Redux
import { connect } from 'react-redux';
import {
  getProfileSchema,
  signup,
  signupNone,
  resendVerification,
  verifyUser,
} from '../../actions';
import {
  selectSignupError,
  selectSignupStatus,
  selectVerificationStatus,
} from '../../reducers';
import { status } from '../../constants'
// React Components
import FormContainer from '../../elements/FormContainer';
import Modal from '../../elements/Modal';

import { confirmAccountWithCodeFields } from '../../../config/formConfig';

const propTypes = {
  onClose: PropTypes.func,
  onOpenLogin: PropTypes.func,
};

// TODO: Add geo IP lookup
export class SignupModal extends Component {
  state = {
    formState: {},
    signupData: null,
    signupStep: 'form',
    passwordsMatch: false,
  };

  componentDidMount() {
    this.props.getProfileSchema();
  }

  /**
   * @param {String} param
   *
   * @returns {String|Boolean}
   */
  getQueryVariable = (param) => {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i += 1) {
      const pair = vars[i].split('=');
      if (pair[0] === param) {
        return pair[1];
      }
    }
    return false;
  }

  submit = (signupData) => {
    this.setState({ signupData }, () => {
      const { affPrograms } = this.props;
      const signupRequestPayload = {
        email_address: signupData.email,
        password: signupData.password,
      };
      const profile = {
        city: signupData.city,
        country: signupData.country,
        date_of_birth: (new Date(signupData.dateOfBirth).getTime() / 1000) || undefined,
        given_name: signupData.givenName,
        middle_name: signupData.middleName,
        phone_number: signupData.phoneNumber,
        postal_code: signupData.postalCode,
        state_province: signupData.stateProvince,
        street_address: signupData.streetAddress,
        surname: signupData.surname,
      };


      if (affPrograms.enabled) {
        let affProgram = this.getQueryVariable('aff');
        let inList = null;
        if (!affProgram) {
          affProgram = (document.referrer || '')
            .replace(/^https?\:\/\//i, '')
            .replace(/\//i, '');

          inList = affPrograms.items.includes(affProgram);
        } else {
          inList = true;
        }

        if (inList) {
          profile.AffiliateID = affProgram;
        }
      }
      signupRequestPayload.custom_profile = JSON.stringify(profile);

      this.props.signup(signupRequestPayload);
    });
  };

  submitConfirmAccountWithCode = accountConfirmationCode => {
    const { signupData } = this.state;
    this.setState({ accountConfirmationCode }, () => {
      this.props.verifyUser(false, accountConfirmationCode.code, signupData.email);
    });
  }

  onResendVerification = () => this.props.resendVerification(this.state.signupData.email);

  onFormChange = (formState) => {
    const passwordsMatch = this.passwordConfirmed(
      formState.password.value, 
      formState.confirm_password.value
    );
    this.setState({
      formState,
      passwordsMatch,
    });
  };

  onClose = () => {
    this.props.onClose();
    this.props.signupNone();
  };

  openLogin = () => {
    this.props.onClose();
    this.props.onOpenLogin();
  }

  passwordConfirmed = (password, confirmPassword) => password === confirmPassword;

  renderForm = () => {
    const { schema, signupStatus } = this.props;
    const schemaStatus = (schema || {}).status || {};
    if (schemaStatus === 'SUCCESS') {
      return (
        <Fragment>
          <FormContainer
            allowSubmit={this.state.passwordsMatch}
            className="signup"
            fields={schemaStatus === 'SUCCESS' ? schema.properties : null}
            loading
            loadingStatus={signupStatus && signupStatus === status.pending}
            onChange={this.onFormChange}
            onSubmit={this.submit}
            onFocus={this.onFormChange}
            onBlur={this.onFormChange}
            submitText={_t('Sign Up', 'MARKETING.SIGNUP_MODAL_BTN')}
            translation="SIGN_UP"
          />
          {this.renderFormErrors()}
        </Fragment>
      );
    } else if (schemaStatus === 'FAILED') {
      return <Fragment>
        <h3>{_t(
          'Something went wrong. Please, try again later.',
          'MARKETING.SIGNUP_PROFILE_SCHEMA_FAILED',
        )}</h3>
      </Fragment>
    }
  };

  renderFormErrors = () => (
    <ul className="form-errors">
      {!this.state.passwordsMatch
        && this.state.formState.confirm_password
        && this.state.formState.confirm_password.value
        && !this.state.formState.confirm_password.active ? (
          <li className="passwords-not-matching">
            {_t(
              'Passwords do not match, confirm both passwords are identical.',
              'MARKETING.SIGNUP_FORM_ERROR_PASSWORDS_NOT_MATCHING',
            )}
          </li>
        ) : null}
    </ul>
  );

  renderSuccess = () => (
    <Fragment>
      <h3>
        {_t('Registration Almost Complete', 'MARKETING.SIGNUP_SUCCESS_HEADER')}
      </h3>
      <p>
        {_t(
          'Please check your email to confirm your account.',
          'MARKETING.SIGNUP_SUCCESS_INSTRUCTIONS_1',
        )}
      </p>
      <p className="link" onClick={this.onResendVerification}>
        {_t(
          "Didn't receive an email? Check your spam folder or click here to resend.",
          'MARKETING.SIGNUP_RESEND_EMAIL_1',
        )}
      </p>
      <p>
        <Link to='/login'>
          {_t('Login', 'MARKETING.SIGNUP_SUCCESS_LOGIN_LINK')}
        </Link>
      </p>
    </Fragment>
  );

  renderError = () => {
    const statusCodes = {
      DUPLICATED_USERNAME: 'DUPLICATED_USERNAME',
      INVALID_PARAMETER_EXCEPTION: 'INVALID_PARAMETER_EXCEPTION',
      LIMIT_EXCEEDED_EXCEPTION: 'LimitExceededException',
    };
    if (this.props.signupError.error === statusCodes.DUPLICATED_USERNAME) {
      return this.props.resendVerificationStatus !== 'accepted' ? (
        <Fragment>
          <p>
            {_t(
              'An account with that email has already been created. Check your inbox for a verification email.',
              `MARKETING.SIGNUP_ERROR_${statusCodes.DUPLICATED_USERNAME}`,
            )}
          </p>
          <p className="link" onClick={this.onResendVerification}>
            {_t(
              "Didn't receive an email? Click here to resend.",
              'MARKETING.SIGNUP_RESEND_EMAIL_2',
            )}
          </p>
        </Fragment>
      ) : (
        <Fragment>
          {_t(
            'Your verification email has been resent. Please check your inbox.',
            'MARKETING.VERIFICATION_EMAIL_CONFIRM_RESEND',
          )}
        </Fragment>
      );
    } 
    if (this.props.signupError.error) {
      return (
        <Fragment>
          {_t(
            this.props.signupError.error_description,
            `MARKETING.SIGNUP_ERROR_${this.props.signupError.error}`,
          )}
        </Fragment>
      );
    }
    if (this.props.signupError.error === statusCodes.LIMIT_EXCEEDED_EXCEPTION) {
      return (
        <Fragment>
          {_t(
            this.props.signupError.error_description,
            `MARKETING.SIGNUP_ERROR_${statusCodes.LIMIT_EXCEEDED_EXCEPTION}`,
          )}
        </Fragment>
      );
    }
    if (this.props.signupError.error === statusCodes.INVALID_PARAMETER_EXCEPTION) {
      return (
        <Fragment>
          {_t(
            this.props.signupError.error_description,
            `MARKETING.SIGNUP_ERROR_${statusCodes.INVALID_PARAMETER_EXCEPTION}`,
          )}
        </Fragment>
      );
    }

    return (
      <Fragment>
        {_t(
          'There was an error registering your account, please try again',
          'MARKETING.SIGNUP_ERROR',
        )}
      </Fragment>
    );
  };

  renderVerify = () => {
    const { verificationStatus } = this.props;
    return (
      <Fragment>
           <h3>
            {_t('Registration Almost Complete', 'MARKETING.SIGNUP_SUCCESS_HEADER')}
          </h3>
          <p>
            {_t(
              'Please check your email to confirm your account.',
              'MARKETING.SIGNUP_SUCCESS_INSTRUCTIONS_1',
            )}
          </p>
          {verificationStatus === status.failed && (
            <p>{_t(
              'The confirmation code you entered did not match our records. Please try again.',
              `MARKETING.SIGNUP_ERROR_INVALID_CONFIRMATION_CODE`,
            )}</p>
          )}
          <FormContainer
            // allowSubmit={this.state.passwordsMatch}
            className="signup-code"
            fields={confirmAccountWithCodeFields}
            loading
            loadingStatus={
              this.props.verificationStatus
              && this.props.verificationStatus === status.pending
            }
            onSubmit={this.submitConfirmAccountWithCode}
            submitText={_t('Sign Up', 'MARKETING.SIGNUP_MODAL_BTN')}
            translation="SIGN_UP"
          />
        </Fragment>
    )
  };

  renderVerificationStatus = () => {
    return (
      <Fragment>
        <h3 className="status success">
          {_t('Verification Successful', 'VERIFICATION.SUCCESS')}
        </h3>
        <p>
          {_t(
            'Your account is now verified. Login and start trading.',
            'VERIFICATION.SUCCESS_MSG',
          )}
        </p>
        <Link to='/login'>
          {_t('Login', 'MARKETING.SIGNUP_SUCCESS_LOGIN_LINK')}
        </Link>
      </Fragment>
    );
  }

  renderSignupStep = () => {
    const { signupStatus } = this.props;
    const signupSteps = {
      form: this.renderForm,
      [status.verified]: this.renderVerificationStatus,
      [status.verify]: this.renderVerify,
      [status.success]: this.renderSuccess,
      [status.failed]: this.renderError,
    };
    if (signupStatus && signupSteps[signupStatus]) {
      return signupSteps[signupStatus]();
    }
    return signupSteps.form();
  };

  render() {
    return (
      <div>
        <Modal
          allowSubmit={this.state.passwordsMatch}
          className="marketing-modal"
        >
        {this.props.signupStatus === 'PENDING' ? 
          <Spinner /> : this.renderSignupStep()
        }
          
        </Modal>
        <Link to='/home'>
          <img src="images/icons/xThin.svg" className="xIcon" />
        </Link>
      </div>
    );
  }
}

SignupModal.propTypes = propTypes;

const mapStateToProps = state => ({
  signupStatus: selectSignupStatus(state),
  signupError: selectSignupError(state),
  verificationStatus: selectVerificationStatus(state),
  resendVerificationStatus: state.user.resendVerification,
  schema: state.user.minimalProfileSchema,
  affPrograms: state.config.affiliatePrograms,
});

const mapDispatchToProps = dispatch => ({
  getProfileSchema: () => dispatch(getProfileSchema()),
  resendVerification: email => dispatch(resendVerification(email)),
  signup: signupData => dispatch(signup(signupData)),
  signupNone: () => dispatch(signupNone()),
  verifyUser: (resetFlow, hash, emailAddress) => dispatch(verifyUser(resetFlow, hash, emailAddress)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignupModal);
