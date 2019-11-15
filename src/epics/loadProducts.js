import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';
import { setProducts } from '../actions';
import types from '../actions/types';


const loadProducts = (action$, state$, { socket }) => action$.pipe(
  ofType(types.app.loadProducts),
  rx.throttleTime(60000), // Only load instruments once per minute max
  rx.withLatestFrom(state$),
  rx.switchMap(([, state]) => Observable.create((observer) => {
    socket.currencies().then((securities) => {
      const exchangeSecurities = securities.reduce((result, security) => {
        const { products } = state.config;
        const configProduct = products[security.id];
        const { defaultDecimals } = state.config;
        if (!state.config.excludedProducts.includes(security.id)) {
          result.push(Object.assign({
            id: security.id,
            type: security.type,
            name: security.name,
            precision: security.precision,
            withdrawalCommission: security.withdrawal_commission,
            depositCommission: security.deposit_commission,
            decimals: configProduct && configProduct.decimals
              ? configProduct.decimals
              : defaultDecimals[security.type],
          }, (state.config.products[security.id] || {})));

          // Add product to the end of the sort list
          if (!state.config.sortProducts.includes(security.id)) {
            state.config.sortProducts.push(security.id);
          }
        }
        return result;
      }, []);

      // Sort products by array of products id
      exchangeSecurities.sort((a, b) => {
        const aPos = state.config.sortProducts.indexOf(a.id);
        const bPos = state.config.sortProducts.indexOf(b.id);

        if (aPos > bPos) {
          return 1;
        } if (aPos < bPos) {
          return -1;
        }

        return 0;
      });

      observer.next(setProducts(exchangeSecurities));
    });
  })),
);

export default loadProducts;
