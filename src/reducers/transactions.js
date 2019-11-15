import types from '../actions/types';
import { status } from '../constants/statuses';

export const transactions = (state = { status: status.pending, transactions: {} }, action) => {
  switch (action.type) {
    case types.state.transactionsPending:
      return { ...state, status: status.pending };

    case types.state.transactionsSuccess:
      return {
        ...state,
        status: status.success,
        list: [...action.transactions],
      };

    case types.state.transactionsFailed:
      return {
        ...state,
        status: status.failed,
        error: action.error,
      };

    case types.state.completedTransactions:
      return {
        ...state,
        status: status.success,
        completedStatus: status.success,
        completedList: [...action.transactions || []],
      };

    case types.state.completedTransactionsFailed:
      return {
        ...state,
        status: status.failed,
        error: action.error,
      };

    case types.state.setCurrentTransaction:
      state.list = (state.list || []).map((transaction) => { //TODO: don't modify state!
        if (transaction.id === action.transaction.id) {
          return action.transaction;
        }
        return transaction;
      }) || action.transaction;
      return {
        ...state,
        currentTransaction: action.transaction,
      };

    default:
      return state;
  }
};

export const selectCurrentTransaction = state => state.transactions.currentTransaction;
export const selectIncompleteTransactions = state => state.transactions.incomplete;
export const selectIncompleteStatus = state => state.transactions.incompleteStatus;
export const selectTransactions = state => [...(state.transactions.completedList || []), ...(state.transactions.list || [])].sort((a, b) => {
  if (a.timestamp < b.timestamp) return 1;
  if (a.timestamp > b.timestamp) return -1;
  return 0;
});