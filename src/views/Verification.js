import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { verifyUser } from '../actions';
import { selectVerificationStatus } from '../reducers';

import Button from '../elements/Button';

import { status } from '../constants';

import '../../scss/email-ui.scss';
import logo from '../../images/logos/company-logo-white.png';


export class Verification extends Component {
  state = {
    redirect: null,
  };

  componentDidMount() {
    const hash = this.props.location.search.match(/hash=([^&]*)/)[1];
    this.props.verifyUser(hash);
  }

  renderPending = () => (
    <Fragment>
      <p>{_t('Verifying email...', 'VERIFICATION.PENDING')}</p>
    </Fragment>
  );

  renderSuccess = () => (
    <Fragment>
      <div className="status success">
        {_t('Verification Successful', 'VERIFICATION.SUCCESS')}
      </div>
      <p>
        {_t(
          'Your account is now verified. Login and start trading.',
          'VERIFICATION.SUCCESS_MSG',
        )}
      </p>
      <div className="action-button">
        <Button onClick={() => this.setState({ redirect: 'login' })}>
          {_t('Login', 'VERIFICATION.LOGIN')}
        </Button>
      </div>
    </Fragment>
  );

  renderFailed = () => (
    <Fragment>
      <div className="status failed">
        {_t('Verification Failed', 'VERIFICATION.FAILED')}
      </div>
      <p>
        {_t(
          'You may already be verified. Try logging in or make a new account.',
          'VERIFICATION.FAILED_MSG',
        )}
      </p>
      <div className="action-button">
        <Button onClick={() => this.setState({ redirect: 'login' })}>
          {_t('Login', 'VERIFICATION.LOGIN')}
        </Button>
        <Button onClick={() => this.setState({ redirect: 'sign up' })}>
          {_t('Sign Up', 'VERIFICATION.SIGN_UP')}
        </Button>
      </div>
    </Fragment>
  );

  renderVerificationStatus = () => {
    const verificationStatus = {
      [status.pending]: this.renderPending,
      [status.success]: this.renderSuccess,
      [status.failed]: this.renderFailed,
    };
    if (verificationStatus[this.props.verificationStatus]) {
      return verificationStatus[this.props.verificationStatus]();
    }
    return verificationStatus[status.pending]();
  };

  render() {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{ pathname: '/', state: { modal: this.state.redirect } }}
        />
      );
    }
    return (
      <div className="ui-container">
        <div className="ui-child">
          <div className="logo">
            <img src={logo} />
          </div>
          <div className="ui-status">{this.renderVerificationStatus()}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  verificationStatus: selectVerificationStatus(state),
});

const mapDispatchToProps = dispatch => ({
  verifyUser: hash => dispatch(verifyUser(hash)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Verification);
