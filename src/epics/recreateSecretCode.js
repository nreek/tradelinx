import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';
import { resetSecretCodePending, resetSecretCode, resetSecretCodeError } from '../actions';
import types from '../actions/types';


const recreateSecretCode = (action$, state$, { auth, socket }) => action$.pipe(
  ofType(types.user.recreateSecretCode),
  rx.switchMap(() => Observable.create((observer) => {
    observer.next(resetSecretCodePending());
    auth.setupTotpForUser(socket)
    .then((secretCodeResponse) => {
      observer.next(resetSecretCode(secretCodeResponse));
    })
    .catch(error => observer.next(resetSecretCodeError(error)));
  })),
);

export default recreateSecretCode;
