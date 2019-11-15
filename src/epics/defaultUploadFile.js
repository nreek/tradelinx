import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';

import { defaultUploadFilePending, defaultUploadFileSuccess, defaultUploadFileFailed } from '../actions';
import types from '../actions/types';


export const defaultFileUpload = (action$, state$, { restApi }) => action$.pipe(
  ofType(types.user.defaultUploadFile),
  rx.switchMap(action => Observable.create((observer) => {
    observer.next(defaultUploadFilePending());
    restApi.uploadFile(action.file).then((response) => {
      if (response.status === 'success') {
        return response;
      }
      observer.next(defaultUploadFileFailed(response));
    }).then((response) => {
      observer.next(defaultUploadFileSuccess(response.filename));
    }).catch((error) => {
      observer.next(defaultUploadFileFailed(error));
    });
  })),
);

export default defaultFileUpload;
