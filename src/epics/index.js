import { combineEpics } from 'redux-observable';
import { autoConnect, login } from './login';
import { loadL2Data, changeL2Data } from './l2Data';
import loadInstruments from './loadInstruments';
import loadProducts from './loadProducts';
import loadBalances from './loadBalances';
import loadOrders from './loadOrders';
import loadOrderEvents from './loadOrderEvents';
import loadTickers from './loadTickers';
import loadAccounts from './loadAccounts';
import changeInstrument from './changeInstrument';
import setFxBlueChartTimeFrame from './setFxBlueChartTimeFrame';
import loadSelectedFxBlueChartTimeFrame from './loadSelectedFxBlueChartTimeFrame';
import placeOrder from './placeOrder';
import cancelOrder from './cancelOrder';
import logout from './logout';
import loadLocation from './loadLocation';
import signup from './signup';
import getProfileSchema from './getProfileSchema';
import resendVerification from './resendVerification';
import makeDeposit from './makeDeposit';
import makeWithdrawal from './makeWithdrawal';
import updateSettings from './updateSettings';
import getSecretCode from './getSecretCode';
import recreateSecretCode from './recreateSecretCode';
import uploadFiles from './uploadFiles';
import { getKycStatus, updateKycStatus, kycRequestStatus } from './getKycStatus';
import getCoinInfoData from './getCoinInfoData';
import getUserProfile from './getUserProfile';
import loadUserSettings from './loadUserSettings';
import { getTransactionsList, loadTransactions, getCompletedTransactionsList } from './loadTransactions';
import verifyUser from './verifyUser';
import { passwordResetRequest, passwordResetCommit } from './passwordResetRequest';
import changePassword from './changePassword';
import loadExchangeSettings from './loadExchangeSettings';
import updateProfile from './updateProfile';
import defaultUploadFile from './defaultUploadFile';
import getFile from './getFile';
import { loadCurrentBars } from './loadCurrentBars';
import loadHistory from './loadHistory';
import changePasswordWithCode from './changePasswordWithCode';
import { connectingQueue } from './connectingQueue';
//import maintenanceModeEnabled from './maintenanceMode';
//import maintenanceMessageEnabled from './maintenanceMessage';

export default combineEpics(
  autoConnect,
  login,
  loadLocation,
  loadInstruments,
  loadBalances,
  loadL2Data,
  loadOrders,
  loadOrderEvents,
  loadTickers,
  loadAccounts,
  loadProducts,
  changeL2Data,
  changeInstrument,
  setFxBlueChartTimeFrame,
  loadSelectedFxBlueChartTimeFrame,
  placeOrder,
  cancelOrder,
  logout,
  signup,
  resendVerification,
  makeDeposit,
  makeWithdrawal,
  updateSettings,
  getSecretCode,
  recreateSecretCode,
  uploadFiles,
  getProfileSchema,
  getKycStatus,
  updateKycStatus,
  kycRequestStatus,
  loadUserSettings,
  getUserProfile,
  getTransactionsList,
  getCompletedTransactionsList,
  loadTransactions,
  verifyUser,
  passwordResetRequest,
  passwordResetCommit,
  changePassword,
  loadExchangeSettings,
  updateProfile,
  defaultUploadFile,
  getFile,
  loadCurrentBars,
  loadHistory,
  getCoinInfoData,
  changePasswordWithCode,
  connectingQueue,
  //maintenanceModeEnabled,
  //maintenanceMessageEnabled,
);
