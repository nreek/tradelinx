import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';

import {
  kycStatusPending,
  kycStatusSuccess,
  kycStatusFailed,
  kycRequestPending,
  kycRequestSuccess,
  kycRequestFailed,
} from '../actions';
import types from '../actions/types';


export const getKycStatus = (action$, state$, { restApi }) => action$.pipe(
  ofType(types.app.getKycStatus),
  rx.withLatestFrom(state$),
  rx.switchMap(() => Observable.create((observer) => {
    observer.next(kycStatusPending());
    restApi
      .getKycStatus()
      .then((status) => {
        observer.next(kycStatusSuccess(status));
      })
      .catch(error => observer.next(kycStatusFailed(error)));
  })),
);

export const kycRequestStatus = (action$, state$, { restApi }) => action$.pipe(
  ofType(types.app.kycRequestStatus),
  rx.withLatestFrom(state$),
  rx.switchMap(() => Observable.create((observer) => {
    observer.next(kycRequestPending());
    restApi
      .kycRequestStatus()
      .then((resp) => {
        observer.next(kycRequestSuccess(resp.status));
      })
      .catch(error => observer.next(kycRequestFailed(error)));
  })),
);

export const updateKycStatus = (action$, state$, { restApi }) => action$.pipe(
  ofType(types.app.updateKycStatus),
  rx.withLatestFrom(state$),
  rx.switchMap(() => Observable.create((observer) => {
    observer.next(kycStatusPending());
    restApi
      .updateKycStatus()
      .then((status) => {
        observer.next(kycStatusSuccess(status));
      })
      .catch(error => observer.next(kycStatusFailed(error)));
  })),
);
