import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';
import { verificationPending, verificationSuccess, verificationFailed } from '../actions';
import types from '../actions/types';


const verifyUser = (action$, state$, { auth, restApi }) => action$.pipe(
  ofType(types.app.verifyUser),
  rx.switchMap(action => Observable.create((observer) => {
    observer.next(verificationPending());
    restApi
    auth.verifyEmail(action.hash, restApi, action.email)
      .then((verified) => {
        if (verified) {
          observer.next(verificationSuccess());
        } else {
          observer.next(verificationFailed());
        }
      })
      .catch(() => bserver.next(verificationFailed()));
  })),
);

export default verifyUser;
