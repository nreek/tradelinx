import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
// REDUX
import { updateUserProfile } from '../../../actions';
import { extendedProfileSchema, selectUserProfile } from '../../../reducers/user';

class PhoneNumber extends Component {
  state = {
    phoneNumber: '',
  };

  submitUpdatedUserProfile = (uploadedFilename = '') => {
    const { userProfile, schema } = this.props;
    const profileKeys = Object.keys(userProfile);
    const filteredKeys = profileKeys.filter(x => x !== 'status');

    if (filteredKeys.length === schema.properties.length) {
      const kycFormDataPayload = {
        custom_profile: JSON.stringify({
          ...userProfile,
          phone_number: this.state.phoneNumber,
        }),
      };
      this.props.updateUserProfile(kycFormDataPayload);
    } else {
      const kycFormDataPayload = {
        custom_profile: JSON.stringify({
          ...userProfile,
          country: '-',
          street_address: '',
          city: '',
          date_of_birth: 648853220000,
          phone_number: this.state.phoneNumber,
          state_province: '',
          postal_code: '',
        }),
      };
      this.props.updateUserProfile(kycFormDataPayload);
    }
  };

  handleChange = () => {
    this.setState({
      phoneNumber: event.target.value,
    });
  };

  renderPhoneNumber = () => {
    if (this.props.profileSchema !== undefined && this.props.profileSchema.status === 'SUCCESS') {
      const phoneNumber = this.props.profileSchema.properties.find(x => x.name === 'Phone number');
      return <input placeholder={phoneNumber.placeholder} onChange={this.handleChange} />;
    }
  };

  render() {
    return (
      <Fragment>
        {this.renderPhoneNumber()}
        <a onClick={this.submitUpdatedUserProfile}>EDIT</a>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  profileSchema: extendedProfileSchema(state),
  userProfile: selectUserProfile(state),
  schema: extendedProfileSchema(state),
});

const mapDispatchToProps = dispatch => ({
  updateUserProfile: kycFormDataPayload => dispatch(updateUserProfile(kycFormDataPayload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PhoneNumber);
