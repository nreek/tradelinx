import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { setAccounts, loadBalances } from '../actions';
import types from '../actions/types';


const loadAccounts = (action$, state$, { socket }) => action$.pipe(
  rx.first(action => action.type === types.app.loadAccounts),
  rx.switchMap(() => Observable.create((observer) => {
    socket.accounts().then((accounts) => {
      observer.next(setAccounts(accounts));
      observer.next(loadBalances());
    });
  })),
);

export default loadAccounts;
