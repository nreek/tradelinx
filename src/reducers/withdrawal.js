import types from '../actions/types';
import { status } from '../constants';

export const withdrawal = (state = { request: status.pending }, action) => {
  switch (action.type) {
    case types.state.withdrawalRequestPending:
      return { request: status.pending };

    case types.state.setWithdrawalStatus:
      return { ...action.withdrawal, request: status.success };

    case types.state.withdrawalRequestFailed:
      return {
        message: action.message,
        statusCode: action.statusCode,
        request: status.failed,
      };

    default:
      return state;
  }
};

export const selectWithdrawal = state => state.withdrawal;
