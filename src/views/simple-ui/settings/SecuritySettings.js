import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { toast } from 'react-toastify';
import {
  getSecretCode,
  recreateSecretCode,
  updateSettings,
  loadUserSettings,
} from '../../../actions';
import { selectExchangeSettings, selectUsePassword, } from '../../../reducers';
import { isChrome, isSafari } from '../../../util/helpers';

// Components
import Button from '../../../elements/Button';
import Form from '../../../elements/form-controls/Form';
import SettingsWrapper from './SettingsWrapper';
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
    changesMade: false,
    displayAdditionalFields: false,
    twoFA: false,
    refreshCode: false,
    showQRCode: false,
  };

  componentDidMount() {
    const { is_using_2fa, is_using_2fa_for_withdrawal,} = this.props.settings;

    this.setState({
      twoFA: is_using_2fa,
      showQRCode: (!is_using_2fa && (is_using_2fa_for_withdrawal || !is_using_2fa_for_withdrawal)),
    });
  }

  componentDidUpdate(prevProps) {
    const { updateStatus: prevUpdateStatus, } = prevProps.settings;
    const { updateStatus, updateMessage, is_using_2fa, } = this.props.settings;

    if (updateStatus === 'success' && (prevUpdateStatus === 'pending' || !prevUpdateStatus)) {
      toast.success(_t('2FA successfully updated', 'TOASTS.TWOFA_SUCCESS'));
      this.setState({
        twoFA: is_using_2fa,
        changesMade: false,
        displayAdditionalFields: false,
        code: '',
        password: '',
      }, this.toggleFields(false));
    }
    if (updateStatus === 'error' && (prevUpdateStatus === 'pending' || !prevUpdateStatus)) {
      toast.error(_t(`${updateMessage}`, 'TOASTS.TWOFA_ERROR'));
    }
  }

  handleChange = (checked) => {
    const { is_using_2fa, } = this.props.settings;

    if (!checked && is_using_2fa) {
      this.setState({ twoFA: checked }, this.toggleFields(true));
    } else if (checked === is_using_2fa) {
      this.cancelChange();
    } else {
      this.setState({ twoFA: checked }, this.toggleFields(true));
      this.props.getSecretCode();
    }
  };

  cancelChange = () => {
    this.setState({ twoFA: this.props.settings.is_using_2fa }, this.toggleFields(false));
  }

  toggleFields = (status) => {
    let displayAdditionalFieldsTimeout = 0;
    let changesMadeTimeout = 0;
    const scrollSettings = { behavior: 'smooth' };

    if (status) {
      changesMadeTimeout = 10;
      displayAdditionalFieldsTimeout = 9;
      scrollSettings.top = document.body.scrollHeight;
    } else {
      changesMadeTimeout = 50;
      displayAdditionalFieldsTimeout = 75;
      scrollSettings.top = 0;
    }

    setTimeout(() => this.setState({ displayAdditionalFields: status }), displayAdditionalFieldsTimeout);
    setTimeout(() => {
      window.scrollTo(scrollSettings);
      this.setState({ changesMade: status });
    }, changesMadeTimeout);
  }

  update2FA = () => {
    const { settings, exchangeSettings, } = this.props;
    const { twoFA, email: email_address, code, password, } = this.state;
    const { withdrawal_2fa_mandatory, login_2fa_mandatory, } = exchangeSettings;
    const { is_using_2fa_for_withdrawal: is_2fa_for_withdraw } = settings;
    // The exchange API will not let a user turn off 2FA if it is flagged as "mandatory". This can be set at either
    // the login level (login_2fa_mandatory) or the withdraw level (withdrawal_2fa_mandatory). If either is "true"
    // then a call to the API attempting to set the user's 2FA to off (when previously "on") will return an error
    // Therefore, if any 2FA setting is mandatory, we allow a user to turn 2FA on but not off for that setting
    const is_using_2fa = twoFA ? true : (login_2fa_mandatory ? settings.is_using_2fa : twoFA);
    const is_using_2fa_for_withdrawal = twoFA ? true : (withdrawal_2fa_mandatory ? is_2fa_for_withdraw : twoFA);

    this.props.updateSettings({
      code,
      is_using_2fa,
      is_using_2fa_for_withdrawal,
      email_address,
      password,
    });
  };

  refreshClick = () => {
    this.props.recreateSecretCode();
    this.setState({
      refreshCode: !this.state.refreshCode,
    });
  };

  // TODO: Needs resend secretcode functionality
  renderAdditionalFields = () => {
    const { usePassword, settings, } = this.props;
    const { displayAdditionalFields, showQRCode, code, password, } = this.state;
    return (
      <CSSTransition
        in={displayAdditionalFields}
        timeout={{ enter: 100, exit: 100 }}
        classNames="fade-slide"
        unmountOnExit
        onExited={() => {
          if (settings.is_using_2fa) {
            this.setState({ showQRCode: false });
          } else {
            this.setState({ showQRCode: true });
          }
          this.setState({ code: '', password: '' });
        }}
      >
        <div className="additional-fields">
          {showQRCode && this.renderSecretCode()}
          <div className="required-inputs">
            <div>
              <TextInput
                details={_t('Enter the secret key from your 2-factor authentication app.', 'SETTINGS.TWOFA_INSTRUCTIONS_4')}
                name="2FA Code"
                onChange={e => this.setState({ code: e.target.value })}
                translation="SETTINGS"
                value={code}
                // Just setting the attribute autocomplete="off" does not turn off the browser from autofilling
                // inputs if the user has the autofill option on. In this case, browsers were filling 2fa with username
                // (weird, but since there's a password field below, it probably inferred this field is a username).
                // So, the attributes "type" and "hideInput" (below) are needed to workaround this known bug.
                // Each browser needs a different trick to overcome this issue, so to make it fully work in most of them,
                // the two attributes are needed. There's a lot of references on the internet regarding this issue.
                // These are a few ones that provided some tips to the implemented workaround:
                // https://bugs.chromium.org/p/chromium/issues/detail?id=370363#c7
                // https://stackoverflow.com/questions/22661977/disabling-safari-autofill-on-usernames-and-passwords
                // https://bugs.chromium.org/p/chromium/issues/detail?id=914451&can=2&q=Autofill%20&colspec=ID%20Pri%20M%20Stars%20ReleaseBlock%20Component%20Status%20Owner%20Summary%20OS%20Modified
                type="new-password"
                hideInput={isChrome() || isSafari()}
              />
            </div>
            {usePassword && (
              <div>
                <TextInput
                  details={_t('Confirm your password to make changes.', 'SETTINGS.TWOFA_INSTRUCTIONS_5')}
                  name="Password"
                  hideInput
                  onChange={e => this.setState({ password: e.target.value })}
                  translation="SETTINGS"
                  value={password}
                />
              </div>
            )}
          </div>
        </div>
      </CSSTransition>
    );
  }

  // TODO: add refresh functionality
  renderSecretCode = () => (
    <Fragment>
      <div>
        <p>
          {_t(
            'Enable 2-factor authentication via Google Authenticator, Authy, or any 2FA app.',
            'SETTINGS.TWOFA_INSTRUCTIONS_1',
          )}
          {/* &nbsp;
          {_t(
            'To begin, download the app from the iPhone App Store or the Google Play store.',
            'SETTINGS.TWOFA_INSTRUCTIONS_2',
          )} */}
        </p>
      </div>
      <div className="qr-code-container">
        {this.props.secretCode.qr ? (
          <div className="qr-code-container">
            <img
              src={`data:image/jpeg;base64, ${this.props.secretCode.qr}`}
              alt={`QR Code of Key: ${this.props.secretCode.code}`}
            />
          </div>
        ) : (
          <div style={{ width: 200, height: 200 }} />
        )}
        <div className="code-container">
          <div>
            <p>
              {_t(
                'Scan the QR Code or enter the authenticator key below.',
                'SETTINGS.TWOFA_INSTRUCTIONS_3',
              )}
            </p>
          </div>
          <div className="authenticator-key">
            {_t('Authenticator Key', 'SETTINGS.AUTHENTICATOR_KEY')}
          </div>
          <div className="key">{this.props.secretCode.code}</div>
          <a className="refresh" onClick={this.refreshClick}>
            {_t('Refresh', 'ELEMENT.REFRESH')}
          </a>
        </div>
      </div>
    </Fragment>
  );

  // TODO: Update position change to be dynamic
  render() {
    const { usePassword, translation, } = this.props;
    const { changesMade, twoFA, displayAdditionalFields, code, password,  } = this.state;
    const addlFieldsElement = document.querySelector('.additional-fields');
    let actionButtonPosition = 0;
    if (changesMade && addlFieldsElement) {
      actionButtonPosition = addlFieldsElement.clientHeight + 60;
      if (window.innerWidth <= 620) { actionButtonPosition += 60; }
    }

    return (
      <SettingsWrapper
        name="2-Factor Authentication"
        className="two-factor-authentication"
        translation={translation}
        autoComplete="off"
      >
        <div className="content-wrapper">
          {this.renderAdditionalFields()}
          <div
            className="action-buttons"
            style={{
              transform: `translateY(${actionButtonPosition}px)`,
            }}
          >
            <div className="toggle-labels">
              <span className="off">{_t('Off', 'ELEMENT.OFF')}</span>
              <ToggleSwitch
                onChange={this.handleChange}
                value={twoFA}
              />
              <span className="on">{_t('On', 'ELEMENT.ON')}</span>
            </div>
            {displayAdditionalFields && (
              <div className="update-button">
                <Button
                   disabled={!code || (usePassword && !password)}
                  onClick={this.update2FA}
                >
                  {_t('Update', 'SETTINGS.UPDATE_2FA')}
                </Button>
                <Button onClick={this.cancelChange}>
                  {_t('Cancel', 'SETTINGS.CANCEL_2FA')}
                </Button>
              </div>
            )}
          </div>
        </div>
        {/* <h4>{_t('Password Reset', 'SETTINGS.SECURITY_PW_RESET_TITLE')}</h4>
        <br />
        <a href="">{_t('Click here', 'SETTINGS.SECURITY_PW_RESET_LINK')}</a>
        {_t('to reset your password', 'SETTINGS.SECURITY_PW_RESET_TEXT')} */}
      </SettingsWrapper>
    );
  }
}

const mapStateToProps = state => ({
  secretCode: state.secretCode,
  settings: state.settings,
  exchangeSettings: selectExchangeSettings(state),
  usePassword: selectUsePassword(state),
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
