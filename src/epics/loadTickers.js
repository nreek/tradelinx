import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';

import { updateTickers, connectingQueueAdd } from '../actions';
import types from '../actions/types';


const configurePrices = (ticks) => {
  const newTicks = [];
  ticks.map((tickData, i) => {
    const price = (parseFloat(ticks[i].bid) + parseFloat(ticks[i].ask)) * 0.5;
    const priceChange24HPercent = (
      ticks[i].price_24h_change / (price - ticks[i].price_24h_change) * 100.0
    );
    newTicks.push(
      {
        ask: ticks[i].ask,
        bid: ticks[i].bid,
        price_24h_change: priceChange24HPercent,
        price_24h_max: ticks[i].price_24h_max,
        price_24h_min: ticks[i].price_24h_min,
        security_id: ticks[i].security_id,
        volume_24h_change: ticks[i].volume_24h_change,
      },
    );
  });
  return newTicks;
};

const loadTickers = (action$, state$, { socket }) => action$.pipe(
  ofType(types.app.loadTickerData),
  rx.switchMap((action) => Observable.create((observer) => {
    observer.next(connectingQueueAdd(action));
    socket.subscribeSecuritiesStats((ticks) => {
      observer.next(updateTickers(configurePrices(ticks)));
    });
  })),
);

export default loadTickers;
