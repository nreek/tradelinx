import React, { Component } from 'react';
// Redux
import { connect } from 'react-redux';
import { selectConfig } from '../reducers';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  componentDidCatch(error, info) {
    this.setState({
      hasError: true,
      error,
      errorInfo: info,
    });
  }

  render() {
    const errorMessage = 'Something went wrong';
    const { debug = {} } = this.props.config;
    if (this.state.hasError) {
      if (this.props.customErrorRender) {
        return this.props.customErrorRender;
      }
      return (
        <div className="error-boundary">
          <h2 className="error-title">
            <i className="far fa-exclamation-triangle error-icon" />
            {' '}
            {errorMessage}
          </h2>
          {debug.jsError
              && (
              <details className="error-details">
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </details>
              )
            }

        </div>
      );
    }

    if (!this.props.children) return null;

    return this.props.children;
  }
}

const mapStateToProps = state => ({
  config: selectConfig(state),
});

export default connect(
  mapStateToProps,
  null,
)(ErrorBoundary);
