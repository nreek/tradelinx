/**
 * @description
 *
 * `WALLET ADDRESS` Fields should include next filter(s): `illegalWalletAddress`, `validWalletAddress`
 * `AMOUNT` field should include filter `amount` not `integer`
 *
 */

export const depositFiatFields = [
  // {
  //   name: 'Full Name',
  //   type: 'text',
  //   translation: 'DEPOSIT.FULL_NAME',
  //   required: true
  // },
  {
    name: 'Amount',
    type: 'text',
    required: true,
    translation: 'AMOUNT',
    validations: {
      onBlur: [
        {
          name: 'amount',
        },
      ],
    },
  },
];

export const signupFields = [
  {
    name: 'given_name',
    type: 'text',
    required: true,
  },
  {
    name: 'middle_name',
    type: 'text',
    required: false,
  },
  {
    name: 'surname',
    type: 'text',
    required: true,
  },
  {
    name: 'email',
    type: 'text',
    required: true,
  },
  // QUESTION: This is optional, should it be asked during signup?
  {
    name: 'phone_number',
    type: 'text',
    required: false,
  },
  {
    name: 'date_of_birth',
    type: 'date',
    required: true,
  },
  {
    name: 'street_address',
    type: 'text',
    required: true,
  },
  {
    name: 'city',
    type: 'text',
    required: true,
  },
  {
    name: 'state',
    type: 'text',
    required: true,
  },
  {
    name: 'postal_code',
    type: 'text',
    required: true,
  },
  // TODO: update to include new enum values
  // {
  //   name: 'Country',
  //   type: 'select',
  //   required: true,
  //   optionList: 'countryCodes',
  //   placeholder: 'Country'
  // },
  {
    name: 'country',
    type: 'select',
    required: true,
    optionList: 'countryCodes',
    placeholder: 'Country',
  },
  {
    name: 'password',
    translation: 'MARKETING.SIGNUP_FIELD_THREE',
    type: 'text',
    hideInput: true,
    required: true,
    validations: {
      onChange: [
        {
          name: 'minLength',
          minLength: 8,
        },
      ],
    },
  },
  {
    name: 'confirm_password',
    translation: 'MARKETING.SIGNUP_FIELD_FOUR',
    type: 'text',
    hideInput: true,
    required: true,
  },
];

export const verifyFields = [
  {
    name: 'First Name',
    type: 'text',
    required: true,
  },
  {
    name: 'Middle Name',
    type: 'text',
    required: false,
  },
  {
    name: 'Last Name',
    type: 'text',
    required: true,
  },
  {
    name: 'Telephone',
    type: 'text',
    required: true,
  },
  {
    name: 'Date of Birth',
    type: 'date',
    required: true,
  },
  {
    name: 'Address Line 1',
    type: 'text',
    required: true,
  },
  {
    name: 'Address Line 2',
    type: 'text',
    required: false,
  },
  {
    name: 'City',
    type: 'text',
    required: true,
  },
  {
    name: 'State',
    type: 'text',
    required: true,
  },
  {
    name: 'Zip',
    type: 'text',
    required: true,
  },
  {
    name: 'Country',
    type: 'select',
    required: true,
    optionList: 'countryCodes',
  },
];
export const excludeVerifyFields = ['affiliateid'];

export const withdrawFiatFields = [
  {
    name: 'Amount',
    type: 'text',
    required: true,
    translation: 'WITHDRAW.AMOUNT',
    validations: {
      onBlur: [
        {
          name: 'amount',
        },
      ],
    },
  },
  // {
  //   name: 'Bank name',
  //   type: 'text',
  //   translation: 'WITHDRAW.BANK_NAME',
  //   required: true
  // },
  // {
  //   name: 'Account Number',
  //   type: 'text',
  //   translation: 'WITHDRAW.ACCOUNT_NUMBER',
  //   required: true
  // },
  // {
  //   name: 'SWIFT',
  //   type: 'text',
  //   translation: 'WITHDRAW.SWIFT',
  //   required: true
  // }
];

