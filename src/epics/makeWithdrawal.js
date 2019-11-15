import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';
import { withdrawalRequestPending, withdrawalRequestFailed, setWithdrawalStatus } from '../actions';
import types from '../actions/types';


const makeWithdrawal = (action$, state$, { auth, managerSocket }) => action$.pipe(
  ofType(types.user.makeWithdrawal),
  rx.switchMap(action => Observable.create((observer) => {
    observer.next(withdrawalRequestPending());

    auth.completeExchange2FA(action.withdrawalRequest.code)
        .then((exchange2FAResult) => {
          const code = exchange2FAResult.exchangeCode;
          const newWithdrawalRequest = {
            ...action.withdrawalRequest,
            code: code || action.withdrawalRequest.code,
          };

          managerSocket
            .makeWithdrawal(newWithdrawalRequest)
            .then((response) => {
              if (response.id) {
                observer.next(setWithdrawalStatus(response));
              } else {
                observer.next(
                  withdrawalRequestFailed(response.message, response.status_code),
                );
              }
            })
            .catch((error) => {
              console.error(error);
              // TODO: on catch
              // observer.next(actionTypes.setWithdrawalStatus('rejected', error));
            });
        })
        .catch((error) => {
          console.debug(error);
        });
  })),
);

export default makeWithdrawal;
