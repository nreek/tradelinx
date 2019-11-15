import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';

import types from '../actions/types';
import { connectingQueueAdd } from '../actions';

const setFxBlueChartTimeFrame = action$ => action$.pipe(
  ofType(types.user.setFxBlueChartTimeFrame),
  rx.switchMap(action => Observable.create(() => {
    observer.next(connectingQueueAdd(action));
    window.sessionStorage.setItem('selectedFxBlueChartTimeframe', action.timeFrame);
  })),
);

export default setFxBlueChartTimeFrame;
