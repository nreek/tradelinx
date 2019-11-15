import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';

import { fileUploadPending, fileUploadSuccess, fileUploadFailed } from '../actions';
import types from '../actions/types';


const uploadFiles = (action$, state$, { s3RestApi }) => action$.pipe(
  ofType(types.user.uploadFiles),
  rx.switchMap(action => Observable.create((observer) => {
    observer.next(fileUploadPending());
    s3RestApi
      .uploadFiles(action.files)
      .then(() => {
        observer.next(fileUploadSuccess());
      })
      .catch((error) => {
        observer.next(fileUploadFailed(error));
        console.error(error);
      });
  })),
);

export default uploadFiles;
