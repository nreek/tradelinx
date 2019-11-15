import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import DatePicker from 'react-datepicker';
// Redux
import { connect } from 'react-redux';

import moment from 'moment';
import { toAllCaps, getFormattedDate } from '../../util/helpers';
import ErrorTooltip from '../ErrorTooltip';
import 'react-datepicker/dist/react-datepicker.css';

const propTypes = {
  name: PropTypes.string,
  placeholderText: PropTypes.string,
  value: PropTypes.number,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  details: PropTypes.string,
  label: PropTypes.string,
  showYearDropdown: PropTypes.bool,
  className: PropTypes.string,
  dropdownMode: PropTypes.string,
  shouldCloseOnSelect: PropTypes.bool,
  showTimeSelect: PropTypes.bool,
  writeOnce: PropTypes.bool,
};

const defaultProps = {
  className: '',
  placeholderText: '',
  showYearDropdown: true,
  dropdownMode: 'select',
  shouldCloseOnSelect: true,
  profile: {},
  showTimeSelect: false,
  writeOnce: false,
};

export class DateInput extends Component {
  state = {
    date: null,
    ageValidation: true,
  };

  handleChange = (dateObj) => {
    this.setState({
      date: moment(dateObj),
    });
    const event = { target: { value: getFormattedDate(moment(dateObj, 'x')), type: 'date' } };
    this.props.onChange(event);
  };

  render() {
    const {
      profile,
      name,
      translation,
      showYearDropdown,
      dropdownMode,
      shouldCloseOnSelect,
      maxDate,
      minDate,
      className,
      details,
      errorMessages,
      placeholderText,
      label,
      required,
      writeOnce
    } = this.props;
    const translatedName = _t(name, `${translation}.${toAllCaps(name)}`);

    const convertDate = moment(new Date(profile.date_of_birth));
    const defaultDate = (profile.status === 'SUCCESS' && profile.date_of_birth === null)
      || profile.date_of_birth === undefined
      ? null
      : convertDate;

    const props = {
      showYearDropdown,
      className: 'date-picker',
      dropdownMode,
      shouldCloseOnSelect,
    };
    
    if (maxDate) {
      props.maxDate = maxDate;
    }

    if (minDate) {
      props.minDate = minDate;
    }
    props.showTimeSelect = this.props.showTimeSelect;

    return (
      <div className={`form-field date-input ${className}`}>
        <div className="field-label">
          {label || translatedName}
          {required ? <span className="form-required">*</span> : ''}
          {details && <div className="field-details">{details}</div>}
        </div>
        <div className="field-content">
          <ErrorTooltip errorMessages={errorMessages} />
          <DatePicker
            showYearDropdown
            ref="picker"
            onChange={this.handleChange}
            selected={
              profile.status === 'SUCCESS' && this.state.date === null
                ? defaultDate
                : this.state.date
            }
            placeholderText={
              _t(placeholderText, `${translation}.${toAllCaps(name)}_PLACEHOLDER`) || translatedName
            }
            disabled={writeOnce}
            {...props}
          />
        </div>
      </div>
    );
  }
}

DateInput.propTypes = propTypes;
DateInput.defaultProps = defaultProps;

const mapStateToProps = state => ({
  profile: state.user.profile,
});

export default connect(
  mapStateToProps,
  null,
)(DateInput);
