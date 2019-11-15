import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';

import { newPasswordPending, newPasswordSuccess, newPasswordFailed } from '../actions';
import types from '../actions/types';


export const changePassword = (action$, state$, { auth, restApi }) => action$.pipe(
  ofType(types.user.newPassword),
  rx.switchMap(action => Observable.create((observer) => {
    observer.next(newPasswordPending());
    auth.updatePassword(action.passwordPayload, restApi).then((res) => {
      if (res.status_code === 'OK' || res === 'SUCCESS') {
        observer.next(newPasswordSuccess());
      } else {
        observer.next(newPasswordFailed());
      }
    });
  })),
);

export default changePassword;
