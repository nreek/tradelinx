import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { updateBalances, connectingQueueAdd } from '../actions';
import types from '../actions/types';

const loadBalances = (action$, state$, { socket }) => action$.pipe(
  rx.first(action => action.type === types.app.loadBalances),
  rx.withLatestFrom(state$),
  rx.switchMap(([action, state]) => Observable.create((observer) => {
    observer.next(connectingQueueAdd(action));
    socket.subscribeBalances((accountBalances) => {
      const balances = accountBalances.reduce((result, balance) => {
        const currency = state.accounts[balance.account_id];
        if (currency && !state.config.excludedProducts.includes(currency)) {
          result.push({ currency, ...balance });
        }
        return result;
      }, []);
      observer.next(updateBalances(balances));
    });
  })),
);

export default loadBalances;
