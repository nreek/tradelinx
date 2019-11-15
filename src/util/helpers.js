/* global navigator */

import React from 'react';
import moment from 'moment';
import config from '../../config/config';

const FIAT = 'fiat';
const DEFAULT_DECIMALS_CRYPTO = config.defaultDecimals.crypto;


/**
 * 
 * @param {Object} dataType 
 * @param {Object} data 
 *
 * @returns {Object}
 */
export function initDataType(dataType, data) {
  const filledData = Object.keys(dataType).reduce((result, key) => {
    result[key] = data[key]

    return result;
  }, {})

  return filledData;
}

/**
 * Check if JSON readable
 * @param str
 * @returns {boolean}
 * @constructor
 */
export function isJSON(str) {
  if (/^\s*$/.test(str)) return false;
  str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
  str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
  str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
  return (/^[\],:{}\s]*$/).test(str);
}

/**
 * Gets object and recursively walk through and save value to object
 * @param oldObject
 * @param option (add custom string to name of options)
 * @param newObject
 * @returns object
 */
export function buildSimpleObject(oldObject, option = '', newObject = {}) {
  for (let property in oldObject) {
    if (oldObject.hasOwnProperty(property)) {
      if (typeof oldObject[property] === 'object') {
        buildSimpleObject(oldObject[property], option, newObject);
      } else if (isJSON(oldObject[property])) {
        buildSimpleObject(JSON.parse(oldObject[property]), option, newObject);
      } else {
        newObject[option + property] = oldObject[property];
      }
    }
  }
  return newObject;
}

/**
 *
 * @param {String} currency
 * @param {Object} productsList
 */
export function isFiat(currency, productsList = {}) {
  return productsList[currency] && productsList[currency].type === FIAT;
}

export function isFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
  );
}

/**
 * @param qty
 * @param decimalLength
 * @returns {*}
 */
export function formatQuantity(qty, decimalLength = 0) {
  const precision = decimalLength || config.defaultDecimals.crypto;
  const sqty = String(Number(floor(qty, precision)).toFixed((precision)))

  if (sqty.includes('.')) {
    const [integer, float] = sqty.split('.');
    const relevantFloat = float.replace(/[^1-9]+$/g, '');
    const restZeroes = float.match(/[^1-9]+$/g) ? float.match(/[^1-9]+$/g)[0] : '';
    const integerClass = integer > 0 ? 'highlight' : '';

    return (
      <span>
        <span className={integerClass}>{integer}</span>
        <span className='highlight'>.{relevantFloat}</span>
        <span>{restZeroes}</span>
      </span>
    );
  }

  return sqty;
}

export function toAllCaps(str) {
  return str
    .replace('/', '_')
    .split(' ')
    .map(word => word.toUpperCase())
    .join('_');
}

export function errorHandler(str) {
  if (/minimum/.test(str)) {
    return 'TOASTS.ORDER_GREATER_THAN_ZERO';
  } if (/^Insufficient/.test(str)) {
    return 'TOASTS.INSUFFICIENT_FUNDS';
  } if (/maximum/.test(str)) {
    return 'TOASTS.ORDER_OVER_MAX';
  }
  return 'TOASTS.ORDER_FAILURE';
}

/**
 *
 * @param {Number} value
 * @param {Number} precision
 * @param {Boolean} useDecimalLength
 *
 * @returns {Number}
 */
export function floor(value, precision = DEFAULT_DECIMALS_CRYPTO, useDecimalLength = false) {
  if (useDecimalLength && precision && precision.toString().indexOf('.') !== -1) {
    const decimalValue = precision.toString().split('.');
    precision = (decimalValue[1] || decimalValue[0]).length;
  }

  return Math.floor(value * Math.pow(10, precision)) / Math.pow(10, precision);
}

export function toCamelCase(str) {
  return str
    .split(/[_-\s]+/)
    .map(
      (word, i) => (i === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()),
    )
    .join('');
}

export function toDashCase(str) {
  return str
    .replace('/', '-')
    .split(' ')
    .map(word => word.toLowerCase())
    .join('-');
}

/**
 * @param {String} str
 * @param {String} caseChange // OPTIONS: "lowercase" or "uppercase"
 *
 * @returns {String}
 */
export function toSnakeCase(str, caseChange = '') {
  str = str.replace(/ /g, '_');
  
  if (caseChange === 'lowercase') {
    str = str.toLowerCase();
  } else if (caseChange === 'uppercase') {
    str = str.toUpperCase();
  }

  return str;
}

export function toCapsAndSpaces(str) {
  str = str.replace('_', ' ');

  return capitalize(str);
}

export function capitalize(str) {
  function capitalizeOneWord(word) {
    return word
      .split('')
      .map((letter, index) => {
        if (index === 0) {
          return letter.toUpperCase();
        }
        return letter.toLowerCase();
      })
      .join('');
  }

  return str
    .split(' ')
    .map(capitalizeOneWord)
    .join(' ');
}

