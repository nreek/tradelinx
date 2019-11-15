import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { selectUserAuthStatus, authStatus } from '../../reducers';

// Components
import Spinner from '../../elements/Spinner';


export default function (ComposedComponent) {
  class RequiresAuth extends Component {
    componentDidMount() {
      this.checkAndRedirect();
    }

    componentDidUpdate() {
      this.checkAndRedirect();
    }

    checkAndRedirect() {
      if (!this.props.authStatus === authStatus.success) {
        this.props.history.push('/');
      }
    }

    render() {
      if (
        this.props.authStatus === authStatus.failed
        || this.props.authStatus === authStatus.none
      ) {
        return <Redirect to="/" />;
      } if (this.props.authStatus === authStatus.success) {
        return <ComposedComponent {...this.props} />;
      }

      // TODO: make a better loading status
      return (
        <div>
          <div style={{ color: 'white', textAlign: 'center' }}>
            {_t('Loading account...', 'REQUIRES_AUTH.LOADING')}
          </div>
          <div className="loader-container">
            <div className="loader">
              <Spinner />
            </div>
          </div>
        </div>
      );
    }
  }

  const mapStateToProps = state => ({
    authStatus: selectUserAuthStatus(state),
  });

  return connect(
    mapStateToProps,
    null,
  )(RequiresAuth);
}
