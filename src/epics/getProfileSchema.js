import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';
import {
  emailInput,
  passwordInput,
  confirmPasswordInput,
  signupReCaptcha,
  excludeVerifyFields,
} from '../../config/formConfig';
import { signupAdditionalFields } from '../../config/formSignup';
import {
  minimalSchemaPending,
  minimalSchemaSuccess,
  minimalSchemaError,
  extendedSchemaPending,
  extendedSchemaSuccess,
} from '../actions';
import types from '../actions/types';


const configureSchema = (properties, required, profile) => {
  const configuredData = [];
  const unfilteredProperties = properties || {};
  const requiredTest = required || [];
  const propertyKeys = Object.keys(unfilteredProperties);
  const propertyObject = Object.entries(unfilteredProperties);

  propertyObject.map((propData, i) => {
    const [fieldKey, fieldProps] = propData;
    if (excludeVerifyFields.includes(fieldKey.toLowerCase())) {
      return true;
    }
    if (fieldProps.enum) {
      configuredData.push({
        name: fieldProps.title,
        type: 'select',
        required: requiredTest.includes(fieldKey),
        options: fieldProps.enum.map(data => ({ name: data })),
        placeholder: fieldProps.title,
        writeOnce: !!(fieldProps.writeOnce && profile[fieldKey]),
      });
    } else if (['age', 'date', 'date-time'].includes(fieldProps.customFormat)) {
      configuredData.push({
        name: fieldProps.title,
        required: requiredTest.includes(fieldKey),
        type: 'date',
        writeOnce: !!(fieldProps.writeOnce && profile[fieldKey]),
      });
    } else if (fieldProps.contentEncoding === 'relative') {
      configuredData.push({
        name: fieldProps.title,
        required: requiredTest.includes(fieldKey),
        type: 'file-button',
        writeOnce: !!(fieldProps.writeOnce && profile[fieldKey]),
      });
    } else {
      configuredData.push({
        name: fieldProps.title,
        required: requiredTest.includes(fieldKey),
        type: fieldProps.type === 'string' ? 'text' : null,
        placeholder: !profile[fieldKey] ? ' ' : (profile[fieldKey] ? profile[fieldKey] : ''),
        writeOnce: !!(fieldProps.writeOnce && profile[fieldKey]),
      });
    }
  });

  if (configuredData != [] && !propertyKeys.includes('document')) {
    configuredData.splice(3, 0, emailInput);
    configuredData.push(passwordInput, confirmPasswordInput, signupReCaptcha);

    /**
     * Additional fields for signup
     */
    configuredData.push(...signupAdditionalFields);
  }



  return configuredData;
};


export const getProfileSchema = (action$, state$, { restApi }) => action$.pipe(
  ofType(types.app.getProfileSchema),
  rx.switchMap(action => Observable.create((observer) => {
    if (state$.value.user.authStatus === 'NONE') {
      observer.next(minimalSchemaPending());
      restApi.getMinimalProfileSchema().then((response) => {
        if (response && response.status !== 404) {
          const profile = {
            city: 'City',
            country: 'Country',
            date_of_birth: 'Date of birth',
            given_name: 'Given name',
            middle_name: 'Middle Name',
            phone_number: 'Phone number',
            postal_code: 'Postal code',
            state_province: 'State/Province',
            status: '',
            street_address: 'Street address',
            surname: 'Surname',
          };
          observer.next(
            minimalSchemaSuccess(
              configureSchema(response.properties, response.required, profile),
            ),
          );
        } else {
          observer.next(minimalSchemaError());
        }
      });
    } else {
      observer.next(extendedSchemaPending());
      restApi.getExtendedProfileSchema().then((response) => {
        observer.next(
          extendedSchemaSuccess(
            configureSchema(
              response.properties,
              response.required,
              state$.value.user.profile,
            ),
          ),
        );
      });
    }
  })),
);

export default getProfileSchema;
