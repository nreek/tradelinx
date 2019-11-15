import configureStore from './src/configureStore';
import renderReact from './src/renderReact';
import { autoConnect, loadLocation } from './src/actions';
import initiateGlobals from './src/util/globals';
import config from './config/config';
import TraderSocket from './src/api/appTraderSocket';
import ManagerSocket from './src/api/appManagerSocket';
import SocketHelper from './src/api/appSocketHelper';
import Auth from './src/api/appAuth';
import RestApi from './src/api/appRestApi';
import S3RestApi from './src/api/s3RestApi';
import './scss/styles.scss';

const { debug = {} } = config;

initiateGlobals();

const auth = new Auth(config.apiHost, config.apiUseSsl);
const socketHelper = new SocketHelper(auth, config.apiHost, config.apiUseSsl, config.apiVersion, debug.apiLog, 'websocket');
const managerSocketHelper = new SocketHelper(auth, config.apiHost, config.apiUseSsl, config.apiVersion, debug.apiLog, 'websocket-manager');
const restApi = new RestApi(auth, config.apiHost, config.apiUseSsl);

const traderSocket = new TraderSocket(socketHelper);
const managerSocket = new ManagerSocket(managerSocketHelper);

const s3RestApi = new S3RestApi();

const store = configureStore(
  traderSocket,
  managerSocket,
  auth,
  restApi,
  s3RestApi,
  config,
);

store.dispatch(loadLocation());
store.dispatch(autoConnect());
renderReact(store);
