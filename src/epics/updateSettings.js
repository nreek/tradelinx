import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';

import {
  setUpdateSettingsPending,
  setUpdateSettingsAccepted,
  setUpdateSettingsError,
} from '../actions';
import types from '../actions/types';


const updateSettings = (action$, state$, { auth, socket }) => action$.pipe(
  ofType(types.user.updateSettings),
  rx.withLatestFrom(state$),
  rx.switchMap(([action, state]) => Observable.create((observer) => {
    const { status, client_user_id, ...currentSettings } = state.settings;
    const editUserSettingsRequest = {
      ...currentSettings,
      ...action.settings,
    };
    // const editUserSettingsRequest = {...action.settings}
    observer.next(setUpdateSettingsPending());
    auth.modifySettings(editUserSettingsRequest, socket)
      .then((response) => {
        if (!response.message) {
          observer.next(setUpdateSettingsAccepted(response));
        } else {
          observer.next(
            setUpdateSettingsError(response.message, response.status_code),
          );
        }
      })
      .catch((error) => {
        console.error(error);
        // TODO: on catch
      });
  })),
);

export default updateSettings;
