import types from '../actions/types';
import { status } from '../constants/statuses';

export const deposit = (state = { request: status.pending }, action) => {
  switch (action.type) {
    case types.state.depositRequestPending:
      return { ...state, request: status.pending };

    case types.state.setDepositStatus:
      return { ...action.deposit, request: status.success };

    case types.state.depositRequestFailed:
      return {
        ...state,
        message: action.message,
        statusCode: action.statusCode,
        request: status.failed,
      };

    default:
      return state;
  }
};

export const selectDeposit = state => state.deposit;
