import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';
import { exchangeSettingsPending, exchangeSettingsSuccess, exchangeSettingsFailed } from '../actions';
import types from '../actions/types';


const loadExchangeSettings = (action$, state$, { socket }) => action$.pipe(
  ofType(types.app.loadExchangeSettings),
  rx.switchMap(() => Observable.create((observer) => {
    observer.next(exchangeSettingsPending());
    socket
      .globalSettings()
      .then((settings) => {
        observer.next(exchangeSettingsSuccess(settings));
      })
      .catch(error => observer.next(exchangeSettingsFailed(error)));
  })),
);

export default loadExchangeSettings;
