import { BehaviorSubject, from } from 'rxjs';
import config from '../../config/config';
import Exchange from './auth/exchange';
import Cognito from './auth/cognito';


class AppAuth {
  constructor(host, useSsl = true) {
    const tokens = new BehaviorSubject({});
    this.tokens = new BehaviorSubject({});
    let authProvider = {};

    const { provider, providerConfig = {} } = config.authConfig;
    switch(provider) {
      case 'Cognito':
        authProvider = new Cognito(providerConfig, tokens, config);
      break;
      default:
        authProvider = new Exchange(host, useSsl, tokens);
      break;
    }
   

    this.authenticate = authProvider.authenticate;

    this.refresh = authProvider.refresh;

    this.logout = authProvider.logout;

    this.signup = authProvider.signup;

    this.verifyEmail = authProvider.verifyEmail;

    this.resendVerificationEmail = authProvider.resendVerificationEmail;

    this.modifySettings = authProvider.modifySettings;

    this.setupTotpForUser = authProvider.setupTotpForUser;

    this.loadUserSettings = authProvider.loadUserSettings;

    this.updatePassword = authProvider.updatePassword;
    
    this.passwordResetRequest = authProvider.passwordResetRequest;

    this.changePasswordWithCode = authProvider.changePasswordWithCode;

    this.completeExchange2FA = authProvider.completeExchange2FA;
  }
}

export default AppAuth;
