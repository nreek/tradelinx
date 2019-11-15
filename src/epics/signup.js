import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';

import { signupPending, signupSuccess, signupError, signupNextStep } from '../actions';
import types from '../actions/types';


export const signup = (action$, state$, { auth, restApi }) => action$.pipe(
  ofType(types.user.signup),
  rx.switchMap(action => Observable.create((observer) => {
    observer.next(signupPending());
    auth.signup(action.signupData, restApi).then((response)  => {
      if (response.status_code === 'OK') {
        observer.next(signupSuccess());
        if (response.nextStep) {
          observer.next(signupNextStep(response.nextStep));
        }
      } else {
        observer.next(signupError(response));
      }
    });
  })),
);

export default signup;
