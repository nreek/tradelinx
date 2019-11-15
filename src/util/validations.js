// Common place for all validating function to be re used across components

import React from 'react';

// import WAValidator from 'wallet-address-validator';
// import ethereum_address from 'ethereum-address';
import { illegalWalletAddresses } from '../constants';
import { validate as multiAddressValidator } from 'multicoin-address-validator';
import currencies from 'multicoin-address-validator/src/currencies';
import config from '../../config/config';


const AMOUNT_REGEX = /^(?:[\d-]*,?[\d-]*\.?[\d-]*|[\d-]*\.[\d-]*,[\d-]*)$/;

function translateError(validation, defaultMessage) {
  return _t(defaultMessage, `VALIDATION_ERRORS.${validation.toUpperCase()}`);
}

const validate = {
  email: (value) => {
    // some email validation
    const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (emailRegex.test(value)) {
      return { name: 'email', valid: true };
    }
    return { name: 'email', valid: false, error: translateError('EMAIL', 'must be a valid email') };
  },

  alphanumeric: (value) => {
    // some alphanumeric validation
    const alphanumericRegex = /^[a-zA-Z0-9]*$/;

    if (alphanumericRegex.test(value)) {
      return '';
    }
    return translateError('ALPHANUMERIC', 'must be alphanumeric');
  },

  integer: (value) => {
    // some interger valdation
    const integerRegex = /^[0-9]*$/;

    if (integerRegex.test(value)) {
      return '';
    }
    return translateError('INTEGER', 'must only include numbers');
  },

  imageFileType: (file) => {
    if (
      ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(
        file.type,
      )
    ) {
      return '';
    }
    return translateError('IMAGE_FILE_TYPE', 'must be a valid file type');
  },

  imageFileSize: (file) => {
    // max 3 MB
    if (parseInt(file.size) < 3000000) {
      return '';
    }
    return translateError('IMAGE_FILE_SIZE', 'must be a valid file size');
  },

  videoFileType: (file) => {
    if (['video/quicktime', 'video/mp4', 'video/webm'].includes(file.type)) {
      return '';
    }
    return translateError('VIDEO_FILE_TYPE', 'must be a valid file type');
  },

  videoFileSize: (file) => {
    if (parseInt(file.size) < 20000000) {
      return '';
    }
    return translateError('VIDEO_FILE_SIZE', 'must be a valid file size');
  },

  over18: (birthday) => {
    const birthdayDate = new Date(birthday).getTime();
    const currentDate = Date.now();
    const ageDifference = (currentDate - birthdayDate) * 3.17098e-11;
    
    if (ageDifference > 18) {
      return { name: 'over18', valid: true };
    }

    return {
      name: 'over18',
      valid: false,
      error: translateError(
        'OVER_18',
        'must be over 18 years old',
      ),
    }
  },

  minimumDepositAmount: (amount) => {
    if (
      AlphaPoint.config.depositFiat.minimumDepositAmount
      && parseInt(this.state.amount)
        > AlphaPoint.config.depositFiat.minimumDepositAmount
    ) {
      return '';
    }
    return translateError(
      'MINIMUM_DEPOSIT_AMOUNT',
      `must make a deposit greater than $${
        AlphaPoint.config.depositFiat.minimumDepositAmount
      }`,
    );
  },

  invalidValues: invalidValues => str => (!invalidValues.includes(str)
    ? ''
    : translateError('INVALID_VALUE', 'invalid value')),

  validWalletAddress: (value, { currency = '' }) => {
    const destination = '?dt';
    const addressWithoutDestination = value.split(destination)[0];
    const error = {
      name: 'invalidWalletAddress',
      valid: false,
      error: translateError(
        'WRONG_WALLET_ADDRESS',
        'Invalid wallet address',
      ),
    };

    // length less than minimal
    if(addressWithoutDestination.length < config.minimalLengthWalletAddress)
      return error;

    // @todo what to do if currency not found in lib ?
    if(!currencies.getByNameOrSymbol(currency))
      return {
        name: 'invalidWalletAddress',
        valid: true,
      };

    return multiAddressValidator(addressWithoutDestination, currency.toLowerCase())
    ? { name: 'invalidWalletAddress', valid: true }
    : error
  },

  minLength: (value, { minLength }) => (value.length >= minLength
    ? { name: 'minLength', valid: true }
    : {
      name: 'minLength',
      valid: false,
      error: translateError('MIN_LENGTH', 'Too short'),
    }),

  amount: value => (AMOUNT_REGEX.test(value)
    ? { name: 'amount', valid: true }
    : {
      name: 'amount',
      valid: false,
      error: translateError('AMOUNT', 'Wrong amount'),
    }),

  required: value => (!value && value.trim().length === 0
    ? {
      name: 'required',
      valid: false,
      error: translateError('REQUIRED_FIELD', 'Required field'),
    }
    : { name: 'required', valid: true }),

  illegalWalletAddress: value => (illegalWalletAddresses.includes(value)
    ? {
      name: 'illegalWalletAddress',
      valid: false,
      error: translateError('ILLEGAL_WALLET_ADDRESS', 'Illegal wallet address'),
    }
    : { name: 'illegalWalletAddress', valid: true }),

  password: (str) => {
    const mediumRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-[\|!@#./,";()№_+=<>{}:\$%\^&\*])(?=.{8,})');
    const enoughRegex = new RegExp('(?=.{8,}).*');

    if (!mediumRegex.test(str)) {
      return { name: 'password', valid: false, error: translateError('PASSWORD_RULES', 'Password must contain at least 8 characters, at least one number, symbol, lower case letter and capital letter') };
    } if (!enoughRegex.test(str)) {
      return { name: 'password', valid: false, error: translateError('PASSWORD_LENGTH', 'Password must contain at least 8 characters') };
    }
    return { name: 'password', valid: true };
  },
};

export default validate;
