import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import ReactApp from './ReactApp';

const renderReact = (store) => {
  ReactDOM.render(
    <Provider store={store}>
      <ReactApp />
    </Provider>,
    document.querySelector('#root-container'),
  );
};

export default renderReact;
