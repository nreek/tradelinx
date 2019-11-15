import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import Highcharts from 'highcharts/js/highcharts'; // use this for styling via CSS
import { ofType } from 'redux-observable';
import { ecoChartOptions } from '../../config/chart-config';
import {
  getCoinInfo, coinInfoPending, coinInfoSuccess, coinInfoFailed,
} from '../actions';
import types from '../actions/types';

const getCoinInfoData = (action$, state$) => action$.pipe(
  ofType(types.app.getCoinInfo),
  rx.withLatestFrom(state$),
  rx.switchMap(([action, state]) => Observable.create((observer) => {
    const tiApiKey = 3195;
    observer.next(coinInfoPending());
    // TODO: Enable changing language in below URL
    if(state.selectedInstrument.base)
    fetch(
      `https://global.tokeninsight.cn/api/user/web/getCoinLevel?tokeninsightId=${
        state.selectedInstrument.base
      }&language=en&sourceId=${tiApiKey}`)
      .then(resp => resp.json())
      .then((x) => {
        if (x.code === 30) {
          observer.next(coinInfoSuccess(x.data));
          Highcharts.chart('eco-chart-id', ecoChartOptions(x.data));
        } else {
          observer.next(coinInfoFailed());
        }
      });
  })),
);

export default getCoinInfoData;
