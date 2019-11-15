import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';

import { filePending, fileSuccess, fileFailed } from '../actions';
import types from '../actions/types';


export const getFile = (action$, state$, { restApi }) => action$.pipe(
  ofType(types.app.getFile),
  rx.switchMap(action => Observable.create((observer) => {
    observer.next(filePending());
    restApi.getFile(action.accessor)
      .then((response) => {
        if (response && response.status === 'success') {
          observer.next(fileSuccess(response.file));
        } else {
          observer.next(fileFailed(response && response.error ? response.error : _t('Unable to locate file.', 'API.UNABLE_TO_LOCATE_FILE')));
        }
      });
  })),
);

export default getFile;
