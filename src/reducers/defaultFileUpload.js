import types from '../actions/types';
import { status } from '../constants/statuses';

export const defaultFileUpload = (state = {status: 'NONE', filename: ''}, action) => {
  switch (action.type) {
    case types.state.defaultUploadFilePending:
      return { status: status.pending };
    case types.state.defaultUploadFileSuccess:
      return { status: status.success, filename: action.filename };
    case types.state.defaultUploadFileFailed:
      return { status: status.failed, error: action.error };

    default:
      return state;
  }
};

export const selectDefaultFileUploadStatus = state => state.defaultFileUpload;
export const selectDefaultFileUploadStatusError = state => selectDefaultFileUploadStatus(state).error;
export const getUploadedFile = state => state.defaultFileUpload.filename

export default defaultFileUpload;
