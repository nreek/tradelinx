import types from './types';

export const setTrades = (trades, exchange) => ({
  type: types.state.setTrades,
  trades,
  exchange,
});

export const setAccounts = accounts => ({
  type: types.state.setAccounts,
  accounts,
});

export const updateBalances = balances => ({
  type: types.state.updateBalances,
  balances,
});

export const loadAccounts = () => ({
  type: types.app.loadAccounts,
});

export const loadBalances = () => ({
  type: types.app.loadBalances,
});

export const loadL2Data = instrument => ({
  type: types.app.loadL2Data,
  instrument,
});

export const loadInstruments = () => ({
  type: types.app.loadInstruments,
});

export const loadTickers = () => ({
  type: types.app.loadTickerData,
});

export const loadOrders = () => ({
  type: types.app.loadOrders,
});

export const loadOrderEvents = orderEventTimeStamp => ({
  type: types.app.loadOrderEvents,
  orderEventTimeStamp,
});

export const connectingQueueAdd = action => ({
  type: types.state.connectingQueueAdd,
  action,
});

export const connectingQueueReconnect = action => ({
  type: types.app.connectingQueueReconnect,
  action,
});

export const orderEventTimeStamp = orderEventTimeStamp => ({
  type: types.state.orderEventTimeStamp,
  orderEventTimeStamp,
});

export const orderEventsFinished = payload => ({
  type: types.state.orderEventsFinished,
  payload,
});

export const updateOrderEventTimeStamp = orderEventTimeStamp => ({
  type: types.state.updateOrderEventTimeStamp,
  orderEventTimeStamp,
});

export const loadProducts = () => ({
  type: types.app.loadProducts,
});

export const refreshOrderEvents = (events, exchange) => ({
  type: types.state.refreshOrderEvents,
  events,
  exchange,
});

export const newOrderEvents = (events, exchange) => ({
  type: types.state.newOrderEvents,
  events,
  exchange,
});

export const updateTickers = ticks => ({
  type: types.state.updateTickers,
  ticks,
});

export const refreshTickers = ticks => ({
  type: types.state.refreshTickers,
  ticks,
});

export const updateBook = (updates, exchange) => ({
  type: types.state.updateBook,
  updates,
  exchange,
});

export const refreshBook = (layers, exchange) => ({
  type: types.state.refreshBook,
  layers,
  exchange,
});

export const setInstruments = instruments => ({
  type: types.state.setInstruments,
  instruments,
});

export const changeInstrument = instrument => ({
  type: types.user.changeInstrument,
  instrument,
});

export const setFxBlueChartTimeFrame = timeFrame => ({
  type: types.user.setFxBlueChartTimeFrame,
  timeFrame,
});

export const loadSelectedFxBlueChartTimeFrame = () => ({
  type: types.user.loadSelectedFxBlueChartTimeFrame,
});

export const selectedFxBlueChartTimeFrame = timeFrame => ({
  type: types.user.selectedFxBlueChartTimeFrame,
  timeFrame,
});

export const setInstrument = (instrument, instrumentObj) => ({
  type: types.state.setInstrument,
  instrument,
  instrumentObj,
});

export const invalidInstrument = instrument => ({
  type: types.error.invalidInstrument,
  instrument,
});

export const setProducts = products => ({
  type: types.state.setProducts,
  products,
});

export const login = (username, password, verificationCode) => ({
  type: types.user.login,
  username,
  password,
  verificationCode,
});

export const autoConnect = () => ({
  type: types.app.autoConnect,
});

export const authPending = () => ({
  type: types.state.authPending,
});

export const authFailed = error => ({
  type: types.state.authFailed,
  error,
});

export const authSuccess = username => ({
  type: types.state.authSuccess,
  username,
});

export const authNone = () => ({
  type: types.state.authNone,
});

export const updateOrder = (order, exchange) => ({
  type: types.state.updateOrder,
  order,
  exchange,
});

export const placeOrder = order => ({
  type: types.user.placeOrder,
  order,
});

export const cancelOrder = orderId => ({
  type: types.user.cancelOrder,
  orderId,
});

