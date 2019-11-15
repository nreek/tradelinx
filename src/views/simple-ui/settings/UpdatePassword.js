import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import FormContainer from '../../../elements/FormContainer';
import { changePassword } from '../../../../config/formConfig';
import SettingsWrapper from './SettingsWrapper';
import Modal from '../../../elements/Modal';

import { newPassword, newPasswordFailed, newPasswordPending, newPasswordNone } from '../../../actions';
import { selectPasswordStatus } from '../../../reducers';

import 'react-toastify/dist/ReactToastify.css';


const propTypes = {
  translation: PropTypes.string,
};

class UpdatePassword extends Component {
    state = {
      formState: {},
      passwordData: null,
      passwordsMatch: false,
    };

    changePassword = (id) => {
      if (id != 'NONE') {
        this.props.newPasswordPending();
      } else {
        this.props.newPasswordNone();
      }
    };

    submit = (passwordData) => {
      if (passwordData.newPassword === passwordData.confirmPassword) {
        this.setState({ passwordData }, () => {
          const passwordPayload = {
            password: passwordData.newPassword,
            new_password: passwordData.confirmPassword,
            old_password: passwordData.oldPassword
          };
          this.props.newPassword(passwordPayload);
        });
      }
    };

    onFormChange = (formState) => {
      this.setState({ formState }, () => {
        if (
          this.passwordConfirmed(
            formState['New Password'].value,
            formState['Confirm Password'].value,
          )
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
      const confirmPW = 'Confirm Password';

      return (
        <ul className="form-errors">
          {!passwordsMatch
          && formState[confirmPW]
          && formState[confirmPW].active ? (
            <li className="passwords-not-matching">
              {_t(
                'Passwords do not match, confirm both passwords are identical.',
                'SETTINGS.ERROR_PASSWORDS_NOT_MATCHING',
              )}
            </li>
            ) : null}
        </ul>
      );
    };

    renderError = () => (
      <ul className="form-errors">
          <li className="wrong-old-password">
            {_t(
              'Wrong old password.',
              'SETTINGS.WRONG_OLD_PASSWORD',
            )}
          </li>
      </ul>
    );

    renderModal = () => {
      const { newPasswordStatus } = this.props;
      if (newPasswordStatus === 'PENDING' || newPasswordStatus === 'FAILED') {
        return (
          <Modal onClose={() => this.changePassword('NONE')}>
          {newPasswordStatus === 'FAILED' ? this.renderError() : null}
            <FormContainer
              allowSubmit={this.state.passwordsMatch}
              className="change-password"
              fields={changePassword}
              onChange={this.onFormChange}
              onSubmit={this.submit}
            />
            {this.renderFormErrors()}
          </Modal>
        );
      }
    };

    render() {
      return (
        <div>
          <p
            className="reset-password"
          >
            <a onClick={this.changePassword}>
              {_t('Click here ', 'SETTINGS.CHANGE_PASSWORD_CLICK_HERE')}
            </a>
            {_t('to change your password', 'SETTINGS.CHANGE_PASSWORD_TEXT')}
          </p>
          {this.renderModal()}
          <ToastContainer />
        </div>
      );
    }
}

UpdatePassword.propTypes = propTypes;

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
)(UpdatePassword);
