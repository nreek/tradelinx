import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';
import types from '../actions/types';
import { cancelOrderSuccess, cancelOrderError } from '../actions';

const cancelOrder = (action$, state$, { socket }) => action$.pipe(
  ofType(types.user.cancelOrder),
  rx.switchMap(action => Observable.create((observer) => {
    socket.cancelOrder(action.orderId).then((response) => {
      if (!response) {
        observer.next(cancelOrderSuccess(action.orderId));
      } else {
        observer.next(cancelOrderError(response.message, response.status_code));
      }
    });
  })),
);

export default cancelOrder;
