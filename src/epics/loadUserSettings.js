import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';
import { setUserSettingsPending, setUserSettings, setUserSettingsError } from '../actions';
import types from '../actions/types';


const loadUserSettings = (action$, state$, { auth, socket }) => action$.pipe(
  ofType(types.app.loadUserSettings),
  rx.switchMap(() => Observable.create((observer) => {
    observer.next(setUserSettingsPending());
    auth
      .loadUserSettings(socket)
      .then((settings) => {
        observer.next(setUserSettings(settings));
      })
      .catch(error => observer.next(setUserSettingsError(error)));
  })),
);

export default loadUserSettings;
