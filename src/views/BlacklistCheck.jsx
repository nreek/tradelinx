import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import Main from './marketing-ui/Main';


const propTypes = {
  geoLookup: PropTypes.instanceOf(Object),
  user: PropTypes.instanceOf(Object),
};

const defaultProps = {
  geoLookup: {},
  user: {},
};

export class BlacklistCheck extends Component {
  render() {
    const { location } = this.props.user;
    if (location && this.props.geoLookup.blacklistCountries // TODO: clean up conditional
      && this.props.geoLookup.blacklistCountries.includes(
        location.country_short || location.country_long,
      )) {
      return <Route path="/" render={() => <Main blacklistMode t="MARKETING" />} />;
    }
    return ([this.props.children]);
  }
}

BlacklistCheck.propTypes = propTypes;
BlacklistCheck.defaultProps = defaultProps;

const mapStateToProps = state => ({
  geoLookup: state.config.geoLookup,
  user: state.user,
});

export default connect(
  mapStateToProps,
  undefined,
)(BlacklistCheck);
