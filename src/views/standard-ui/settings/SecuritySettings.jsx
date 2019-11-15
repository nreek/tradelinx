import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { toast, ToastContainer } from 'react-toastify';
import {
  getSecretCode,
  recreateSecretCode,
  updateSettings,
  loadUserSettings,
} from '../../../actions';
import { selectExchangeSettings } from '../../../reducers';
import { isChrome, isSafari } from '../../../util/helpers';

// Components
import Button from '../../../elements/Button';
import Form from '../../../elements/form-controls/Form';
import TextInput from '../../../elements/form-controls/TextInput';
import ToggleSwitch from '../../../elements/ToggleSwitch';

const propTypes = {
  translation: PropTypes.string,
};

const toastErrorMap = {
  'Invalid verification code.': 'TOASTS.TWOFA_INVALID_CODE',
  'Withdrawal 2FA is mandatory.': 'TOASTS.TWOFA_WD_MANDATORY',
};

// QUESTION: Should both 2FA settings be merged into one?
// > 2FA for login
// > 2FA for withdraw
class SecuritySettings extends Component {
  state = {
    code: '',
    password: '',
  };

  componentDidMount() {
    if (!this.props.settings.is_using_2fa) {
      this.props.getSecretCode();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.settings.updateStatus === 'success'
      && (prevProps.settings.updateStatus === 'pending' || !prevProps.settings.updateStatus)
    ) {
      toast.success(_t('2FA successfully updated', 'TOASTS.TWOFA_SUCCESS'));
    }
    if (
      this.props.settings.updateStatus === 'error'
      && (prevProps.settings.updateStatus === 'pending' || !prevProps.settings.updateStatus)
    ) {
      toast.error(_t(`${this.props.settings.updateMessage}`, 'TOASTS.TWOFA_ERROR'));
    }
  }

  update2FA = (action) => {
    const { settings, exchangeSettings } = this.props;

    // The exchange API will not let a user turn off 2FA if it is flagged as "mandatory". This can be set at either
    // the login level (login_2fa_mandatory) or the withdraw level (withdrawal_2fa_mandatory). If either is "true"
    // then a call to the API attempting to set the user's 2FA to off (when previously "on") will return an error
    // Therefore, if any 2FA setting is mandatory, we allow a user to turn 2FA on but not off for that setting

    // if(settings.is_using_2fa === true && exchangeSettings.login_2fa_mandatory || exchangeSettings.withdrawal_2fa_mandatory){}
    const is_using_2fa = action === 'on';
    const is_using_2fa_for_withdrawal = action === 'on';
    this.props.updateSettings({
      code: this.state.code,
      is_using_2fa,
      is_using_2fa_for_withdrawal,
      email_address: '',
      password: this.state.password,
    });
  };

  renderAdditionalFields = () => (
    <Fragment>
      {this.renderSecretCode()}
      <div className="two-fa-input-fields">
        <div className="key-inputs">
          <TextInput
            details="Enter code from 2-fa app"
            name=""
            onChange={e => this.setState({ code: e.target.value })}
            translation="SETTINGS"
            value={this.state.code}
            type="new-password"
            hideInput={isChrome() || isSafari()}
          />
        </div>
        <div className="password-input">
          <TextInput
            details="Confirm your password"
            name=""
            hideInput
            onChange={e => this.setState({ password: e.target.value })}
            translation="SETTINGS"
            value={this.state.password}
          />
        </div>
      </div>
    </Fragment>
  );

  renderSecretCode = () => (
    <Fragment>
      <p className="two-fa-description">
        {_t('Enable 2-Factor authentication via Google Authenticator, Authy, or any 2FA App', 'SETTINGS_SECURITY.TWO_FA_DESCRIPTION_ONE')}
        <br />
        <br />
        {_t('Scan QR or enter authenticator key', 'SETTINGS_SECURITY.TWO_FA_DESCRIPTION_TWO')}
      </p>
      <div className="qr-container">
        {this.props.secretCode.qr ? (
          <div className="qr-code">
            <img
              src={`data:image/jpeg;base64, ${this.props.secretCode.qr}`}
              alt={`QR Code of Key: ${this.props.secretCode.code}`}
            />
          </div>
        ) : (
          <div style={{ height: '120px', width: '120px' }} />
        )}
        <div className="code-container">
          <div className="authenticator-key">
            {_t('Authenticator Key', 'SETTINGS.AUTHENTICATOR_KEY')}
          </div>
          <div className="key">{this.props.secretCode.code}</div>
          <a className="generate" onClick={() => this.props.recreateSecretCode()}>
            {_t('generate', 'SETTINGS_SECURITY.GENERATE_LINK')}
          </a>
        </div>
      </div>
    </Fragment>
  );

  render() {
    const { settings, exchangeSettings } = this.props;
    return (
      <div>
        <div className="content-wrapper">
          {this.props.settings.is_using_2fa ? (
            <div className="two-fa-confirmation">
              {_t('Two factor authentication enabled', 'SETTINGS_SECURITY.TWO_FA_ENABLED')}
              {/*! exchangeSettings.login_2fa_mandatory
              || !exchangeSettings.withdrawal_2fa_mandatory ? (
                <Button name="off" onClick={() => this.update2FA('off')}>
                  TURN OFF 2FA
                </Button>
                ) : null */}
            </div>
          ) : (
            <Fragment>
              {this.renderAdditionalFields()}
              <div className="action-buttons">
                <Button
                  disabled={!this.state.code || !this.state.password}
                  onClick={() => this.update2FA('on')}
                >
                  SAVE
                </Button>
              </div>
            </Fragment>
          )}
        </div>
        <ToastContainer />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  secretCode: state.secretCode,
  settings: state.settings,
  exchangeSettings: selectExchangeSettings(state),
});

const mapDispatchToProps = dispatch => ({
  getSecretCode: () => dispatch(getSecretCode()),
  recreateSecretCode: () => dispatch(recreateSecretCode()),
  updateSettings: settings => dispatch(updateSettings(settings)),
  loadUserSettings: () => dispatch(loadUserSettings()),
});

SecuritySettings.propTypes = propTypes;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SecuritySettings);
