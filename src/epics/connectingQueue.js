import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';

import types from '../actions/types';

export const connectingQueue = (action$, state$) => action$.pipe(
  ofType(types.app.connectingQueueReconnect),
  rx.withLatestFrom(state$),
  rx.switchMap(([, state]) => Observable.create((observer) => {
    state.connectingQueue.forEach(action => observer.next(action));
  })),
);
