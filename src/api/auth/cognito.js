import { fetch } from 'whatwg-fetch';
import Auth from '@aws-amplify/auth';

import QRCode from 'qrcode';
import { buildSimpleObject } from './../../util/helpers';
import { authError } from '../../reducers';

import AbstractAuth from './abstractAuth';

const COMPLETE_2FA = '/user_authentication/completeExchange2FA';
const EXCHANGE_TOKEN = '/user_authentication/exchangeToken';

class Cognito extends AbstractAuth {
  constructor(providerConfig, tokens, { siteName, }) {
    super();
    const { host, exchangeName, authServiceUrl, } = providerConfig;
    const useSsl = providerConfig.useSsl ? providerConfig.useSsl : true;
    const protocol = useSsl ? 'https' : 'http';
    const url = `${protocol}://${host}/oauth/token`;

    Auth.configure({
      Auth: {
        // REQUIRED - Amazon Cognito Region
        region: providerConfig.region,
        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: providerConfig.userPoolId,
        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: providerConfig.userPoolWebClientId,
        // OPTIONAL - Configuration for cookie storage
        // Note: if the secure flag is set to true, then the cookie transmission
        // requires a secure protocol
        cookieStorage: providerConfig.cookieStorage,
        // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
        // authenticationFlowType: 'USER_PASSWORD_AUTH',
      },
    });

    this.signup = (signupData) => {
      const customData = buildSimpleObject(JSON.parse(signupData.custom_profile), 'custom:');
      return Auth.signUp({
        username: signupData.email_address,
        password: signupData.password,
        attributes: {
          email: signupData.email_address,
          ...customData,
        },
      })
        .then((data) => {
          if (data.userConfirmed) {
          } else {
            // Need user to enter the code that was emailed to them
            return { status_code: 'OK', nextStep: 'verify' };
          }
        })
        .catch(({ code, message}) => {
          let status_code = '';
          if (code === 'UsernameExistsException') {
            status_code = 'DUPLICATED_USERNAME';
          } else if (code === 'InvalidParameterException') {
            status_code = 'INVALID_PARAMETER_EXCEPTION';
          } 
          
          return {
            message: message,
            status_code,
          };
        });
    };

    this.authenticate = (username, password, verificationCode, confirmationCode) => {
      return Auth.signIn(username, password)
        .then((user) => {
          if (user.challengeName === 'SMS_MFA'
            || user.challengeName === 'SOFTWARE_TOKEN_MFA') {
            // If MFA is enabled, sign-in should be confirmed with the confirmation code
            if (verificationCode) {
              return Auth.confirmSignIn(
                user, // Return object from Auth.signIn()
                verificationCode, // Confirmation code
                user.challengeName, // MFA Type e.g. SMS, TOTP.
              )
                .then((loggedUser) => this.getExchangeToken(loggedUser))
                .catch((error) => {
                  window.appGlobals.apiLog(error);
                  return {
                    error: authError.invalidVerificationCode,
                  };
                });
            }
            const totpRequiredError = {
              error: authError.verificationCode,
              error_description: authError.verificationCode,
            };
            throw totpRequiredError;
          } else if (user.challengeName === 'MFA_SETUP') {
            // This happens when the MFA method is TOTP
            // The user needs to setup the TOTP before using it
            // More info please check the Enabling MFA part
            Auth.setupTOTP(user);
          } else {
            return this.getExchangeToken(user);
          }
        })
        .catch((err) => {
          if (err.code && err.message) {
            if (err.code === authError.userNotFoundException || err.code === authError.notAuthorizedException) {
              const invalidCredentials = {
                error: authError.invalidCredentials,
                error_description: authError.invalidCredentials,
              };
              throw invalidCredentials;
            }
            if (err.code === authError.passwordResetRequiredException) {
              const verificationCode = {
                error: authError.verificationCode,
                error_description: authError.verificationCode,
              };
              return verificationCode;
            }
            if (err.code === authError.userNotConfirmedException) {
              if (confirmationCode && confirmationCode !== '') {
                return this.verifyEmail(null, confirmationCode, username)
                  .then((verifyResult) => {
                    if (verifyResult) {
                      return this.authenticate(username, password);
                    }

                    this.resendVerificationEmail(username);
                    const invalidConfirmationCode = {
                      error: authError.invalidConfirmationCode,
                      error_description: authError.invalidConfirmationCode,
                    };
                    throw invalidConfirmationCode;
                  })
                  .catch((emailVerifyError) => {
                    if (emailVerifyError.code && emailVerifyError.message) {
                      const generalEmailVerifyError = {
                        error: emailVerifyError.code,
                        error_description: emailVerifyError.message,
                      };
                      throw generalEmailVerifyError;
                    }
                    throw emailVerifyError;
                  });
              }
              const confirmationCodeRequired = {
                error: authError.confirmationCode,
                error_description: authError.confirmationCode,
              };
              throw confirmationCodeRequired;
            }
            const generalError = {
              error: err.code,
              error_description: err.message,
            };
            throw generalError;
          } else {
            throw err;
          }
        });
    };

    this.setupTotpForUser = () => {
      return Auth.currentAuthenticatedUser({ bypassCache: true })
        .then((user) => {
          const { email, } = user.attributes;
          // To setup TOTP, first you need to get a `authorization code` from Amazon Cognito
          return Auth.setupTOTP(user).then((code) => {
            const qrString = `otpauth://totp/${siteName}:${email}?secret=${code}&issuer=${siteName}`;
            return QRCode.toDataURL(qrString)
              .then((qrDataUrl) => ({
                code,
                qr: qrDataUrl.replace(/^data:image\/[a-z]+;base64,/, ''),
              }));
          });
        });
    };

    this.getExchangeToken = (user) => {
      const { jwtToken } = user.signInUserSession.idToken;
      const payload = {
        exchange: exchangeName,
        clientToken: jwtToken,
      };
      return fetch(`${authServiceUrl}${EXCHANGE_TOKEN}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(payload),
      })
        .then(response => response.json())
        .then((responseJson) => {
          const {
            exchange_access_token: access_token,
            exchange_refresh_token: refresh_token,
          } = responseJson;
          const responsePayload = {
            access_token,
            refresh_token,
            token_type: 'bearer',
          };
          window.sessionStorage.setItem('access_token', access_token);
          window.sessionStorage.setItem('refresh_token', refresh_token);
          window.sessionStorage.setItem('token_type', 'bearer');

          tokens.next(responseJson);
          return responsePayload;
        })
        .catch(error => error);
    };

    this.modifySettings = ({ is_using_2fa = false, code, }) => {
      return (is_using_2fa 
        ? this.turnOnOffMFA(code, 'TOTP')
        : this.turnOnOffMFA(code, 'NOMFA')
      ).then((response) => response.message ? response : this.loadUserSettings());
    };

    this.getUserMfaType = () => {
      return Auth.currentAuthenticatedUser({ bypassCache: true })
        .then((user) =>Auth.getPreferredMFA(user).then((data) => data))
        .catch((err) => err);
    };

    this.loadUserSettings = () => {
      let userSettings = {
        is_using_2fa: false,
        is_using_2fa_for_withdrawal: false,
        method_for_2fa: '',
        client_user_id: null,
      };
      return this.getUserMfaType()
        .then((mfaType) => {
          if (mfaType === 'SOFTWARE_TOKEN_MFA') {
            userSettings.is_using_2fa = true;
            userSettings.is_using_2fa_for_withdrawal = true;
            userSettings.method_for_2fa = 'totp';
          } else if (mfaType === 'SMS_MFA') {
            userSettings.is_using_2fa = true;
            userSettings.is_using_2fa_for_withdrawal = true;
            userSettings.method_for_2fa = 'sms';
          }

          return userSettings;
        })
        .catch((error) => error);
    };

    this.refresh = () => Auth.currentAuthenticatedUser()
      .then((user) => this.getExchangeToken(user));

    this.logout = () => Auth.signOut({ global: true })
      .then(data => data)
      .catch(error => window.appGlobals.apiLog(error));

    this.verifyEmail = (code, _, email) => Auth.confirmSignUp(email, code)
      .then((data) => data === 'SUCCESS' ? true : false)
      .catch((err) => false);

    this.resendVerificationEmail = (emailAddress) => Auth.resendSignUp(emailAddress)
      .then(() => ({ status_code: 'OK' }))
      .catch((error) => error);

    this.changePassword = (oldPassword, newPassword) => {
      return Auth.currentAuthenticatedUser({ bypassCache: true })
        .then((user) => {
          return Auth.changePassword(user, oldPassword, newPassword);
        })
        .then((data) => data)
        .catch((error) => error);
    };

    this.updatePassword = ({old_password, password, }) => this.changePassword(old_password, password);

    this.changePasswordWithCode = ({ username, code, new_password, }) => {
      return this.forgotPasswordSubmit(username, code, new_password).then((res = {}) => {
        return res.code ? res : { status_code: 'OK' };
      });
    };

    this.passwordResetRequest = (email) => this.forgotPassword(email).then(res => ({ status: 'VERIFY', ...res, }));

    this.forgotPassword = (email) => Auth.forgotPassword(email)
      .then((data) => data.CodeDeliveryDetails ? { ok: true } : data)
      .catch((err) => ({ ...err, status_code: err.code, }));

    this.forgotPasswordSubmit = (username, code, newPassword) => {
      // Collect confirmation code and new password, then
      return Auth.forgotPasswordSubmit(username, code, newPassword)
        .then((data) => data)
        .catch((err) => err);
    };

        // NOMFA, TOTP
    this.turnOnOffMFA = (challengeAnswer, mfaType) => {
      return Auth.currentAuthenticatedUser({ bypassCache: true })
        .then((user) => {
          return Auth.verifyTotpToken(user, challengeAnswer)
            .then(() => {
              return Auth.setPreferredMFA(user, mfaType)
                .then((data) => data);
            });
        }).catch((e) => e);
    };

    this.completeExchange2FA = (challengeAnswer) => {
      return Auth.currentAuthenticatedUser({ bypassCache: true })
        .then((user) => {
          return Auth.getPreferredMFA(user).then((preferedMFA) => {
            const accessJwtToken = user.signInUserSession.accessToken.jwtToken;
            const payload = {
              exchange: exchangeName,
              clientToken: accessJwtToken,
              twoFACode: challengeAnswer,
              twoFAMethod: preferedMFA,
            };
            return fetch(`${authServiceUrl}${COMPLETE_2FA}`, {
              headers: {
                'Content-Type': 'application/json',
              },
              method: 'POST',
              body: JSON.stringify(payload),
            })
              .then(response => response.json())
              .then((responseJson) => {
                let exchangeCode = '';
                if (responseJson && responseJson.requestResponse.result) {
                  exchangeCode = responseJson.exchangeCode;
                } else {
                  console.debug(responseJson.requestResponse.message);
                }

                return {
                  exchangeCode: exchangeCode,
                };
              })
              .catch(error => error);
          });
        });
    };

  }
}

export default Cognito;