export const initalSchema = (userProfile) => {
  const {
    city,
    country,
    given_name,
    postal_code,
    state_province,
    street_address,
    surname,
    phone_number,
    middle_name,
    date_of_birth,
    document,
  } = userProfile;
  return {
    'Given name': given_name,
    Surname: surname,
    'Middle name': middle_name,
    'Phone number': phone_number,
    'Date of birth': date_of_birth,
    'Street address': street_address,
    City: city,
    'State/Province': state_province,
    'Postal code': postal_code,
    Country: country,
    Document: document,
  };
};

export const withdrawCryptoFields = [
  {
    name: 'Amount',
    type: 'text',
    required: true,
    translation: 'WITHDRAW_CRYPTO.AMOUNT',
    validations: {
      onChange: [
        {
          name: 'amount',
        },
      ],
    },
  },
  {
    name: 'Address',
    type: 'text',
    required: true,
    translation: 'WITHDRAW_CRYPTO.EXTERNAL_ADDRESS',
    validations: {
      onChange: [
        {
          name: 'validWalletAddress',
        },
        {
          name: 'illegalWalletAddress',
        },
      ],
    },
  },
];

export const changePassword = [
  {
    name: 'Old Password',
    translation: 'SETTINGS.OLD_PASSWORD',
    type: 'text',
    hideInput: true,
    required: true,
    validations: {
      onChange: [
        {
          name: 'minLength',
          minLength: 8,
        },
      ],
    },
  },
  {
    name: 'New Password',
    translation: 'SETTINGS.NEW_PASSWORD',
    type: 'text',
    hideInput: true,
    required: true,
    validations: {
      onChange: [
        {
          name: 'minLength',
          minLength: 8,
        },
        {
          name: 'password',
        },
      ],
    },
  },
  {
    name: 'Confirm Password',
    translation: 'SETTINGS.CONFIRM_PASSWORD',
    type: 'text',
    hideInput: true,
    required: true,
  },
];

export const confirmAccountWithCodeFields = [
  {
    name: 'Code',
    type: 'text',
    hideInput: true,
    required: true,
    validations: {
      onChange: [
        {
          name: 'minLength',
          minLength: 6,
        },
      ],
    },
  },
];

export const emailInput = {
  name: 'Email',
  type: 'text',
  placeholder: 'Email',
  required: true,
  validations: {
    onBlur: [
      {
        name: 'email',
      },
    ],
  },
};

export const passwordInput = {
  name: 'password',
  translation: 'MARKETING.SIGNUP_FIELD_THREE',
  type: 'text',
  hideInput: true,
  placeholder: 'Password',
  required: true,
  validations: {
    onChange: [
      {
        name: 'password',
      },
    ],
  },
};

export const confirmPasswordInput = {
  name: 'confirm_password',
  placeholder: 'Confirm Password',
  translation: 'MARKETING.SIGNUP_FIELD_FOUR',
  type: 'text',
  hideInput: true,
  required: true,
};

export const signupReCaptcha = {
  name: 'recaptcha',
  type: 'recaptcha',
  theme: 'light',
  required: true,
};

export const resetPasswordFields = [
  {
    name: 'email',
    type: 'text',
    placeholder: 'Email',
    required: true,
    validations: {
      onBlur: [
        {
          name: 'email',
        },
      ],
    },
  },
];

export const changePasswordWithCodeFields = [
  {
    name: 'Code',
    type: 'text',
    hideInput: true,
    required: true,
    placeholder: 'Confirmation Code',
    validations: {
      onChange: [
        {
          name: 'minLength',
          minLength: 6,
        },
      ],
    },
  },
  {
    name: 'New Password',
    translation: 'SETTINGS.NEW_PASSWORD',
    type: 'text',
    hideInput: true,
    required: true,
    placeholder: 'New password',
    validations: {
      onChange: [
        {
          name: 'minLength',
          minLength: 8,
        },
        {
          name: 'password',
        },
      ],
    },
  },
  {
    name: 'Confirm Password',
    placeholder: 'Confirm password',
    translation: 'SETTINGS.CONFIRM_PASSWORD',
    type: 'text',
    hideInput: true,
    required: true,
    placeholder: 'Confirm Password',
  },
];

export default {
  depositFiatFields,
  signupFields,
  verifyFields,
  withdrawCryptoFields,
  withdrawFiatFields,
  changePassword,
  changePasswordWithCodeFields,
  initalSchema,
  passwordInput,
  confirmPasswordInput,
  emailInput,
  confirmAccountWithCodeFields,
};
