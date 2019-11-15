class AbstractAuth {
    constructor() {
      this.authenticate = () => {};
      this.refresh = () => {};
      this.signup = () => {};
      this.logout = () => new Promise((resolve) => resolve());
      this.verifyEmail = () => {};
      this.updatePassword = () => {};
      this.modifySettings = () => {};
      this.setupTotpForUser = () => {};
      this.loadUserSettings = () => {};
      this.passwordResetRequest = () => {};
      this.changePasswordWithCode = () => new Promise((resolve) => resolve());
      this.completeExchange2FA = () => new Promise((resolve) => resolve({}));
    }
  }
  
  export default AbstractAuth;