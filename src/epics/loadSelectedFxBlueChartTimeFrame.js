import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';

import { setFxBlueChartTimeFrame, selectedFxBlueChartTimeFrame, connectingQueueAdd } from '../actions';
import types from '../actions/types';


const loadSelectedFxBlueChartTimeFrame = action$ => action$.pipe(
  ofType(types.user.loadSelectedFxBlueChartTimeFrame),
  rx.switchMap((action) => Observable.create((observer) => {
    observer.next(connectingQueueAdd(action));
    const frame = window.sessionStorage.getItem('selectedFxBlueChartTimeframe');
    observer.next(setFxBlueChartTimeFrame(frame));
    observer.next(selectedFxBlueChartTimeFrame(frame));
  })),
);

export default loadSelectedFxBlueChartTimeFrame;
