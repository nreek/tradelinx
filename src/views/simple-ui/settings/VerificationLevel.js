import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import SettingsWrapper from './SettingsWrapper';

const propTypes = {
  translation: PropTypes.string,
};

class VerificationLevel extends PureComponent {
  render() {
    return (
      <SettingsWrapper
        name="Verification Level"
        translation={this.props.translation}
      >
        {_t('For your security, some of our services require for you to provide basic or additional levels of verification. To verify your account or to check what your current verification level is, please click below.', 'SETTINGS.VERIFICATION_TEXT_BLOCK')}

        <button className="login-btn">{_t('VERIFY ACCOUNT', 'SETTINGS.VERIFT_ACCT_BTN')}</button>
      </SettingsWrapper>
    );
  }
}

VerificationLevel.propTypes = propTypes;

export default VerificationLevel;
