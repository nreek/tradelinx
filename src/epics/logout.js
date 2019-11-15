import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';

import { authNone } from '../actions';
import types from '../actions/types';


const logout = (action$, _, { auth, socket, managerSocket }) => action$.pipe(
  ofType(types.user.logout),
  rx.switchMap(() => Observable.create((observer) => {
    auth.logout().then(() => {
      ['access_token', 'refresh_token', 'token_expires', 'token_type', 'username']
        .forEach(x => window.sessionStorage.removeItem(x));
      observer.next(authNone());
      socket.disconnect();
      managerSocket.disconnect();
      window.location.replace('/');
    });
  })),
);

export default logout;
