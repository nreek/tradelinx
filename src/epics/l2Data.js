import { ofType } from 'redux-observable';
import * as rx from 'rxjs/operators';
import {
  Observable, from, of, concat,
} from 'rxjs';

import { selectExchange } from '../reducers';
import { refreshBook, updateBook, setTrades, connectingQueueAdd } from '../actions';
import types from '../actions/types';


const l2Subscription = (action, socket, exchange) => Observable.create((observer) => {
  let refreshed = false;
  socket.unsubscribeL2();
  observer.next(connectingQueueAdd(action));
  socket.subscribeL2(action.instrument, (msg) => {
    switch (msg.type) {
      case 'snapshot_full_refresh':
        refreshed = true;
        observer.next(refreshBook(msg.entries, exchange));
        break;

      case 'incremental_update':
        if (refreshed) {
          observer.next(updateBook(msg.entries, exchange));
        }
        break;
    }
  });
});

const loadTrades = (action, socket, exchange) => from(socket.trades(action.instrument)).pipe(
  rx.catchError(() => of({ entries: [] })), // TODO: verify syntax
  rx.map((msg) => {
    if (!msg.entries.length) {
      console.log(`Unable to load trades for ${action.instrument}`);
    }
    return setTrades(msg.entries, exchange);
  }),
  rx.take(1),
);


// TODO: instrument is blank on first load!!
export const loadL2Data = (action$, state$, { socket }) => action$.pipe(
  rx.first(action => action.type === types.app.loadL2Data),
  rx.withLatestFrom(state$),
  rx.switchMap(([action, state]) => l2Subscription(action, socket, selectExchange(state))), // TODO: call loadTrades once above TODO is resolved!
  rx.takeUntil(action$.pipe(ofType(types.user.changeInstrument))),
);

export const changeL2Data = (action$, state$, { socket }) => action$.pipe(
  rx.skipWhile(action => action.type !== types.app.loadL2Data),
  rx.filter(action => action.type === types.state.setInstrument),
  rx.withLatestFrom(state$),
  rx.switchMap(([action, state]) => concat(
    loadTrades(action, socket, selectExchange(state)),
    l2Subscription(action, socket, selectExchange(state)),
  )),
);
