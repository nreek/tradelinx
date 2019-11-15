import { combineReducers } from 'redux';
import * as allReducers from './export';

const reducersToBeCombined = {
  exchange: allReducers.exchange,
  orderbook: allReducers.orderbook,
  orders: allReducers.orders,
  orderEvents: allReducers.orderEvents,
  trades: allReducers.trades,
  tickers: allReducers.tickers,
  instruments: allReducers.instruments,
  selectedInstrument: allReducers.selectedInstrument,
  accounts: allReducers.accounts,
  balances: allReducers.balances,
  user: allReducers.user,
  config: allReducers.config,
  orderStatus: allReducers.orderStatus,
  deposit: allReducers.deposit,
  withdrawal: allReducers.withdrawal,
  settings: allReducers.settings,
  cancelOrderStatus: allReducers.cancelOrderStatus,
  secretCode: allReducers.secretCode,
  products: allReducers.products,
  fileUpload: allReducers.fileUpload,
  transactions: allReducers.transactions,
  exchangeSettings: allReducers.exchangeSettings,
  selectedFxBlueChartTimeframe: allReducers.selectedFxBlueChartTimeframe,
  setFxBlueChartTimeFrame: allReducers.setFxBlueChartTimeFrame,
  defaultFileUpload: allReducers.defaultFileUpload,
  file: allReducers.file,
  maintenanceMode: allReducers.maintenanceMode,
  maintenanceMessage: allReducers.maintenanceMessage,
  connectingQueue: allReducers.connectingQueue,
  siteTheme: allReducers.setTheme,
  displayMobile: allReducers.displayMobile,
  coinInfo: allReducers.coinInfo,
};

export * from './export'

export default combineReducers({...reducersToBeCombined});
