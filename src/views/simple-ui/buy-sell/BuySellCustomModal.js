import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from '../../../elements/Modal';

class BuySellCustomModal extends Component {
  renderSuccess = () => (
    <div className="buy-sell-custom-modal-wrapper">
      <img src="images/icons/check.svg" />
      <p>{_t('Order submitted and executed successfully', 'BUY_SELL_CUSTOM.MODAL_SUCCESS')}</p>
    </div>
  );

  renderFailure = () => (
    <div className="buy-sell-custom-modal-wrapper">
      <img src="images/icons/errorX.svg" />
      <p>{_t('There was an error placing your order.', 'BUY_SELL.ERROR_TITLE')}</p>
      <p>{this.props.orderStatus.message}</p>
    </div>
  );

  render() {
    const { quotevalue, onClose } = this.props;
    return (
      <Modal onClose={onClose}>
        {quotevalue === '' || quotevalue <= 0 || this.props.orderStatus.status === 'rejected'
          ? this.renderFailure()
          : this.renderSuccess()}
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  orderStatus: state.orderStatus,
});

export default connect(
  mapStateToProps,
  null,
)(BuySellCustomModal);
