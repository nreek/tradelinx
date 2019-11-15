import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';
import {
  changePasswordWithCodePending,
  changePasswordWithCodeSuccess,
  changePasswordWithCodeFailed,
} from '../actions/legacy';

import types from '../actions/types';

export const changePasswordWithCode = (action$, state$, { restApi, auth }) => action$.pipe(
  ofType(types.user.changePasswordWithCode),
  rx.switchMap(action => Observable.create((observer) => {
    observer.next(changePasswordWithCodePending());
    auth.changePasswordWithCode(action.passwordPayload, restApi)
      .then((res) => {
        if (res.status_code === 'OK') {
          observer.next(changePasswordWithCodeSuccess());
        } else {
          observer.next(changePasswordWithCodeFailed(res));
        }
      })
      .catch((err) => {
        observer.next(changePasswordWithCodeFailed(err));
      });
  })),
);

export default changePasswordWithCode;
