import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';

import GeoLookup from '../api/geoLookup';
import { setLocation, setLocationError } from '../actions';
import types from '../actions/types';

const loadLocation = (action$, state$) => action$.pipe(
  ofType(types.app.loadLocation),
  rx.withLatestFrom(state$),
  rx.switchMap(([, state]) => Observable.create((observer) => {
    const geoLookup = new GeoLookup();
    geoLookup.getCountry(state.config.geoLookup.token)
      .then(({ result, data, errormsg }) => {
        if (result) {
          const { country_long, country_short, ip } = data;
          const location = { country_long, country_short, ip };

          observer.next(setLocation(location));
        } else {
          observer.next(setLocationError(errormsg));
        }
      })
      .catch((error) => {
        observer.next(setLocationError(error.message));
      });
  })),
);

export default loadLocation;
