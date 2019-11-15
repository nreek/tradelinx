import AppSocketHelper from './appSocketHelper';
import config from '../../config/config';

let undefined;

class AppTraderSocket {
  constructor(socketHelper) {
    // Endpoint definitions:
    // Subscription endpoints:
    const subscribeL2 = security => socketHelper.subscribeToEndpointTemplate(`market-data/${security}`);
    const subscribeCurrentBars = (security, periodicity) => socketHelper.subscribeToEndpointTemplate(`current-bars/${security}/${periodicity}`);
    const subscribeOrders = socketHelper.subscribeToEndpointTemplate('orders');
    const subscribeBalances = socketHelper.subscribeToEndpointTemplate('balances');
    const subscribeTime = socketHelper.subscribeToEndpointTemplate('time');
    const subscribeSecuritiesStats = socketHelper.subscribeToEndpointTemplate('securities/statistics');

    // Send/Receive data endpoints:
    const currency = currencyId => socketHelper.sendToEndpointTemplate(`currencies/${currencyId}`);
    const security = securityId => socketHelper.sendToEndpointTemplate(`securities/${securityId}`);
    const trades = securityId => socketHelper.sendToEndpointTemplate(`trades/${securityId}`);
    const orderEvents = socketHelper.sendToEndpointTemplate('orders/events');
    const createOrder = socketHelper.sendToEndpointTemplate('orders/create');
    const modifyOrder = socketHelper.sendToEndpointTemplate('orders/modify');
    const cancelOrder = socketHelper.sendToEndpointTemplate('orders/cancel');
    const securities = socketHelper.sendToEndpointTemplate('securities');
    const accounts = socketHelper.sendToEndpointTemplate('accounts');
    const currencies = socketHelper.sendToEndpointTemplate('currencies');
    const historicalBars = socketHelper.sendToEndpointTemplate('historical-bars');
    const secretCode = socketHelper.sendToEndpointTemplate('user/secret-code/get');
    const resendSecretCode = socketHelper.sendToEndpointTemplate('user/secret-code/recreate');
    const settings = socketHelper.sendToEndpointTemplate('user/settings/get');
    const modifySettings = socketHelper.sendToEndpointTemplate('user/settings/modify');
    const globalSettings = socketHelper.sendToEndpointTemplate('global/settings');


    this.connect = (tokens, connectCallback) => socketHelper.connect(tokens, connectCallback);
    this.disconnect = () => socketHelper.disconnect();

    let l2Subscription = undefined;
    this.unsubscribeL2 = () => AppSocketHelper.unsubscribe(l2Subscription);

    // Subscription functions take an onMessage handler function: TODO: do we really want them to return a promise?
    this.subscribeL2 = (security, onMessage) => {
      AppSocketHelper.unsubscribe(l2Subscription); // First unsubscribe if applicable
      l2Subscription = subscribeL2(security)(onMessage);
      return l2Subscription;
    };

    let loadBars = undefined;
    this.unsubscribeCurrentBars = () => AppSocketHelper.unsubscribe(loadBars);
    this.subscribeCurrentBars = (security, periodicity, onMessage) => {
      AppSocketHelper.unsubscribe(loadBars);
      loadBars = subscribeCurrentBars(security, periodicity)(onMessage);
      return loadBars;
    };
    this.subscribeOrders = onMessage => subscribeOrders(onMessage);
    this.subscribeBalances = onMessage => subscribeBalances(onMessage);
    this.subscribeTime = onMessage => subscribeTime(onMessage);
    this.subscribeSecuritiesStats = onMessage => subscribeSecuritiesStats(onMessage); // This is a ticker for all securities


    // Following functions return Deferred that resolves to returned data when available:
    this.createOrder = newOrder => createOrder({}, newOrder);
    this.modifyOrder = (orderId, newOrder) => modifyOrder({ 'X-Deltix-Order-ID': orderId }, newOrder);
    this.cancelOrder = (orderId, clientOrderId) => cancelOrder({
      'X-Deltix-Order-ID': orderId, 'X-Deltix-Client-Order-ID': clientOrderId,
    });
    this.orderEvents = orderEventsRequest => orderEvents({}, orderEventsRequest);
    this.currency = currencyId => currency(currencyId)();
    this.security = securityId => security(securityId)();
    this.trades = securityId => trades(securityId)();
    this.historicalBars = historicalBarsRequest => historicalBars({}, historicalBarsRequest);
    this.securities = () => securities();
    this.accounts = () => accounts();
    this.currencies = () => currencies();

    this.secretCode = () => secretCode({ 'X-Forwarded-Host': config.siteName });
    this.resendSecretCode = () => resendSecretCode({ 'X-Forwarded-Host': config.siteName });
    this.settings = () => settings();
    this.modifySettings = settings => modifySettings({}, settings);
    this.globalSettings = () => globalSettings();
  }
}

export default AppTraderSocket;
