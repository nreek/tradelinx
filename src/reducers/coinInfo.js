import types from '../actions/types';

export const status = {
  pending: 'PENDING',
  success: 'SUCCESS',
  failed: 'FAILED',
  none: 'NONE',
};

export const coinInfo = (
  state = {
    status: status.none,
  },
  action,
) => {
  switch (action.type) {
    case types.state.coinInfoPending:
      return { ...state, status: status.pending };

    case types.state.coinInfoSuccess:
      return {
        ...state,
        ...action.coinInfo,
        status: status.success,
      };

    case types.state.coinInfoFailed:
      return { ...state, status: status.failed };

    default:
      return state;
  }
};

export default coinInfo;

export const selectCoinInfoStatus = state => state.coinInfo.status;

export const selectCoinInfo = state => state.coinInfo;