export function type(variable) {
  return Object.prototype.toString
    .call(variable)
    .replace('[object ', '')
    .replace(']', '')
    .toLowerCase();
}

/**
 * @param {String|Number} timestamp
 * @param {Boolean} showOnlyTime
 * @param {Boolean} showOnlyDate
 *
 * @return {String}
 */
export function getFormattedDate(
  timestamp,
  showOnlyTime = false,
  showOnlyDate = false,
  dateFormat = config.dateFormat || 'MM-DD-YYYY',
  timeFormat = config.timeFormat === '12hr' ? 'h:mm a' : 'HH:mm',
) {
  if (timestamp === undefined) {
    return null;
  }

  let format = `${timeFormat} ${dateFormat}`;

  if (showOnlyTime) {
    format = timeFormat;
  } else if (showOnlyDate) {
    format = dateFormat;
  }

  return moment(timestamp).format(format);
}

export function getFee(amount, action, fees) {
  if (!fees) {
    return 0;
  }
  const data = {
    buy: {
      fee: fees.buy.taker,
      method: fees.buy.method,
    },
    sell: {
      fee: fees.sell.maker,
      method: fees.sell.method,
    },
  };

  

  switch(data[action].method) {
    case 'quantity_percent': 
      return ((amount * 1) * data[action].fee / 100)
    break;
  }

  return 0;
}

export function generateDataFeed(loadHistoryFunction, loadCurrentBars) {
  const supportedResolutions = ['1', '5', '15', '30', 'D']
  const config = {
    supported_resolutions: supportedResolutions
  }; 
  return {
    onReady: (cb) => {
      setTimeout(() => cb(config), 0)
    },
    resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
      let split_data = symbolName.split(/[/]/)
      const symbol_stub = {
        name: symbolName,
	 	    description: '',
	 	    type: 'crypto',
	 	    session: '24x7',
	 	    timezone: 'Etc/UTC',
	 	    ticker: symbolName,
	 	    minmov: 1,
	 	    pricescale: 100000000,
	 	    has_intraday: true,
	 	    intraday_multipliers: ['1', '5', '15', '30', 'D'],
	 	    supported_resolution:  supportedResolutions,
	 	    volume_precision: 8,
	 	    data_status: 'streaming',
	 };
	 if (split_data[1].match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
	 	symbol_stub.pricescale = 100
	 }
	 setTimeout(() => {
	  		onSymbolResolvedCallback(symbol_stub)
	  	}, 0);
    },
    getBars: (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) => {
      const getBarsBlob = {symbolInfo, resolution, from, to, firstDataRequest, onErrorCallback}
      loadHistoryFunction(getBarsBlob, onHistoryCallback)
    },
    subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
      const getCurrentBarsBlob = { symbolInfo, resolution, subscribeUID, onRealtimeCallback, onResetCacheNeededCallback}
      loadCurrentBars(getCurrentBarsBlob)
    },
unsubscribeBars: subscriberUID => {},
	calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
      return resolution < 60 ? {resolutionBack: 'D', intervalBack: '1'} : undefined
    }
  };
}

export function getResolution(resolution) {
  const periodicityObj = {
    '1D': 'day',
    '30': 'minute30',
    '15': 'minute15',
    '5': 'minute5',
    '1': 'minute'
  }
  return periodicityObj[resolution] || 'minute15';
}

/**
 * @name isChrome
 * @description Detects if the browser is Google Chrome.
 * @returns {bool} true if user browser is Google Chrome; otherwise, false.
 */
export function isChrome() {
  return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
}

/**
 * @name isSafari
 * @description Detects if the browser is Safari.
 * @returns {bool} true if user browser is Safari; otherwise, false.
 */
export function isSafari() {
  return /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
}

export function formatNumberToLocale(value, decimalPlaces = 2, round = 'round') {
  if (isNaN(value)) return '';
  let roundedValue = roundTo(value, decimalPlaces, round);
  return roundedValue.toLocaleString(config.locale || 'en', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
}

export function roundTo(value, decimalPlaces = 0, round = 'round') {
  if (isNaN(value)) return '';
  const multi = 10 ** decimalPlaces;
  let roundedValue;
  if (round === 'up' || round === 'ceil') {
    roundedValue = (Math.ceil(value * multi) / multi)
  } else if (round === 'down' || round === 'floor') {
    roundedValue = (Math.floor(value * multi) / multi)
  } else {
    roundedValue = (Math.round(value * multi) / multi)
  }
  return roundedValue;
}

export default {
  isFunction,
  toAllCaps,
  toCamelCase,
  toDashCase,
  type,
  errorHandler,
  floor,
  getFee,
  generateDataFeed,
  getResolution,
  isChrome,
  isSafari,
  formatNumberToLocale,
  roundTo,
};
