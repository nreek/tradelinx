import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';
import {
  transactionsPending,
  transactionsSuccess,
  transactionsFailed,
  setCurrentTransaction,
  completedTransactions,
  completedTransactionsFailed,
  connectingQueueAdd,
} from '../actions';
import types from '../actions/types';


export const loadTransactions = (action$, state$, { managerSocket }) => action$.pipe(
  ofType(types.app.loadTransactions),
  rx.switchMap((action) => Observable.create((observer) => {
    observer.next(connectingQueueAdd(action));
    managerSocket.subscribeTransactions((transaction) => {
      observer.next(setCurrentTransaction(transaction));
    });
  })),
);

export const getTransactionsList = (action$, state$, { managerSocket }) => action$.pipe(
  ofType(types.app.getTransactionsList),
  rx.switchMap((action) => Observable.create((observer) => {
    observer.next(connectingQueueAdd(action));
    observer.next(transactionsPending());
    managerSocket.incompleteTransactions()
      .then((trans) => {
        observer.next(transactionsSuccess(trans.filter(t => t.transaction_id !== null)));
      })
      .catch((error) => {
        observer.next(transactionsFailed(error));
      });
  })),
);

export const getCompletedTransactionsList = (action$, state$, { managerSocket }) => action$.pipe(
  ofType(types.app.getCompletedTransactionsList),
  rx.switchMap(action => Observable.create((observer) => {
    observer.next(connectingQueueAdd(action));
    managerSocket.completeTransactions(action.data)
      .then((transactions) => {
        observer.next(completedTransactions(transactions));
      })
      .catch((error) => {
        observer.next(completedTransactionsFailed(error));
      });
  })),
);
