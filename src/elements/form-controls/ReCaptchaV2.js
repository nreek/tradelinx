import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';

const DARK = 'dark';

export class ReCAPTCHAv2 extends Component {
  constructor(props) {
    super(props);
    this.onChangeHandler = this.onChange.bind(this);
  }

  onChange(value) {
    if (value && value.length) {
      this.props.onChange(this.props.name, true);
    }
  }

  render() {
    const { reCaptcha = {} } = this.props.config;
    const theme = this.props.theme || reCaptcha.theme || DARK;
    return (
      <ReCAPTCHA
        sitekey={reCaptcha.key}
        onChange={this.onChangeHandler}
        theme={theme}
      />
    );
  }
}

const mapStateToProps = state => ({
  config: state.config,
});

export default connect(
  mapStateToProps,
  null,
)(ReCAPTCHAv2);
