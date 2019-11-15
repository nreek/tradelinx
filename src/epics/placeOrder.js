import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';
import v1 from 'uuid/v1';

import { setOrderPending, setOrderAccepted, setOrderRejected } from '../actions';
import types from '../actions/types';
import { newOrderDto } from '../api/dataTypes';
import { selectExchange } from '../reducers';


const placeOrder = (action$, state$, { socket }) => action$.pipe(
  ofType(types.user.placeOrder),
  rx.withLatestFrom(state$),
  rx.switchMap(([action, state]) => Observable.create((observer) => {
    const { order } = action;
    const appOrder = { ...newOrderDto, ...order };
    appOrder.client_order_id = v1();
    appOrder.security_id = order.id;
    appOrder.time_in_force = order.timeInForce;
    appOrder.submission_time = Date.now();
    appOrder.destination = selectExchange(state);
    observer.next(setOrderPending());

    socket.createOrder(appOrder)
      .then((response) => {
        if (response.id) {
          observer.next(setOrderAccepted(response.id));
        } else {
          observer.next(
            setOrderRejected(response.message, response.status_code),
          );
        }
      })
      .catch((error) => {
        console.error(error);
        // TODO: on catch
        // observer.next(actionTypes.setOrderStatus('rejected', error));
      });
  })),
);

export default placeOrder;
