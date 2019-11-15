import maintenanceMode from './maintenanceMode';
import authConfig from './auth';

const appConfig = {
  maintenanceMode,
  authConfig,
  apiHost: "test.shiftmarkets.com",
  apiVersion: "v1",
  apiUseSsl: true,
  debug: {
    jsError: false,
    apiLog: false,
  },
  exchange: "SSHIFTFX",
  siteName: "Cointrader",
  defaultSiteTheme: 'v3', //light || dark || v3
  baseCurrency: 'USD',
  chartConfig: {
    candleStickChart: 'TV_EXTERNAL_DATA',
    TVProvider: 'Coinbase',
    hideTVLegend: true,
    theme: "Dark",
    clientId: 'oms-d-demo', // Need for fx blue chart
    debug: false,
    defaultProps: {
      symbol: 'Coinbase:MPC/USD',
      interval: '15',
      containerId: 'tv_chart_container',
      libraryPath: `${process.env.NODE_ENV == 'development' ? '/src/lib/charting_library/' : '/lib/charting_library/'}`,
      chartsStorageUrl: 'https://saveload.tradingview.com',
      chartsStorageApiVersion: '1.1',
      clientId: 'tradingview.com',
      userId: 'public_user_id',
      fullscreen: false,
      autosize: true,
      studiesOverrides: {}
    },
    disabled_features: [
      'left_toolbar', 'timeframes_toolbar', 'header_screenshot',
      'context_menus', 'header_settings', 'compare_symbol', 'header_symbol_search',
      'symbol_info', 'header_compare', 'header_undo_redo', 'header_indicators',
      'edit_buttons_in_legend', 'header_saveload', 'show_hide_button_in_legend',
      'create_volume_indicator_by_default'
    ],
    enabled_features: ['hide_last_na_study_output','disable_resolution_rebuild']
  },

  geoLookup: {
    token: '421aa90e079fa326b6494f812ad13e79'
    // blacklistCountries: ['UK'], // takes an array of restricted countries
  },

  defaultDecimals: { fiat: 2, crypto: 8 },
  minimalLengthWalletAddress: 12,
  products: {
    USD: {
      decimals: 2
    },
    BTC: {
      decimals: 8
    },
    ETH: {
      decimals: 8
    },
    LTC: {
      decimals: 8
    },
    MPC: {
      decimals: 8
    },
    XRP: {
      decimals: 6
    },
    BCH: {
      decimals: 8
    },
    XMR: {
      decimals: 12
    },
    GBP: {
      decimals: 2
    }
  },
  tradeUi: {
    dropdownInstrumentSelect: true, // Enables the dropdown instrument select
    orderTableRows: 10, // Sets the number of rows in the order tables
    mobileInitialComponent: "Trade" // Sets the initial component displayed in mobile view
  },
  simpleUi: {
    maxTableRows: {
      currentBalances: 8,
      recentTransactions: 10,
      accountHistory: 8
    }
  },
  excludedProducts: [], // Exclude products
  excludedInstruments: [], // Exclude instruments
  sortProducts: ["MPC", "USD"], // Order of products

  buySellAmounts: {
    ETHBTC: [0.01, 0.02, 0.05, 0.1],
    MPCBTC: [0.01, 0.02, 0.05, 0.1],
    XMRBTC: [0.01, 0.02, 0.05, 0.1],
    XRPBTC: [0.01, 0.02, 0.05, 0.1],
    BCHBTC: [0.01, 0.02, 0.05, 0.1],
    LTCBTC: [0.01, 0.02, 0.05, 0.1],
    DASHBTC: [0.01, 0.02, 0.05, 0.1],
    ETCBTC: [0.01, 0.02, 0.05, 0.1],
    BTCUSD: [100, 200, 500, 1000],
    ETCUSD: [100, 200, 500, 1000],
    ETHUSD: [100, 200, 500, 1000],
    MPCUSD: [100, 200, 500, 1000],
    MPCUSDC: [100, 200, 500, 1000],
    DASHUSD: [100, 200, 500, 1000],
    XRPEUR: [100, 200, 500, 1000],
    NEOBTC: [0.01, 0.02, 0.05, 0.1],
    IOTBTC: [0.01, 0.02, 0.05, 0.1],
    OMGBTC: [0.01, 0.02, 0.05, 0.1],
    ZECBTC: [0.01, 0.02, 0.05, 0.1],
    IOTABTC: [0.01, 0.02, 0.05, 0.1],
    IOTAUSD: [100, 200, 500, 1000],
    IOTAETH: [0.1, 0.2, 0.5, 1],
    IOTAMPC: [0.1, 0.2, 0.5, 1],
    XRPUSD: [100, 200, 500, 1000],
    LTCUSD: [100, 200, 500, 1000],
    BCHUSD: [100, 200, 500, 1000],
    BTCJPY: [100, 200, 500, 1000],
    LTCPHP: [100, 200, 500, 1000],
    BCHUSDC: [100, 200, 500, 1000],
    XLMUSDC: [100, 200, 500, 1000],
    BTCGBP: [100, 200, 500, 1000],
    HBZUSD: [0.01, 0.02, 0.05, 0.1],
    ZECBTC: [0.01, 0.02, 0.05, 0.1],
    XLMBTC: [0.01, 0.02, 0.05, 0.1],
    HBZBTC: [0.01, 0.02, 0.05, 0.1],
    HBZETH: [0.01, 0.02, 0.05, 0.1],
    HBZMPC: [0.01, 0.02, 0.05, 0.1],
    XLMPHP: [0.01, 0.02, 0.05, 0.1],
    BTCPHP: [100, 200, 500, 1000],
    ETHEUR: [100, 200, 500, 1000],
    MPCEUR: [100, 200, 500, 1000],
    XLMUSDC: [100, 200, 500, 1000],
    ETHUSDC: [100, 200, 500, 1000],
    MPCUSDC: [100, 200, 500, 1000],
    XRPUSDC: [100, 200, 500, 1000],
    BTCUSDC: [100, 200, 500, 1000],
    BCHPHP: [100, 200, 500, 1000],
    BTCEUR: [100, 200, 500, 1000],
    ZECUSD: [100, 200, 500, 1000],
    XLMUSD: [100, 200, 500, 1000],
    LTCUSDC: [100, 200, 500, 1000],
    XRPPHP: [100, 200, 500, 1000],
    ETHPHP: [100, 200, 500, 1000],
    MPCPHP: [100, 200, 500, 1000]
  },
  defaultInstrument: "MPCUSD",
  defaultProduct: 'MPC',
  dateFormat: "MMMM DD, YYYY", // e.g. 'MM', 'DD', 'YY', 'YYYY', SEE moment.js FOR MORE OPTIONS
  timeFormat: "12hr", // '24hr' or '12hr'
  illegalWalletAddresses: [], // Here we can add custom list of wallet addresses
  feeAmount: 15, // float in basis points
  lang: {
    default: "en-us",
    items: {
      "en-us": "English (US)",
    }
  },
  excludeDeposit: [], // Exclude Deposit product for those products (my account page)
  excludeWithdraw: [], // Exclude Withdraw product for those products (my account page)
  affiliatePrograms: {
    enabled: true,
    items: ["dev-ellex.shiftcrypto-qa.com"]
  },
  reCaptcha: {
    key: '6LeFaFkUAAAAAJVL3BuBTdv9kT2Hk2fJTKlodoXm',
    theme: 'dark', // dark/light
  },
  documentUploads: [
    { name: 'Photo ID' }
  ],
  // DragonGlass
//   routes: [
//     { path: '/', component: 'Main', exact: true },
//     { path: '/signup', component: 'StandardSignup' },
//     { path: '/login', component: 'StandardLogin' },
//     { path: '/home', component: 'StandardHome', requiresAuth: true },
//     { path: '/trade', component: 'StandardTrade', requiresAuth: true },
//     { path: '/wallet', component: 'StandardWallet', requiresAuth: true },
//     { path: '/settings', component: 'StandardSettings', requiresAuth: true },
//     { path: '/buy-sell', component: 'BuySell', requiresAuth: true },
//     { path: '/buy-sell-custom', component: 'BuySellCustom', requiresAuth: true },
//     { path: '/my-accounts', component: 'MyAccounts', requiresAuth: true },
//     { path: '/kyc', component: 'StandardKYC', requiresAuth: true },
//     { path: '/help', component: 'Help', requiresAuth: true },
//     { path: '/privacy', component: 'Privacy' },
//     { path: '/terms', component: 'Terms' },
//     { path: '/verification', component: 'Verification' },
//     { path: '/password-reset', component: 'PasswordReset' },
//     { component: 'Page404' }
//   ],
  // V3
   routes: [
     { path: '/', component: 'Main', exact: true },//
     { path: '/signup', component: 'StandardSignup' },//
     { path: '/login', component: 'StandardLogin' },//
     { path: '/home', component: 'Home', requiresAuth: true },//
     { path: '/wallet', component: 'StandardWallet', requiresAuth: true },
     { path: '/settings', component: 'Settings', requiresAuth: true },//
     { path: '/buy-sell', component: 'BuySell', requiresAuth: true },//
     { path: '/buy-sell-custom', component: 'BuySellCustom', requiresAuth: true },//
     { path: '/my-accounts', component: 'MyAccounts', requiresAuth: true },//
     { path: '/trade', component: 'TradeUI', requiresAuth: true },//
     { path: '/kyc', component: 'StandardKYC', requiresAuth: true },
     { path: '/help', component: 'Help', requiresAuth: true },//
     { path: '/privacy', component: 'Privacy' },//
     { path: '/terms', component: 'Terms' },//
     { path: '/verification', component: 'Verification' },
     { path: '/password-reset', component: 'PasswordReset' },
     { component: 'Page404' }//
   ],


};

export default appConfig;
