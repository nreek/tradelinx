import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';

import types from '../actions/types';
import { updateOrder, newOrderEvents, connectingQueueAdd } from '../actions';
import { selectExchange } from '../reducers';


const loadOrders = (action$, state$, { socket }) => action$.pipe( // TODO: maybe this should be called *subscribeOrders* because it's long lived
  rx.first(action => action.type === types.app.loadOrders),
  rx.withLatestFrom(state$),
  rx.switchMap(([action, state]) => Observable.create((observer) => {
    observer.next(connectingQueueAdd(action));
    socket.subscribeOrders((update) => {
      const exchange = selectExchange(state);
      observer.next(updateOrder(update.order, exchange));
      observer.next(newOrderEvents(update.events, exchange)); // TODO: be sure this isn't a duplicate event?!?!
    });
  })),
);

export default loadOrders;
