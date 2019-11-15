import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';

import {
  passwordResetRequestPending,
  passwordResetRequestSuccess,
  passwordResetRequestFailed,
  passwordResetCommitPending,
  passwordResetCommitSuccess,
  passwordResetCommitFailed,
  passwordResetRequestVerify,
} from '../actions';

import types from '../actions/types';

import { status } from '../constants';

export const passwordResetRequest = (action$, state$, { auth, restApi }) => action$.pipe(
  ofType(types.user.passwordResetRequest),
  rx.switchMap(action => Observable.create((observer) => {
    observer.next(passwordResetRequestPending());
    auth.passwordResetRequest(action.email, restApi).then((response) => {
      if (response && (response.ok || response.status_code === 'OK')) {
        observer.next(passwordResetRequestSuccess());
        if (response.status === status.verify) {
          observer.next(passwordResetRequestVerify())
        }
      } else {
        if (response && response.hasOwnProperty('status_code')) {
          observer.next(passwordResetRequestFailed(response.message));
        } else {
          observer.next(passwordResetRequestFailed());
        }
      }
    });
  })),
);

export const passwordResetCommit = (action$, state$, { restApi }) => action$.pipe(
  ofType(types.user.passwordResetCommit),
  rx.switchMap(action => Observable.create((observer) => {
    observer.next(passwordResetCommitPending());
    restApi
      .passwordResetCommit(action.hash, action.newPassword)
      .then((resetPassword) => {
        if (resetPassword.status === 'success') {
          observer.next(passwordResetCommitSuccess());
        } else {
          observer.next(passwordResetCommitFailed(resetPassword));
        }
      })
      .catch((error) => {
        observer.next(passwordResetCommitFailed(error));
      });
  })),
);

export default passwordResetRequest;
