const authConfig = {
  provider: 'Cognito', // Either: Exchange or Cognito or ClientCookie
  providerConfig: {
    exchangeName: 'SHIFTUAT',

    // Staging
    host: 'test.shiftmarkets.com',
    authServiceUrl: 'https://authentication-staging.cryptosrvc.com/api',
    region: 'us-east-1',
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'us-east-1_pqjVLeZgH',
    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '48lu4b1kf8058qp3qp4o71kquc',

    // cookieStorage: {
    //   // REQUIRED - Cookie domain (only required if cookieStorage is provided)
    //   domain: 'localhost',
    //   // OPTIONAL - Cookie path
    //   path: '/',
    //   // OPTIONAL - Cookie expiration in days
    //  expires: 365,
    //   // OPTIONAL - Cookie secure flag
    //   // Either true or false, indicating if the cookie transmission requires
    //   // a secure protocol (https).
    //   secure: false,
    // },
    // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    // authenticationFlowType: 'USER_PASSWORD_AUTH',
  },
  settings: {
    usePassword: false,
  }
};

export default authConfig;