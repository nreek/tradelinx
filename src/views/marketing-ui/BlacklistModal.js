import React, { PureComponent } from 'react';
import Button from '../../elements/Button';
import Modal from '../../elements/Modal';

class BlacklistModal extends PureComponent {
  render() {
    return (
      <Modal className="blacklist-modal" onClose={this.props.onClose}>
        <div
          className="modal-blacklist-content"
          dangerouslySetInnerHTML={{
            __html: _t(
              'Cointrader is not available in your country.',
              'BLACKLIST.MESSAGE',
            ),
          }}
        />
        <div className="blacklist-button-container">
          <Button onClick={this.props.onClose}>
            {_t('OK', 'BLACKLIST.OK')}
          </Button>
        </div>
      </Modal>
    );
  }
}

export default BlacklistModal;
