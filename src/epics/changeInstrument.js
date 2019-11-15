import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';
import { setInstrument, invalidInstrument } from '../actions';
import types from '../actions/types';


const changeInstrument = (action$, state$) => action$.pipe(
  ofType(types.user.changeInstrument),
  rx.withLatestFrom(state$),
  rx.switchMap(([action, state]) => Observable.create((observer) => {
    const { instrument } = action;
    const { instruments } = state; // TODO: replace with selector!

    if (Object.keys(instruments).includes(instrument)) {
      window.sessionStorage.setItem(
        'selectedInstrument',
        JSON.stringify(instruments[instrument]),
      );
      observer.next(setInstrument(instrument, instruments[`${instrument}`]));
    } else {
      observer.next(invalidInstrument(instrument));
    }
  })),
);

export default changeInstrument;
