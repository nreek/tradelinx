import { fetch } from 'whatwg-fetch';
import config from '../../config/config';
import appGlobals from '../util/globals';

class AppRestApi {
  constructor(auth, host, useSsl = true, version = 'v1') {
    const protocol = useSsl ? 'https' : 'http';
    let authorization;

    this.setTokens = ({ access_token, token_type }) => {
      authorization = `${token_type} ${access_token}`;
    };

    this.json = async (response) => {
      // This method returns parsed JSON; in addition, if there's error and debug mode is on,
      // it logs error message to the console
      const json = await response.json();
      if (!response.ok && config.debug.jsError) console.log(json);
      return json;
    };

    this.getMinimalProfileSchema = () => fetch(
      `${protocol}://${host}/api/${version}/user-registration/new-profile-schema`,
    )
      .then(response => this.json(response))
      .then(json => json)
      .catch((error) => { config.debug.jsError && console.error(error); });

    this.getExtendedProfileSchema = () => fetch(
      `${protocol}://${host}/api/${version}/user-registration/edit-profile-schema`,
    )
      .then(response => this.json(response))
      .then(json => json)
      .catch((error) => { config.debug.jsError && console.error(error); });

    /**
     * @param {Object} body - API request body
     */
    this.signup = body => fetch(`${protocol}://${host}/api/${version}/user-registration`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.ok) {
          return { status_code: 'OK' };
        }
        return this.json(response);
      })
      .then(error => error)
      .catch((error) => { config.debug.jsError && console.error(error); });

    /**
     * @param {Object} passwordData - API request body
     */
    this.updatePassword = passwordData => fetch(`${protocol}://${host}/api/v1/user-registration/password`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: authorization,
      },
      method: 'PUT',
      body: JSON.stringify(passwordData),
    })
      .then((response) => {
        if (response.ok) {
          return { status_code: 'OK' };
        }
        return this.json(response);
      })
      .then(error => error)
      .catch((error) => { config.debug.jsError && console.error(error); });

    this.updateUserProfile = kycFormDataPayload => fetch(
      `${protocol}://${host}/api/${version}/user-registration/profile`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: authorization,
        },
        method: 'PUT',
        body: JSON.stringify(kycFormDataPayload),
      },
    )
      .then((response) => {
        if (response.ok) {
          return { status_code: 'OK' };
        }
        return this.json(response);
      })
      .then(error => error)
      .catch((error) => { config.debug.jsError && console.error(error); });

    /**
     * @param {String} email - Email of registered user
     */
    this.resendVerification = email => fetch(
      `${protocol}://${host}/api/${version}/user-registration/verification/send?email=${encodeURIComponent(
        email,
      )}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    )
      .then((response) => {
        if (response.ok) {
          return { status_code: 'OK' };
        }
        return this.json(response);
      })
      .then(error => error)
      .catch((error) => { config.debug.jsError && console.error(error); });

    this.getKycStatus = () => fetch(
      `${protocol}://${host}/api/${version}/user-registration/kyc`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: authorization,
        },
      },
    )
      .then((response) => {
        if (response.ok || response.status === 404) {
          // 404 = if kyc has not been started
          return this.json(response);
        }
        throw response.json();
      })
      .then((status) => {
        if (status.message === 'KYC is not in progress.') {
          return { ...status, status: 'not_started' };
        }
        return status;
      })
      .catch((error) => { config.debug.jsError && console.error(error); });

    this.updateKycStatus = () => fetch(
      `${protocol}://${host}/api/${version}/user-registration/kyc`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: authorization,
        },
        method: 'POST',
      },
    )
      .then((response) => {
        if (response.ok) {
          return { status_code: 'OK' };
        }
        return this.json(response);
      })
      .then(error => error)
      .catch((error) => { config.debug.jsError && console.error(error); });

    this.kycRequestStatus = () => fetch(
      `${protocol}://${host}/api/${version}/user-registration/kyc-status`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: authorization,
        },
      },
    )
      .then((response) => {
        if (response.ok) {
          return this.json(response);
        }
        return this.json(response);
      })
      .then(error => error)
      .catch((error) => { config.debug.jsError && console.error(error); });

    this.getUserProfile = () => fetch(
      `${protocol}://${host}/api/${version}/user-registration/profile`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: authorization,
        },
      },
    )
      .then(response => this.json(response))
      .then(profile => profile)
      .catch((error) => { config.debug.jsError && console.error(error); });

    this.verifyUser = hash => fetch(
      `${protocol}://${host}/api/${version}/user-registration/verification?hash=${encodeURIComponent(
        hash,
      )}`,
      {
        method: 'POST',
      },
    )
      .then((response) => {
        if (response.ok) {
          return response;
        }
        return false;
      })
      .catch((error) => { config.debug.jsError && console.error(error); });

    /**
     * @param {String} email
     */
    this.passwordResetRequest = email => fetch(
      `${protocol}://${host}/api/${version}/user-registration/password/reset-request`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ email_address: email }),
      },
    )
      .then((response) => {
        if (response.headers.map['content-type'].includes('application/json')) {
          this.json(response);
        } else {
          return response;
        }
      })
      .catch((error) => { config.debug.jsError && console.error(error); });

    /**
     * @param {String} hash
     * @param {String} newPassword
     */
    this.passwordResetCommit = (hash, newPassword) => fetch(
      `${protocol}://${host}/api/${version}/user-registration/password/reset-commit?hash=${encodeURIComponent(
        hash,
      )}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ new_password: newPassword }),
      },
    )
      .then((response) => {
        if (response.ok) {
          return { status: 'success' };
        }
        return this.json(response);
      })
      .catch((error) => { config.debug.jsError && console.error(error); });

    /**
     * @param {Object} file - file object
     */
     this.uploadFile = (file) => {
      const formData = new FormData();
      formData.append('files', file);

      return fetch(`${protocol}://${host}/api/${version}/file`, {
        method: 'POST',
        headers: {
          Authorization: authorization,
          Accept: 'application/json',
        },
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            return response.text();
          }
          return this.json(response);
        })
        .then((textResponse) => {
          // Upload may return an error message (Ex. "Files count limit is reached.").
          // In such cases, textResponse will be an object with a message property.
          // Otherwise, it only returns a single string which represents the file accessor).
          if (textResponse && !textResponse.message) {
            return { status: 'success', filename: textResponse };
          }
          return {
            status: 'failed',
            error: textResponse.message
              ? textResponse.message
              : _t('Empty file accessor.', 'API.EMPTY_FILE_ACCESSOR'),
          };
        })
        .catch((error) => { appGlobals.apiLog(error); });
    };

    /**
     * @param {String} accessor - file name
     */
    this.getFile = accessor => fetch(
      `${protocol}://${host}/api/${version}/file?accessor=${encodeURIComponent(
        accessor,
      )}`,
      {
        headers: {
          Authorization: authorization,
        },
      },
    )
      .then((response) => {
        if (response.ok) {
          return response.blob();
        }
        return this.json(response);
      })
      .then((body) => {
        if (body instanceof Blob) {
          body.lastModifedDate = new Date();
          body.name = accessor;
          return { status: 'success', file: body };
        }
        return { status: 'failed', error };
      })
      .catch((error) => { config.debug.jsError && console.error(error); });
  }
}

export default AppRestApi;