export const cancelOrderSuccess = orderId => ({
  type: types.state.cancelOrderSuccess,
  orderId,
});

export const cancelOrderError = (message, statusCode) => ({
  type: types.state.cancelOrderError,
  message,
  statusCode,
});

export const logout = () => ({
  type: types.user.logout,
});

export const loadLocation = () => ({
  type: types.app.loadLocation,
});

export const setLocation = location => ({
  type: types.state.setLocation,
  location,
});

export const setLocationError = error => ({
  type: types.state.setLocationError,
  error,
});

export const setOrderPending = () => ({
  type: types.state.setOrderPending,
});

export const setOrderAccepted = id => ({
  type: types.state.setOrderAccepted,
  id,
});

export const setOrderRejected = (message, statusCode) => ({
  type: types.state.setOrderRejected,
  message,
  statusCode,
});

export const signup = signupData => ({
  type: types.user.signup,
  signupData,
});

export const signupPending = () => ({
  type: types.state.signupPending,
});

export const signupSuccess = signup => ({
  type: types.state.signupSuccess,
  signup,
});

export const signupError = error => ({
  type: types.state.signupError,
  error,
});

export const signupNone = () => ({
  type: types.state.signupNone,
});

export const signupNextStep = nextStep => ({
  type: types.state.signupNextStep,
  nextStep,
});

export const getProfileSchema = () => ({
  type: types.app.getProfileSchema,
});

// TODO: write tests for newProfile actions
export const minimalSchemaPending = () => ({
  type: types.state.minimalSchemaPending,
});

export const minimalSchemaSuccess = (properties, required) => ({
  type: types.state.minimalSchemaSuccess,
  properties,
  required,
});

export const minimalSchemaError = error => ({
  type: types.state.minimalSchemaError,
  error,
});

export const extendedSchemaPending = () => ({
  type: types.state.extendedSchemaPending,
});

export const extendedSchemaSuccess = (properties, required) => ({
  type: types.state.extendedSchemaSuccess,
  properties,
  required,
});

export const extendedSchemaError = error => ({
  type: types.state.extendedSchemaError,
  error,
});

export const resendVerification = email => ({
  type: types.user.resendVerification,
  email,
});

export const setResendVerificationStatus = status => ({
  type: types.state.setResendVerificationStatus,
  resendVerification: status,
});

export const makeDeposit = (product, amount = null) => ({
  type: types.user.makeDeposit,
  product,
  amount,
});

export const depositRequestPending = () => ({
  type: types.state.depositRequestPending,
});

export const depositRequestFailed = (message, statusCode) => ({
  type: types.state.depositRequestFailed,
  message,
  statusCode,
});

export const setDepositStatus = deposit => ({
  type: types.state.setDepositStatus,
  deposit,
});

export const makeWithdrawal = withdrawalRequest => ({
  type: types.user.makeWithdrawal,
  withdrawalRequest,
});

export const withdrawalRequestPending = () => ({
  type: types.state.withdrawalRequestPending,
});

export const withdrawalRequestFailed = (message, statusCode) => ({
  type: types.state.withdrawalRequestFailed,
  message,
  statusCode,
});

export const setWithdrawalStatus = withdrawal => ({
  type: types.state.setWithdrawalStatus,
  withdrawal,
});

export const loadHistory = (getBarsBlob, onHistoryCallback) => ({
  type: types.app.loadHistory,
  getBarsBlob,
  onHistoryCallback,
});

export const loadCurrentBars = getCurrentBarsBlob => ({
  type: types.app.loadCurrentBars,
  getCurrentBarsBlob,
});

export const unsubscribeCurrentBars = () => ({
  type: types.app.unsubscribeCurrentBars,
});

export const loadUserSettings = () => ({
  type: types.app.loadUserSettings,
});

export const setUserSettingsPending = () => ({
  type: types.state.setUserSettingsPending,
});

export const setUserSettings = settings => ({
  type: types.state.setUserSettings,
  settings,
});

export const setUserSettingsError = error => ({
  type: types.state.setUserSettingsError,
  error,
});

