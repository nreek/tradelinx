import types from '../actions/types';
import { status } from '../constants/statuses';

export const fileUpload = (
  state = { status: status.none, getFile: { status: status.none } },
  action,
) => {
  switch (action.type) {
    case types.state.fileUploadPending:
      return { ...state, status: status.pending };

    case types.state.fileUploadSuccess:
      return { ...state, status: status.success };

    case types.state.fileUploadFailed:
      return { ...state, status: status.failed };

    default:
      return state;
  }
};
