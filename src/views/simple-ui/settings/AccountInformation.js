import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import FormContainer from '../../../elements/FormContainer';
import SettingsWrapper from './SettingsWrapper';
import { initalSchema } from '../../../../config/formConfig';
import validate from '../../../util/validations';
import Button from '../../../elements/Button';
import UpdatePassword from './UpdatePassword';
// Redux
import { getUserProfile, getProfileSchema, updateUserProfile } from '../../../actions';
import { selectKycStatus, selectUserProfile, status } from '../../../reducers';

const propTypes = {
  translation: PropTypes.string,
};

export class AccountInformation extends Component {
  state = {
    verifyStep: 'form',
    kycFormData: null,
    active: false,
  };

  componentDidMount() {
    this.props.getUserProfile();
    this.props.getProfileSchema();
  }

  onSubmit = (kycFormData) => {
    const date = new Date(kycFormData.dateOfBirth);
    const milliseconds = date.getTime();
    this.setState(
      {
        kycFormData: {
          ...kycFormData,
        },
      },
      () => {
        const kycFormDataPayload = {
          custom_profile: JSON.stringify({
            country: kycFormData.country,
            street_address: kycFormData.streetAddress,
            city: kycFormData.city,
            date_of_birth: milliseconds,
            surname: kycFormData.surname,
            phone_number: kycFormData.phoneNumber,
            state_province: kycFormData['state/province'],
            given_name: kycFormData.givenName,
            middle_name: kycFormData.middleName,
            postal_code: kycFormData.postalCode,
          }),
        };
        this.props.updateUserProfile(kycFormDataPayload);
        this.handleClick();
      },
    );
  };

  handleClick = () => {
    this.setState({
      active: !this.state.active,
    });
  };

  render() {
    const {
      userProfile, schema = {},
    } = this.props;
    const schemaStatus = schema.status || {};
    const schemaPROPS = schema.properties || [];
    let renderedFields = [];

    if (schemaPROPS) {
      renderedFields = [...schemaPROPS];
    }


    const filteredFields = renderedFields.filter(
      field => field.name != 'Document',
    );

    return (
      <SettingsWrapper
        name="Account Information"
        translation={this.props.translation}
      >
        {userProfile
        && userProfile.status === 'SUCCESS'
        && schemaStatus === 'SUCCESS'
        && filteredFields.length ? (
          <FormContainer
            fields={filteredFields}
            initialValues={initalSchema(userProfile)}
            onSubmit={this.state.active === true ? this.onSubmit : null}
            className={`account-form${
              this.state.active === true ? '-active' : ''
            }`}
          />
          ) : null}
        <Button className="button" onClick={this.handleClick}>
          {this.state.active === true 
            ? _t('CANCEL', 'VERIFY.CANCEL') 
            : _t('UPDATE', 'VERIFY.UPDATE')}
        </Button>
        {this.props.updateProfileStatus === 'FAILED' ? (
          <p className="verify-error">
            {_t('Must be over 18 years old', 'VERIFY.AGE_VALIDATION_MESSAGE')}
          </p>
        ) : null}
        <UpdatePassword translation={this.t} />
      </SettingsWrapper>
    );
  }
}

AccountInformation.propTypes = propTypes;

const mapStateToProps = state => ({
  userProfile: selectUserProfile(state),
  schema: state.user.extendedProfileSchema,
  updateProfileStatus: state.user.updateProfileStatus,
});

const mapDispatchToProps = dispatch => ({
  getUserProfile: () => dispatch(getUserProfile()),
  getProfileSchema: () => dispatch(getProfileSchema()),
  updateUserProfile: kycFormDataPayload => dispatch(updateUserProfile(kycFormDataPayload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountInformation);