export const updateSettings = settings => ({
  type: types.user.updateSettings,
  settings,
});

export const setUpdateSettingsPending = () => ({
  type: types.state.setUpdateSettingsPending,
});

export const setUpdateSettingsAccepted = updatedSettings => ({
  type: types.state.setUpdateSettingsAccepted,
  updatedSettings,
});

export const setUpdateSettingsError = (error, code) => ({
  type: types.state.setUpdateSettingsError,
  error,
  code,
});

export const getSecretCode = () => ({
  type: types.user.getSecretCode,
});

export const setSecretCodePending = () => ({
  type: types.state.setSecretCodePending,
});

export const setSecretCode = secretCode => ({
  type: types.state.setSecretCode,
  secretCode,
});

export const setSecretCodeError = error => ({
  type: types.state.setSecretCodeError,
  error,
});

export const recreateSecretCode = secretCode => ({
  type: types.user.recreateSecretCode,
});

export const resetSecretCodePending = () => ({
  type: types.state.resetSecretCodePending,
});

export const resetSecretCode = secretCode => ({
  type: types.state.resetSecretCode,
  secretCode,
});

export const resetSecretCodeError = error => ({
  type: types.state.resetSecretCodeError,
  error,
});

export const uploadFiles = files => ({
  type: types.user.uploadFiles,
  files,
});

export const fileUploadPending = () => ({
  type: types.state.fileUploadPending,
});

export const fileUploadSuccess = () => ({
  type: types.state.fileUploadSuccess,
});

export const fileUploadFailed = () => ({
  type: types.state.fileUploadFiled,
});

export const defaultUploadFile = file => ({
  type: types.user.defaultUploadFile,
  file,
});

export const defaultUploadFilePending = () => ({
  type: types.state.defaultUploadFilePending,
});

export const defaultUploadFileSuccess = filename => ({
  type: types.state.defaultUploadFileSuccess,
  filename,
});

export const defaultUploadFileFailed = error => ({
  type: types.state.defaultUploadFileFailed,
  error,
});

export const updateKycStatus = () => ({
  type: types.app.updateKycStatus,
});

export const getKycStatus = () => ({
  type: types.app.getKycStatus,
});

export const kycStatusPending = () => ({
  type: types.state.kycStatusPending,
});

export const kycStatusSuccess = status => ({
  type: types.state.kycStatusSuccess,
  status,
});

// TODO: check this case
export const kycStatusFailed = error => ({
  type: types.state.kycStatusFailed,
  error,
});

export const kycRequestStatus = () => ({
  type: types.app.kycRequestStatus,
});

export const kycRequestPending = () => ({
  type: types.state.kycRequestPending,
});

export const kycRequestSuccess = status => ({
  type: types.state.kycRequestSuccess,
  status,
});

export const kycRequestFailed = error => ({
  type: types.state.kycRequestFailed,
  error,
});

export const getUserProfile = () => ({
  type: types.app.getUserProfile,
});

export const userProfilePending = () => ({
  type: types.state.userProfilePending,
});

export const userProfileSuccess = profile => ({
  type: types.state.userProfileSuccess,
  profile,
});

export const userProfileFailed = error => ({
  type: types.state.userProfileFailed,
  error,
});

export const updateUserProfile = kycFormDataPayload => ({
  type: types.app.updateUserProfile,
  kycFormDataPayload,
});

export const updateProfilePending = () => ({
  type: types.state.updateProfilePending,
});

export const updateProfileSuccess = profile => ({
  type: types.state.updateProfileSuccess,
  profile,
});

export const updateProfileFailed = error => ({
  type: types.state.updateProfileFailed,
  error,
});

export const loadTransactions = () => ({
  type: types.app.loadTransactions,
});

export const getTransactionsList = () => ({
  type: types.app.getTransactionsList,
});

export const getCompletedTransactionsList = data => ({
  type: types.app.getCompletedTransactionsList,
  data,
});

export const transactionsPending = () => ({
  type: types.state.transactionsPending,
});

export const transactionsSuccess = transactions => ({
  type: types.state.transactionsSuccess,
  transactions,
});

