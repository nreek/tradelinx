import { createSelector } from 'reselect';
import { toast } from 'react-toastify';
import types from '../actions/types';
import { status as defaultStatus } from '../constants/statuses';

const status = {
  ...defaultStatus,
};

export const authStatus = {
  ...status
};

export const authError = {
  invalidCredentials: 'invalid_grant',
  invalidVerificationCode: 'invalid_verification_code',
  verificationCode: 'verification_code',
  unauthorized: 'unauthorized',
  confirmationCode: 'confirmation_code',
  invalidConfirmationCode: 'invalid_confirmation_code',
  passwordResetRequiredException: 'PasswordResetRequiredException',
  userNotFoundException: 'UserNotFoundException',
  notAuthorizedException: 'NotAuthorizedException',
  userNotConfirmedException: 'UserNotConfirmedException',
};

export const user = (
  state = {
    authStatus: authStatus.none,
    authError: undefined,
    username: undefined,
    newPasswordStatus: status.none,
    updateProfileStatus: status.none,
    location: {},
    signup: {},
  },
  action,
) => {
  switch (action.type) {
    case types.state.authSuccess:
      return {
        ...state,
        authStatus: authStatus.success,
        username: action.username,
        authError: undefined,
      };

    case types.state.authPending:
      return {
        ...state,
        authStatus: authStatus.pending,
      };

    case types.state.authFailed:
      return {
        ...state,
        authStatus: authStatus.failed,
        authError: action.error,
      };

    case types.state.authNone:
      return {
        ...state,
        authStatus: authStatus.none,
        username: undefined,
      };

    case types.state.setLocation:
      return {
        ...state,
        location: action.location,
      };

    case types.state.setLocationError:
      return {
        ...state,
        locationError: action.error,
      };

    case types.state.signupPending:
      return {
        ...state,
        signup: { status: status.pending, error: null, error_description: null },
      };

    case types.state.signupSuccess:
      return {
        ...state,
        signup: { error: null, error_description: null, status: status.success },
      };

    case types.state.signupError:
      return {
        ...state,
        signup: {
          error_description: action.error.message,
          error: action.error.status_code || action.error.code,
          status: status.failed,
        },
      };

    case types.state.signupNone:
      return {
        ...state,
        signup: { status: status.none },
      };

    case types.state.minimalSchemaPending:
      return {
        ...state,
        minimalProfileSchema: { status: status.pending },
      };

    case types.state.minimalSchemaSuccess:
      return {
        ...state,
        minimalProfileSchema: {
          properties: action.properties,
          required: action.required,
          status: status.success,
        },
      };

    case types.state.minimalSchemaError:
      return {
        ...state,
        minimalProfileSchema: { ...action.error, status: status.failed },
      };

    case types.state.extendedSchemaPending:
      return {
        ...state,
        extendedProfileSchema: { status: status.pending },
      };

    case types.state.extendedSchemaSuccess:
      return {
        ...state,
        extendedProfileSchema: {
          properties: action.properties,
          required: action.required,
          status: status.success,
        },
      };

    case types.state.extendedSchemaError:
      return {
        ...state,
        extendedProfileSchema: { ...action.error, status: status.failed },
      };

    case types.state.setResendVerificationStatus:
      return {
        ...state,
        resendVerification: action.resendVerification,
      };

    case types.state.kycStatusPending:
      return {
        ...state,
        kycStatus: { request: status.pending },
      };

    case types.state.kycStatusSuccess:
      return {
        ...state,
        kycStatus: { ...action.status, request: status.success },
      };

    // TODO: check this state:
    case types.state.kycStatusError:
      return {
        ...state,
        kycStatus: { ...action.error, request: status.failed },
      };

    case types.state.kycRequestPending:
      return {
        ...state,
        kycRequest: { request: status.pending },
      };

    case types.state.kycRequestSuccess:
      return {
        ...state,
        kycRequest: action.status,
      };

    // TODO: check this state:
    case types.state.kycRequestError:
      return {
        ...state,
        kycRequest: { ...action.error, request: status.failed },
      };

    case types.state.userProfilePending:
      return {
        ...state,
        profile: { status: status.pending },
      };

    case types.state.userProfileSuccess:
      return {
        ...state,
        profile: { ...action.profile, status: status.success },
      };

    case types.state.userProfileFailed:
      return {
        ...state,
        profile: { ...action.error, status: status.failed },
      };

    case types.state.updateProfilePending:
      return {
        ...state,
        updateProfileStatus: status.pending,
      };

    case types.state.updateProfileSuccess:
      toast.success(_t('Profile updated', 'TOASTS.PROFILE_UPDATED'));
      return {
        ...state,
        updateProfileStatus: status.success,
      };

    case types.state.updateProfileFailed:
      return {
        ...state,
        updateProfileStatus: status.failed,
      };

    case types.state.verificationPending:
      return { ...state, verificationStatus: status.pending };

    case types.state.verificationSuccess:
      return { ...state,
        verificationStatus: status.success,
        signup: {
          status: status.verified,
        },
      };

    case types.state.verificationFailed:
      return { ...state, verificationStatus: status.failed };

    case types.state.passwordResetRequestPending:
      return { ...state, passwordResetRequestStatus: status.pending };

    case types.state.passwordResetRequestVerify:
      return { ...state, passwordResetRequestStatus: status.verify };

    case types.state.passwordResetRequestSuccess:
      return { ...state, passwordResetRequestStatus: status.success };

    case types.state.passwordResetRequestFailed:
      return {
        ...state,
        passwordResetRequestStatus: status.failed,
        passwordResetRequestErrorMessage: action.errorMessage,
      };

    case types.state.passwordResetCommitPending:
      return {
        ...state,
        passwordResetCommitStatus: status.pending,
        passwordResetCommitError: null,
      };

    case types.state.passwordResetCommitSuccess:
      return {
        ...state,
        passwordResetCommitStatus: status.success,
        passwordResetCommitError: null,
      };

    case types.state.passwordResetCommitFailed:
      return {
        ...state,
        passwordResetCommitStatus: status.failed,
        passwordResetCommitError: action.error,
      };

    case types.state.newPasswordNone:
      return {
        ...state,
        newPasswordStatus: status.none,
      };

    case types.state.newPasswordPending:
      return {
        ...state,
        newPasswordStatus: status.pending,
      };

    case types.state.newPasswordSuccess:
      toast.success(
        _t('Password change successful', 'TOASTS.PASSWORD_CHANGE_SUCCESSFUL'),
      );
      return {
        ...state,
        newPasswordStatus: status.success,
      };

    case types.state.newPasswordFailed:
      return {
        ...state,
        newPasswordStatus: status.failed,
      };
    case types.state.signupNextStep:
      return {
        ...state,
        signup: {
          status: status.verify,
        },
      };
    case types.state.changePasswordWithCodePending:
      return {
        ...state,
        changePasswordWithCodeStatus: status.pending,
        changePasswordWithCodeError: null,
      };
    case types.state.changePasswordWithCodeSuccess:
      toast.success(
        _t('Password change successful', 'TOASTS.PASSWORD_CHANGE_SUCCESSFUL'),
      );
      return {
        ...state,
        changePasswordWithCodeStatus: status.success,
        changePasswordWithCodeError: null,
      };
    case types.state.changePasswordWithCodeFailed:
      return {
        ...state,
        changePasswordWithCodeStatus: status.failed,
        changePasswordWithCodeError: action.error,
      };

    default:
      return state;
  }
};

