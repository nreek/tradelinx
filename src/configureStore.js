import { composeWithDevTools } from 'redux-devtools-extension'; // TODO: make conditional to dev build?
import { applyMiddleware, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import rootReducer from './reducers';
import rootEpic from './epics';


const configureStore = (
  socket,
  managerSocket,
  auth,
  restApi,
  s3RestApi,
  config,
) => {
  const preloadedState = {
    exchange: config.exchange,
    orderbook: undefined,
    tickers: undefined,
    instruments: undefined,
    selectedInstrument: undefined,
    selectedFxBlueChartTimeframe: undefined,
    config,
    siteTheme: config.defaultSiteTheme
  };
  const epicsMiddleware = createEpicMiddleware({
    dependencies: {
      socket,
      managerSocket,
      auth,
      restApi,
      s3RestApi,
    },
  });
  const store = createStore(
    rootReducer,
    preloadedState,
    composeWithDevTools(
      applyMiddleware(
        epicsMiddleware,
      ),
    ),
  );
  epicsMiddleware.run(rootEpic);
  return store;
};

export default configureStore;
