import types from '../actions/types';

export const products = (state = {}, action) => {
  switch (action.type) {
    case types.state.setProducts:
      return action.products.reduce((result, product) => {
        result[product.id] = product;
        return result;
      }, {});

    default:
      return state;
  }
};

export const selectProducts = state => state.products;
export const selectBaseCurrency = state => state.config.baseCurrency;