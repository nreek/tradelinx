import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';

import { setInstruments, setInstrument } from '../actions';
import types from '../actions/types';
import { selectExchange } from '../reducers';


// Helper function:
export const tickDecimals = (ticksString) => {
  const defaultDecimals = 2;
  if (!ticksString) {
    return defaultDecimals;
  }
  const parts = ticksString.split('.');
  if (parts.length !== 2) {
    return defaultDecimals;
  }
  return parts[1].length;
};

const loadInstruments = (action$, state$, { socket }) => action$.pipe(
  ofType(types.app.loadInstruments),
  rx.throttleTime(60000), // Only load instruments once per minute max
  rx.withLatestFrom(state$),
  rx.switchMap(([, state]) => Observable.create((observer) => {
    const exchange = selectExchange(state);
    socket.securities().then((securities) => {
      const exchangeSecurities = securities.reduce((result, security) => {
        const { excludedInstruments = [] } = state.config;
        const {
          available_destinations = [],
          type,
          id,
          base_currency,
          term_currency,
          tick_size,
          minimum_quantity,
          maximum_quantity,
          quantity_increment,
          buyer_commission_method,
          buyer_maker_commission_progressive,
          buyer_taker_commission_progressive,
          seller_commission_method,
          seller_maker_commission_progressive,
          seller_taker_commission_progressive,
        } = security;
        if (
          type === 'crypto'
          && available_destinations.includes(exchange)
          && !excludedInstruments.includes(id)
        ) {
          result.push({
            id,
            minimumQuantity: +minimum_quantity,
            maximumQuantity: +maximum_quantity,
            base: base_currency,
            quote: term_currency,
            quoteDecimals: tickDecimals(tick_size), // TODO: is tick_size actually quote decimals??
            quantityDecimals: tickDecimals(quantity_increment),
            // TODO: can we get base decimals?
            type,
            quantityIncrement: +quantity_increment,
            fees: {
              buy: {
                method: buyer_commission_method,
                maker: buyer_maker_commission_progressive,
                taker: buyer_taker_commission_progressive,
              },
              sell: {
                method: seller_commission_method,
                maker: seller_maker_commission_progressive,
                taker: seller_taker_commission_progressive,
              },
            },
          });
        }
        return result;
      }, []);
      observer.next(setInstruments(exchangeSecurities));

      const selectedInstrument = JSON.parse(window.sessionStorage.getItem('selectedInstrument'));

      let instrument;
      if (
        selectedInstrument
                && exchangeSecurities.some(security => security.id === selectedInstrument.id)
      ) {
        instrument = selectedInstrument;
      } else if (
        state.config.defaultInstrument
        && exchangeSecurities.some(security => security.id === state.config.defaultInstrument)
      ) {
        instrument = exchangeSecurities.find(
          security => security.id === state.config.defaultInstrument,
        );
      } else {
        instrument = exchangeSecurities[0];
      }

      observer.next(setInstrument(instrument.id, instrument));
    });
  })),
);

export default loadInstruments;
