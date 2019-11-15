import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';

import {
  setResendVerificationStatus,
  signupNextStep,
  signupError,
} from '../actions';
import { status } from '../constants';
import types from '../actions/types';

const resendVerification = (action$, state$, { auth, restApi }) => action$.pipe(
  ofType(types.user.resendVerification),
  rx.switchMap(action => Observable.create((observer) => {
    observer.next(setResendVerificationStatus('pending'));
    auth.resendVerificationEmail(action.email, restApi)
    .then((response) => {
      if (response.status_code === 'OK') {
        observer.next(setResendVerificationStatus('accepted'));
        observer.next(signupNextStep(status.verify));
      } else {
        observer.next(setResendVerificationStatus('rejected'));
        observer.next(signupError(response));
      }
    });
  })),
);

export default resendVerification;