export const transactionsFailed = error => ({
  type: types.state.transactionsFailed,
  error,
});

export const completedTransactions = transactions => ({
  type: types.state.completedTransactions,
  transactions,
});

export const completedTransactionsFailed = error => ({
  type: types.state.completedTransactionsFailed,
  error,
});

export const setCurrentTransaction = transaction => ({
  type: types.state.setCurrentTransaction,
  transaction,
});

export const verifyUser = (resetFlow, hash, email) => ({
  type: types.app.verifyUser,
  hash,
  email,
  resetFlow,
});

export const verificationPending = () => ({
  type: types.state.verificationPending,
});

export const verificationSuccess = () => ({
  type: types.state.verificationSuccess,
});

export const verificationFailed = () => ({
  type: types.state.verificationFailed,
});

export const passwordResetRequest = email => ({
  type: types.user.passwordResetRequest,
  email,
});

export const passwordResetRequestPending = () => ({
  type: types.state.passwordResetRequestPending,
});

export const passwordResetRequestSuccess = () => ({
  type: types.state.passwordResetRequestSuccess,
});

export const passwordResetRequestFailed = errorMessage => ({
  type: types.state.passwordResetRequestFailed,
  errorMessage,
});

export const passwordResetCommit = (hash, newPassword) => ({
  type: types.user.passwordResetCommit,
  hash,
  newPassword,
});

export const passwordResetCommitPending = () => ({
  type: types.state.passwordResetCommitPending,
});

export const passwordResetCommitSuccess = () => ({
  type: types.state.passwordResetCommitSuccess,
});

export const passwordResetCommitFailed = error => ({
  type: types.state.passwordResetCommitFailed,
  error,
});

export const newPassword = passwordPayload => ({
  type: types.user.newPassword,
  passwordPayload,
});

export const newPasswordPending = () => ({
  type: types.state.newPasswordPending,
});

export const newPasswordSuccess = () => ({
  type: types.state.newPasswordSuccess,
});

export const newPasswordFailed = error => ({
  type: types.state.newPasswordFailed,
  error,
});
export const newPasswordNone = () => ({
  type: types.state.newPasswordNone,
});

export const changePasswordWithCode = passwordPayload => ({
  type: types.user.changePasswordWithCode,
  passwordPayload,
});

export const changePasswordWithCodePending = () => ({
  type: types.state.changePasswordWithCodePending,
});

export const changePasswordWithCodeSuccess = () => ({
  type: types.state.changePasswordWithCodeSuccess,
});

export const changePasswordWithCodeFailed = error => ({
  type: types.state.changePasswordWithCodeFailed,
  error,
});

export const passwordResetRequestVerify = () => ({
  type: types.state.passwordResetRequestVerify,
});

export const loadExchangeSettings = () => ({
  type: types.app.loadExchangeSettings,
});

export const exchangeSettingsPending = () => ({
  type: types.state.exchangeSettingsPending,
});

export const exchangeSettingsSuccess = settings => ({
  type: types.state.exchangeSettingsSuccess,
  settings,
});

export const exchangeSettingsFailed = error => ({
  type: types.state.exchangeSettingsFailed,
  error,
});

export const getFile = accessor => ({
  type: types.app.getFile,
  accessor,
});

export const filePending = () => ({
  type: types.state.filePending,
});

export const fileSuccess = file => ({
  type: types.state.fileSuccess,
  file,
});

export const fileFailed = error => ({
  type: types.state.fileFailed,
  error,
});

export const getCoinInfo = () => ({
  type: types.app.getCoinInfo,
});

export const coinInfoPending = () => ({
  type: types.state.coinInfoPending,
});

export const coinInfoSuccess = coinInfo => ({
  type: types.state.coinInfoSuccess,
  coinInfo,
});

export const coinInfoFailed = error => ({
  type: types.state.coinInfoFailed,
  error,
});

export const setTheme = theme => ({
  type: types.app.setTheme,
  theme,
});
export const setDisplayMobile = payload => ({
  type: types.state.setDisplayMobile,
  payload,
});
