import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';

import { maintenanceMessageStatus, maintenanceMessageMsg } from '../actions';
import types from '../actions/types';


export default (action$, state$) => action$.pipe(
  ofType(types.app.maintenanceMessageEnabled),
  rx.withLatestFrom(state$),
  rx.switchMap(([action, state]) => Observable.create((observer) => {
    const { maintenanceMode = {} } = state.config;

    if (maintenanceMode.enabledMessage && action.status) {
      observer.next(maintenanceMessageStatus(true));
    }

    if (!action.status) {
      observer.next(maintenanceMessageStatus(false));
    }

    if (action.status && action.isConnectionError) {
      observer.next(maintenanceMessageMsg({
        msg: `Connection error. Some pages are unavailable. Please, try again later.`,
        translate: `MAINTENANCE_MODE.CONNECTION_ERROR_MESSAGE`
      }));
      observer.next(maintenanceMessageStatus(true));
    }
  })),
);
