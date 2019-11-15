import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';
import {
  userProfilePending,
  userProfileSuccess,
  userProfileFailed,
  getProfileSchema,
} from '../actions';
import types from '../actions/types';


const getUserProfile = (action$, state$, { restApi }) => action$.pipe(
  ofType(types.app.getUserProfile),
  rx.switchMap(() => Observable.create((observer) => {
    observer.next(userProfilePending());
  
    restApi
      .getUserProfile()
      .then((profile) => {
        const data = profile.custom_profile === '' ? '{}' : profile.custom_profile;
        observer.next(
          userProfileSuccess(JSON.parse(data)),
        );
        observer.next(getProfileSchema());
      })
      .catch(error => observer.next(userProfileFailed(error)));
  })),
);

export default getUserProfile;
