/*
  For sign up modal (additional fields)
*/
export const signupAdditionalFields = [
  {
    name: 'checkbox_agree_terms',
    translation: 'MARKETING.SIGNUP_FIELD_CHECKBOX_AGREE_TERMS',
    type: 'checkbox',
    required: true,
    textTranslation: {
      text: 'I agree to',
      translation: 'MARKETING.SIGNUP_FIELD_CHECKBOX_AGREE',
    },
    checkboxWithLinks: true,
    links: [
      {
        text: 'Terms and Conditions',
        translation: 'MARKETING.SIGNUP_FIELD_CHECKBOX_AGREE_TERMS_TRANSLATION',
        path: '/terms',
      },
    ],
    className: 'signup-agree',
  },
  {
    name: 'checkbox_agree_policy',
    translation: 'MARKETING.SIGNUP_FIELD_CHECKBOX_AGREE_POLICY',
    type: 'checkbox',
    textTranslation: {
      text: 'I agree to',
      translation: 'MARKETING.SIGNUP_FIELD_CHECKBOX_AGREE',
    },
    required: true,
    checkboxWithLinks: true,
    links: [
      {
        text: 'Privacy Policy',
        translation: 'MARKETING.SIGNUP_FIELD_CHECKBOX_AGREE_POLICY_TRANSLATION',
        path: '/privacy',
      },
    ],
    className: 'signup-agree',
  },
];
