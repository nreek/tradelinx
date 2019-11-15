import React, { PureComponent, Fragment } from 'react';

// Redux
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { makeDeposit } from '../../../actions';
import { selectCurrentTransaction, selectDeposit, selectConfig } from '../../../reducers';
import { status } from '../../../constants';

// Components
import AddressSkeleton from './AddressSkeleton';
import Button from '../../../elements/Button';
import Spinner from '../../../elements/Spinner';

class DepositCrypto extends PureComponent {
  state = {
    loadingAddress: false,
    loadingMessage: '',
    currentTransaction: {},
  };

  componentDidMount() {
    const loadingMessage = this.props.currency.id === 'ETH'
      ? _t(
        'Please wait while we generate a new address on the blockchain. This may take 1-2 minutes in some cases.',
        'DEPOSIT_CRYPTO_MODAL.ETH_LOADING_MESSAGE',
      )
      : _t('Loading wallet address', 'DEPOSIT_CRYPTO_MODAL.WALLET_LOADING_MESSAGE');

    this.setState({
      loadingAddress: true,
      loadingMessage,
    });

    this.props.makeDeposit(this.props.currency.id);
  }

  componentDidUpdate(prevProps) {
    const { currentTransaction, currency } = this.props;
    if (
      (prevProps.currentTransaction.address === null)
      && (currentTransaction.address !== null)
      && (currentTransaction.currency_id === currency.id)
    ) {
      this.setState({
        loadingAddress: false,
        loadingMessage: '',
        currentTransaction: { ...currentTransaction }
      });
    }
  }

  close = () => {
    this.props.showModal('none');
    // TODO: also set deposit ready
  };

  renderLoading = () => (
    <div className="loader-container">
      <div className="loader">
        <Spinner alt />
      </div>
    </div>
  );

  renderWalletAddress = () => {
    const { products } = this.props.config;
    const { currentTransaction, loadingAddress, loadingMessage } = this.state;

    return (
      <Fragment>
        <h3>{_t('Please read the instructions below', 'DEPOSIT_CRYPTO_MODAL.DEPOSIT_INFO_ONE')}</h3>
        <p>
          {_t(
            `Depositing cryptocurrency into the exchange is safe and easy.
            The address below can always be used to deposit cryptocurrency into your account.
            Use your cryptocurrency client or wallet service to send the cryptocurrency to the address below.`,
            'DEPOSIT_CRYPTO_MODAL.DEPOSIT_DESCRIPTION',
          )}
        </p>
        <div className="address-container">
          {currentTransaction
          && currentTransaction.address
          && currentTransaction.currency_id === this.props.currency.id ? (
            <Fragment>
              <div className="crypto-address-qr-code">
                <QRCode
                  value={`${(products[this.props.currency.id]
                    && products[this.props.currency.id].walletName)
                    || this.props.currency.id}:${currentTransaction.address}`}
                  size={128}
                />
              </div>
              <div className="crypto-address-text">
                <p className="crypto-address-title">
                  {_t('Address:', 'DEPOSIT_CRYPTO_MODAL.ADDRESS')}
                </p>
                <p className="crypto-address-code">{currentTransaction.address}</p>
              </div>
            </Fragment>
            ) : (
              <AddressSkeleton
                loading={loadingAddress}
                loadingMessage={loadingMessage}
              />
            )}
        </div>
        <div className="qr-wrapper">
          <p>
            {_t(
              'Once your deposit is sent to this address, your account will automatically update after the cryptocurrency network confirms your transaction.',
              'DEPOSIT_CRYPTO_MODAL.DEPOSIT_INSTRUCTIONS_ONE',
            )}
          </p>
        </div>
        {this.closeButton()}
      </Fragment>
    );
  };

  renderError = () => {
    if (this.props.deposit.statusCode === 'verification_code_mandatory') {
      return (
        <Fragment>
          <h3>
            {_t('An error occurred please contact support.', 'DEPOSIT_CRYPTO_MODAL.ERROR_MESSAGE')}
          </h3>
          {this.closeButton()}
        </Fragment>
      );
    }

    return (
      <Fragment>
        <h3>
          {_t(
            'Looks like we hit a snag. Please close and try again.',
            'DEPOSIT_CRYPTO_MODAL.GENERAL_ERROR',
          )}
        </h3>
        {this.closeButton()}
      </Fragment>
    );
  };

  closeButton = () => (
    <div className="close-button">
      <Button className="close-button" onClick={this.close}>
        {_t('Close', 'DEPOSIT_CRYPTO_MODAL.CLOSE_BUTTON')}
      </Button>
    </div>
  );

  renderDepositStatus = () => {
    const depositView = {
      [status.pending]: this.renderLoading,
      [status.success]: this.renderWalletAddress,
      [status.failed]: this.renderError,
    };

    return depositView[this.props.deposit.request]();
  };

  render() {
    return this.renderDepositStatus();
  }
}

const mapStateToProps = (state) => {
  let currentTransaction = selectCurrentTransaction(state);
  if (!currentTransaction) {
    currentTransaction = {};
  }
  return {
    config: selectConfig(state),
    deposit: selectDeposit(state),
    currentTransaction,
  };
};

const mapDispatchToProps = dispatch => ({
  makeDeposit: product => dispatch(makeDeposit(product)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DepositCrypto);
