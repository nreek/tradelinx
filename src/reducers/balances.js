import types from '../actions/types';
import config from '../../config/config';

export const balances = (state = { total: undefined }, action) => {
  switch (action.type) {
    case types.state.setAccounts:
      return action.accounts.reduce((result, account) => {
        if (account.status === 'active' && !config.excludedProducts.includes(account.currency_id)){
          result[account.currency_id] = {
            total: account.balance,
            trading: account.available_for_trading,
            withdrawal: account.available_for_withdrawal,
          };
          return result;
        }

        return result;
      }, {});

    case types.state.updateBalances: {
      const newState = { ...state };
      action.balances.forEach((balance) => {
        newState[balance.currency] = {
          total: balance.balance,
          trading: balance.available_for_trading,
          withdrawal: balance.available_for_withdrawal,
        };
      });
      return newState;
    }

    default:
      return state;
  }
};

export const selectBalances = state => state.balances;