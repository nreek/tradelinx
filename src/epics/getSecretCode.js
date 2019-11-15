import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';
import { setSecretCodePending, setSecretCode, setSecretCodeError } from '../actions';
import types from '../actions/types';


const getSecretCode = (action$, state$, { auth, socket }) => action$.pipe(
  ofType(types.user.getSecretCode),
  rx.switchMap(() => Observable.create((observer) => {
    observer.next(setSecretCodePending());
    auth.setupTotpForUser(socket).then((secretCodeResponse) => {
      observer.next(setSecretCode(secretCodeResponse));
    }).catch(error => observer.next(setSecretCodeError(error)));
  })),
);

export default getSecretCode;