export const selectUser = state => state.user;

export const getEmail = state => state.user.username;

export const extendedProfileSchema = state => state.user.extendedProfileSchema

export const selectUserAuthStatus = createSelector(
  selectUser,
  u => u.authStatus,
);

export const selectUserAuthError = createSelector(
  selectUser,
  u => u.authError,
);

export const selectSignupStatus = createSelector(
  selectUser,
  u => u.signup.status,
);

export const selectSignupError = createSelector(
  selectUser,
  u => ({
    error: u.signup.error,
    error_description: u.signup.error_description,
  }),
);

export const selectKycStatus = createSelector(
  selectUser,
  u => u.kycStatus,
);

export const selectUserProfile = createSelector(
  selectUser,
  u => u.profile,
);

export const selectVerificationStatus = createSelector(
  selectUser,
  u => u.verificationStatus,
);

export const selectPasswordResetRequestStatus = createSelector(
  selectUser,
  u => u.passwordResetRequestStatus,
);

export const selectPasswordResetCommitStatus = createSelector(
  selectUser,
  u => u.passwordResetCommitStatus,
);

export const selectPasswordResetCommitError = createSelector(
  selectUser,
  u => u.passwordResetCommitError,
);

export const selectPasswordStatus = createSelector(
  selectUser,
  user => user.newPasswordStatus,
);
