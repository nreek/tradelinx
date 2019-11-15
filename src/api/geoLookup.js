const GEO_LOOKUP_URL = 'https://geo.shiftcrypto.com/api/v1/countries';

// TODO: why is this a class?
class GeoLookup {
  /**
   *
   * @param {String} token
   */
  getCountry(token) {
    return fetch(GEO_LOOKUP_URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authtoken: token,
      },
    })
    .then(response => response.json())
    .catch((error) => { return {result: false, errormsg: error.message}; });
  }
}

export default GeoLookup;
