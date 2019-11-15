import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';
import moment from 'moment';

import {
  maintenanceModeStatus,
  maintenanceModeMsg,
  maintenanceMessageStatus,
  maintenanceMessageMsg,
  maintenanceModeEnabled as maintenanceModeEnabledAction,
} from '../actions';
import types from '../actions/types';


export default (action$, state$) => action$.pipe(
  ofType(types.app.maintenanceModeEnabled),
  rx.withLatestFrom(state$),
  rx.switchMap(([_, state]) => Observable.create((observer) => {
    const { maintenanceMode = {} } = state.config;
    const { scheduled = [] } = maintenanceMode;

    observer.next(maintenanceModeStatus(maintenanceMode.enabled));
    current = moment.utc();

    if (scheduled.length) {
      const {
        maintenanceMode,
        maintenanceMessage,
        maintenanceModeMessage,
        maintenanceModeMsgTranslation,
        warningMessage,
        warningMessageTranslation,
      } = processScheduled(scheduled, observer);

      if (maintenanceMode) {
        observer.next(maintenanceModeStatus(maintenanceMode));
        observer.next(maintenanceModeMsg({
          msg: maintenanceModeMessage,
          translate: maintenanceModeMsgTranslation,
        }));
        checkMaintenanceModeStatus(observer);
      } else if (maintenanceMessage) {
        observer.next(maintenanceMessageStatus(maintenanceMessage));
        observer.next(maintenanceMessageMsg({
          msg: warningMessage,
          translate: warningMessageTranslation,
        }));

        checkMaintenanceModeStatus(observer);
      }
    }
  })),
);
