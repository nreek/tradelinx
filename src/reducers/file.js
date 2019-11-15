import types from '../actions/types';
import { status } from '../constants/statuses';

export const file = (
  state = { status: status.none, getFile: { status: status.none } },
  action,
) => {
  switch (action.type) {
    case types.state.filePending:
      return { status: status.pending };

    case types.state.fileSuccess:
      return { status: status.success, value: action.file };

    case types.state.fileFailed:
      return { status: status.failed, error: action.error };

    default:
      return state;
  }
};

export const selectFile = state => state.file;
