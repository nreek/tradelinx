import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';

import types from '../actions/types';
import { history } from './loadHistory';
import { getResolution } from '../util/helpers';
import { connectingQueueAdd } from '../actions';

export const loadBars = (action, socket) => Observable.create((observer) => {
  observer.next(connectingQueueAdd(action));
  const barsBlob = action.getCurrentBarsBlob;
  const historyBar = history[barsBlob.symbolInfo.name].lastBar;
  const security = barsBlob.symbolInfo.name.split(/[/]/).join('');
  const periodicity = getResolution(barsBlob.resolution);

  function updateBar(data, barsBlob, historyBar) {
    let { resolution } = barsBlob;
    const price = (parseFloat(data.close_ask) + parseFloat(data.close_bid)) / 2;
    if (resolution.includes('D')) {
      resolution = 1440;
    } else if (resolution.includes('W')) {
      resolution = 10080;
    }

    const coeff = resolution * 60;
    const rounded = Math.floor(data.timestamp / coeff) * coeff;
    const lastBarSec = historyBar.time;
    let lastBar;

    if (rounded > lastBarSec) {
      lastBar = {
        time: rounded,
        open: historyBar.close,
        high: historyBar.close,
        low: historyBar.close,
        close: price,
        volume: data.volume,
      };
    } else {
      if (price < historyBar.low) {
        historyBar.low = price;
      } else if (price > historyBar.high) {
        history.high = price;
      }
      history.close = price;
      lastBar = historyBar;
    }
    return lastBar;
  }

  socket.unsubscribeCurrentBars();
  socket.subscribeCurrentBars(security, periodicity, (msg) => {
    const lastBar = updateBar(msg, barsBlob, historyBar);
    barsBlob.onRealtimeCallback(lastBar);
  });
});

export const loadCurrentBars = (action$, state$, { socket }) => action$.pipe(
  ofType(types.app.loadCurrentBars),
  rx.withLatestFrom(state$),
  rx.switchMap(([action]) => loadBars(action, socket)),
  rx.takeUntil(
    action$.pipe(
      ofType(types.app.unsubscribeCurrentBars),
      rx.switchMap(() => Observable.create(() => {
        socket.unsubscribeCurrentBars();
      })),
    ),
  ),
);
