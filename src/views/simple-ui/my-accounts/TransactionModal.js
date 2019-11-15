import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { capitalize } from '../../../util/helpers';

// Redux
import { loadUserSettings } from '../../../actions';

// Components
import Modal from '../../../elements/Modal';
import Deposit from './Deposit';
import DepositFiat from './DepositFiat';
import DepositCrypto from './DepositCrypto';
import Withdraw from './Withdraw';
import WithdrawFiat from './WithdrawFiat';
import WithdrawCrypto from './WithdrawCrypto';

const propTypes = {
  transactionType: PropTypes.string,
  currency: PropTypes.instanceOf(Object),
  showModal: PropTypes.instanceOf(Function),
};

const defaultProps = {
  currency: {},
  transactionType: '',
  showModal: () => {},
};

// Type of transaction
const DEPOSIT = 'deposit';

// Type of curency
const FIAT = 'fiat';
const CRYPTO = 'crypto';
const DEFAULT = 'default';

const withdraws = {
  [FIAT]: WithdrawFiat,
  [CRYPTO]: WithdrawCrypto,
  [DEFAULT]: Withdraw,
};

const deposits = {
  [FIAT]: DepositFiat,
  [CRYPTO]: DepositCrypto,
  [DEFAULT]: Deposit,
};

export class TransactionModal extends PureComponent {
  componentDidMount() {
    if (this.props.isUsing2Fa === undefined) {
      this.props.loadUserSettings();
    }
  }

  renderTransaction = () => {
    const { transactionType, ...props } = this.props;

    return transactionType === DEPOSIT ? this.renderDeposit(props) : this.renderWithdraw(props);
  };

  renderWithdraw(props) {
    const { currency } = this.props;
    const WithdrawComponent = withdraws[currency.type] || withdraws[DEFAULT];

    return <WithdrawComponent onClose={this.onClose} {...props} />;
  }

  render2FaMessage = () => (
    <Fragment>
      <h3>
        {_t(
          'Two-factor authentication is required for making deposits and withdraws.',
          'DEPOSIT_CRYPTO_MODAL.2FA_REQ_1',
        )}
      </h3>
      <p>
        <Link to="/settings">
          {_t('Click here to change your 2FA settings.', 'DEPOSIT_CRYPTO_MODAL.CHANGE_2FA')}
        </Link>
      </p>
    </Fragment>
  );

  onClose = () => {
    this.props.showModal('none');
  };

  renderDeposit(props) {
    const { currency } = this.props;
    const DepositComponent = deposits[currency.type] || deposits[DEFAULT];

    return <DepositComponent onClose={this.onClose} {...props} />;
  }

  render() {
    const { transactionType, currency } = this.props;
    return (
      <Modal className={`${transactionType}-${currency.type}`} onClose={this.onClose}>
        {this.props.isUsing2Fa ? (
          <div>
            <h2>
              {_t(
                `${capitalize(transactionType)} ({currency})`,
                `${transactionType.toUpperCase()}.TITLE`,
                {
                  currency: currency.id,
                },
              )}
            </h2>
            {this.renderTransaction()}
          </div>
        ) : (
          this.render2FaMessage()
        )}
      </Modal>
    );
  }
}

TransactionModal.propTypes = propTypes;
TransactionModal.defaultProps = defaultProps;

const mapStateToProps = state => ({
  isUsing2Fa: state.settings.is_using_2fa,
});

const mapDispatchToProps = dispatch => ({
  loadUserSettings: () => dispatch(loadUserSettings()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TransactionModal);
