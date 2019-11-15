import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';

import { depositRequestPending, depositRequestFailed, setDepositStatus } from '../actions';
import types from '../actions/types';
import { newDepositDto } from '../api/dataTypes';


const makeDeposit = (action$, state$, { managerSocket }) => action$.pipe(
  ofType(types.user.makeDeposit),
  rx.switchMap(action => Observable.create((observer) => {
    const deposit = { ...newDepositDto };
    deposit.currency_id = action.product;
    deposit.amount = action.amount;
    observer.next(depositRequestPending());
    managerSocket.makeDeposit(deposit)
      .then((response) => {
        if (response.id) {
          observer.next(setDepositStatus(response));
        } else {
          observer.next(
            depositRequestFailed(response.message, response.status_code),
          );
        }
      })
      .catch((error) => {
        console.error(error);
        // TODO: on catch
      });
  })),
);

export default makeDeposit;
