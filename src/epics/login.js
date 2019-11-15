import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';

import {
  authPending,
  authFailed,
  authSuccess,
  authNone,
  loadTickers,
  loadInstruments,
  loadProducts,
  loadExchangeSettings,
  getKycStatus,
  kycRequestStatus,
  loadOrderEvents,
  loadAccounts,
  passwordResetRequestVerify,
  connectingQueueReconnect,
} from '../actions';
import types from '../actions/types';
import { authError, selectUser } from '../reducers';

const socketConnect = (observer) => {
  observer.next(loadInstruments());
  observer.next(loadTickers());
  observer.next(loadProducts());
  observer.next(loadExchangeSettings());
  observer.next(connectingQueueReconnect());
  observer.next(loadAccounts());
  observer.next(loadOrderEvents());
};

const loadUserInformation = (observer, data) => {
  observer.next(authSuccess(data.username));
  observer.next(getKycStatus());
  observer.next(kycRequestStatus());
};

// TODO: rework to take connect success callback (passed to socket.connect) if needed:
const connectManagerSocket = (tokens, socket) => socket.connect(tokens).then(
  () => {}, // TODO: handle manager connection failure
);

const addCognitoTokenToSessionStorage = state => {
  const user = selectUser(state);
  if (user.signInUserSession && user.signInUserSession.accessToken) {
    window.sessionStorage.setItem('api_token', user.signInUserSession.accessToken.jwtToken);
  }
}

export const login = (action$, state$, { socket, managerSocket, auth, restApi }) => action$.pipe(
  ofType(types.user.login),
  rx.withLatestFrom(state$),
  rx.switchMap(([action, state]) => Observable.create((observer) => {
    observer.next(authPending());
    auth.authenticate(action.username, action.password, action.verificationCode).then((data) => {
      if (data.error) {
        if (data.error === authError.verificationCode) {
          observer.next(passwordResetRequestVerify(data));
        }

        observer.next(authFailed(data));
        return;
      }
      window.sessionStorage.setItem('username', action.username);
      addCognitoTokenToSessionStorage(state);
      observer.next(authSuccess(action.username));
      observer.next(getKycStatus());
      observer.next(kycRequestStatus());
      socket.connect(data, () => {
        restApi.setTokens({ access_token: data.access_token, token_type: data.token_type });
        loadUserInformation(observer, { username: action.username, });
        return socketConnect(observer);
      }).then(() => {
        connectManagerSocket(data, managerSocket); // Socket will already have tokens
      }).catch(() => {
        // TODO: now what?
      });
    }).catch((error) => {
      observer.next(authFailed(error));
    });
  })),
);

export const autoConnect = (action$, state$, {
  socket, managerSocket, restApi, auth,
}) => action$.pipe(
  ofType(types.app.autoConnect),
  rx.withLatestFrom(state$),
  rx.switchMap(([_, state]) => Observable.create((observer) => {
    const access_token = window.sessionStorage.getItem('access_token');
    const refresh_token = window.sessionStorage.getItem('refresh_token');
    const token_type = window.sessionStorage.getItem('token_type');
    const token_expires = window.sessionStorage.getItem('token_expires');
    const username = window.sessionStorage.getItem('username');
    addCognitoTokenToSessionStorage(state);

    if (access_token !== null) {
      observer.next(authPending());
      socket.connect({
        access_token, refresh_token, token_type, token_expires,
      }, () => socketConnect(observer)).then(
        value => value,
        () => auth.refresh(refresh_token)
          .then(() => socket.connect(undefined, () => socketConnect(observer)))
          .catch((err) => {
            observer.next(authNone(err)); // TODO: make authNone with error param modify state?
            return Promise.reject(err);
          }),
      ).then(
        (tokens) => {
          restApi.setTokens({ access_token: tokens.access_token, token_type: tokens.token_type });
          
          loadUserInformation(observer, { username });
          connectManagerSocket(tokens, managerSocket);
        },
        () => {}, // Drop any remaining error
      );
    } else {
      observer.next(authNone());
    }
  })),
);
