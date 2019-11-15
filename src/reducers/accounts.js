import types from '../actions/types';

export const accounts = (state = {}, action) => {
  switch (action.type) {
    case types.state.setAccounts:
      return action.accounts.reduce((result, account) => {
        if (account.status === 'active') {
          result[account.id] = account.currency_id;
          return result;
        }

        return result;
      }, {});

    default:
      return state;
  }
};

export const selectAccounts = state => state.accounts;