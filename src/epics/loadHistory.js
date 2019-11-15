import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';

import types from '../actions/types';
import { historicalBarsRequestDto } from '../api/dataTypes';
import { getResolution } from '../util/helpers';
import { connectingQueueAdd } from '../actions';

export const history = {};

const loadHistory = (action$, state$, { socket }) => action$.pipe(
  ofType(types.app.loadHistory),
  rx.switchMap((action) => Observable.create((observer) => {
    observer.next(connectingQueueAdd(action));
    const { getBarsBlob } = action;
    const { onHistoryCallback } = action;
    const periodicity = getResolution(getBarsBlob.resolution);

    const splitSymbol = getBarsBlob.symbolInfo.name.split(/[/]/);
    const [base, quote] = splitSymbol;

    const dataHistory = { ...historicalBarsRequestDto };
    dataHistory.security_id = `${base}${quote}`;
    dataHistory.periodicity = periodicity;
    dataHistory.start_time = getBarsBlob.from * 1000;
    dataHistory.end_time = getBarsBlob.to * 1000;

    socket
      .historicalBars(dataHistory)
      .then((data) => {
        if (data.length) {
          const bars = data.map((el) => {
            const closeAsk = parseFloat(el.close_ask);
            const closeBid = parseFloat(el.close_bid);
            const highAsk = parseFloat(el.high_ask);
            const highBid = parseFloat(el.high_bid);
            const lowAsk = parseFloat(el.low_ask);
            const lowBid = parseFloat(el.low_bid);
            const openAsk = parseFloat(el.open_ask);
            const openBid = parseFloat(el.open_bid);

            return {
              close: (closeAsk + closeBid) / 2,
              high: (highAsk + highBid) / 2,
              low: (lowAsk + lowBid) / 2,
              open: (openAsk + openBid) / 2,
              time: el.timestamp,
            };
          });
          if (getBarsBlob.firstDataRequest) {
            const lastBar = bars[bars.length - 1];
            history[getBarsBlob.symbolInfo.name] = { lastBar };
          }
          if (bars.length) {
            onHistoryCallback(bars, { noData: false });
          } else {
            onHistoryCallback(bars, { noData: true });
          }
        }
      })
      .catch((err) => {
        getBarsBlob.onErrorCallback(err);
      });
  })),
);

export default loadHistory;
