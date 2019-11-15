import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';

import {
  updateProfilePending,
  updateProfileSuccess,
  updateProfileFailed,
  updateKycStatus,
  getUserProfile,
} from '../actions';
import types from '../actions/types';


export const updateProfile = (action$, state$, { restApi }) => action$.pipe(
  ofType(types.app.updateUserProfile),
  rx.switchMap(action => Observable.create((observer) => {
    observer.next(updateProfilePending());
    restApi.updateUserProfile(action.kycFormDataPayload)
      .then((resp) => {
        if (resp.status_code === 'OK') {
          observer.next(getUserProfile());
          observer.next(updateProfileSuccess());
          observer.next(updateKycStatus());
        } else {
          observer.next(updateProfileFailed(resp));
        }
      });
  })),
);


export default updateProfile;
