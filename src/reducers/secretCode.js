import types from '../actions/types';

export const secretCode = (state = {}, action) => {
  switch (action.type) {
    case types.state.setSecretCodePending:
      return { status: 'pending' };

    case types.state.setSecretCode:
      return { ...action.secretCode, status: 'success' };

    case types.state.setSecretCodeError:
      return { ...action.error, status: 'error' };

    case types.state.resetSecretCodePending:
      return { status: 'pending' };

    case types.state.resetSecretCode:
      return { ...action.secretCode, status: 'success' };

    case types.state.resetSecretCodeError:
      return { ...action.error, status: 'error' };

    default:
      return state;
  }
};
