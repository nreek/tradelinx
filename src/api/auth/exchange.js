import { BehaviorSubject, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import Deferred from '../../util/deferred';
import AbstractAuth from './abstractAuth';

class Exchange extends AbstractAuth {
  constructor(host, useSsl = true, tokens) {
    super();

    const protocol = useSsl ? 'https' : 'http';
    const url = `${protocol}://${host}/oauth/token`;
    const headers = {
      Authorization: 'Basic d2ViOg==',
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const fetchInit = { method: 'POST', headers };
    const doTokenFetch = body => from(window.fetch(url, { ...fetchInit, body })).pipe(
      switchMap((response) => {
        if (response.ok) {
          return response.json();
        }
        // If not OK get error JSON if available:
        return response.json().then(
          json => Promise.reject(json),
          err => Promise.reject(err),
        );
      }),
    );

    const getTokens = (body) => {
      const ready = new Deferred();
      doTokenFetch(body).subscribe({
        next: (value) => {
          const tokensObj = {
            access_token: value.access_token,
            refresh_token: value.refresh_token,
            token_type: value.token_type,
            token_expires: new Date().getTime() + (value.expires_in * 1000),
          };

          window.sessionStorage.setItem('access_token', tokensObj.access_token);
          window.sessionStorage.setItem('refresh_token', tokensObj.refresh_token);
          window.sessionStorage.setItem('token_type', tokensObj.token_type);
          window.sessionStorage.setItem('token_expires', tokensObj.token_expires);
          tokens.next(tokensObj);
          ready.resolve(tokensObj);
        },
        error: (err) => {
          ready.reject(err);
        },
      });
      return ready;
    };

    this.tokens = tokens.asObservable();

    this.authenticate = (username, password, verificationCode) => {
      let body = `username=${encodeURIComponent(username)}`
                + `&password=${encodeURIComponent(password)}`
                + '&grant_type=password&scope=public';
      if (verificationCode) {
        body += `&code=${encodeURIComponent(verificationCode)}`;
      }
      return getTokens(body);
    };

    this.refresh = (refreshToken) => {
      const body = `grant_type=refresh_token&refresh_token=${refreshToken}`;
      return getTokens(body);
    };

    this.signup = (data, restApi) => restApi.signup(data);

    this.verifyEmail = (verificationCode, restApi) => restApi.verifyUser(verificationCode);

    this.resendVerificationEmail = (emailAddress, restApi) => restApi.resendVerification(emailAddress);

    this.loadUserSettings = (socket) => socket.settings();

    this.modifySettings = (editUserSettingsRequest, socket) => socket.modifySettings(editUserSettingsRequest);

    this.setupTotpForUser = (socket) => socket.resendSecretCode();

    this.updatePassword = (passwordPayload, restApi) => restApi.updatePassword(passwordPayload);

    this.passwordResetRequest = (email, restApi) => restApi.passwordResetRequest(email);
  }
}

export default Exchange;
