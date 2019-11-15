import React, { PureComponent, Fragment } from 'react';

class AddressSkeleton extends PureComponent {
  render() {
    return (
      <Fragment>
        <div className="crypto-address-qr-code">
          <div className="placeholder">
            {this.props.loading && <i className="fal fa-spinner fa-spin" />}
          </div>
        </div>
        <div className="crypto-address-text placeholder">
          <div className="crypto-address-title placeholder" />
          <div className="crypto-address-code placeholder">
            {this.props.loadingMessage && <span>{this.props.loadingMessage}</span>}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default AddressSkeleton;
