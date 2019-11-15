import appConfig from '../../config/config';
import * as constants from '../constants';

const a = {};

/**
 * Translate function
 * 
 * @param {Object} translations
 * 
 * @return {String}
 */
function translate(translations) {
  const replaceVariables = (str, variables) => {
    Object.keys(variables).forEach((prop) => {
      const val = variables[prop];
      str = str.replace(new RegExp(`{${prop}}`, 'g'), (val === null || val === undefined ? '' : val));
    });
    return str;
  };

  return (str, translationKey, variables) => {
    a[translationKey] = str;
    let translation = translations[translationKey]
      ? translations[translationKey]
      : str;

    if (variables) {
      translation = replaceVariables(translation, variables);
    }

    return translation;
  };
}

const globalLogLevels = {
  debug: 3,
  warning: 2,
  error: 1,
  none: 0
};

const debug = {
  logLevel: globalLogLevels.error,
  apiLogLevel: globalLogLevels.none
};

const log = (message, logLevel = globalLogLevels.error) => {
  if (logLevel <= debug.logLevel)  {
    switch(logLevel) {
      case globalLogLevels.error:
        console.error(message);
        break;

      case globalLogLevels.warning:
        console.warn(message);
        break;

      default:
        console.log(message);
        break;
    }
  }
};

const apiLog = (message, logLevel = globalLogLevels.error) => {
  if (logLevel <= debug.apiLogLevel)  {
    log(message, logLevel);
  }
};

const getConstant = (key) => constants[key];

const getAllConstants = () => constants;

const getKey = key => constants.keys[key];


function initiateGlobals() {
  const currentLanguages = localStorage.getItem('currentLanguage')
    || appConfig.lang.default
    || 'en';

  fetch(`/lang/${currentLanguages}.json`) // TODO: error handling
    .then(data => data.json())
    .then((translations) => {
      localStorage.setItem('translations', JSON.stringify(translations));
      window._t = translate(translations, a);
    });

  const translation = JSON.parse(localStorage.getItem('translations'));

  window._t = translate(translation || {});

  window.appConstants = {
    getItem: getConstant,
    getAll: getAllConstants,
    getKey: getKey,
  };

  window.appGlobals = {
    apiLog: apiLog,
    log: log,
  };
}

export default initiateGlobals;
