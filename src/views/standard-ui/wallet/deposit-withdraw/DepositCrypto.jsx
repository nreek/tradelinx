import React, { PureComponent, Fragment } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Redux
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { makeDeposit } from '../../../../actions';
import { selectCurrentTransaction, selectDeposit, selectConfig } from '../../../../reducers';
import { status } from '../../../../constants/statuses';

// Components
import Button from '../../../../elements/Button';
import Spinner from '../../../../elements/Spinner';

class DepositCrypto extends PureComponent {
  state = {
    loadingAddress: false,
    loadingMessage: '',
  };

  componentDidMount() {
    this.setLoading(true);
    this.props.makeDeposit(this.props.currency.id);
  }

  componentDidUpdate(prevProps) {
    if (
      (prevProps.currentTransaction.address === null)
      & (this.props.currentTransaction.address !== null)
    ) {
      this.setLoading(false);
    }

    if (prevProps.currency.id !== this.props.currency.id) {
      this.setLoading(true);
      this.props.makeDeposit(this.props.currency.id);
    }
  }

  /**
   * @param {Bool} loadingAddress - if component is waiting to receive crypto address
   */
  setLoading = (loadingAddress) => {
    let loadingMessage = '';

    if (loadingAddress) {
      loadingMessage = this.props.currency.id === 'ETH'
        ? _t(
          'Please wait while we generate a new address on the blockchain. This may take 1-2 minutes in some cases.',
          'DEPOSIT_CRYPTO.ETH_LOADING',
        )
        : _t('Loading wallet address', 'DEPOSIT_CRYPTO.WALLET_LOADING');
    }

    this.setState({
      loadingAddress,
      loadingMessage,
    });
  }

  copyToClipboard = (textToCopy) => {
    const self = this;

    function copyAddress(text) {
      try {
        const textarea = document.createElement('textarea');
        textarea.id = 'copy-this-address';
        textarea.innerText = text;
        document.body.appendChild(textarea);
        textarea.select();
        if (document.execCommand("copy")) {
          textarea.remove();
          return true;
        }
      } catch(error) {
        throw error;
      }
      textarea.remove();
      return false;
    }

    if (copyAddress(textToCopy)) {
      toast.success(_t('Copied to clipboard', 'TOASTS.COPIED_TO_CLIPBOARD'));
    } else {
      toast.error(_t('Copy failed', 'TOASTS.COPY_FAILED'));
      console.log('Copy failed');
    }
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
    const { currency, currentTransaction } = this.props;
    const { loadingAddress, loadingMessage } = this.state;

    return (
      <Fragment>
        <div className='crypto-product deposit-crypto-row'>
          <h2 className='crypto-product-title row-title'>{_t('Deposit', 'GENERIC.DEPOSIT')}</h2>
          <div className='crypto-product-name'>
            <img alt='' className={`currency-icon ${currency.id}-icon`} src={`images/icons/currency-icons/black/${currency.id}.svg`} />
            <h2>{currency.name}</h2>
          </div>
        </div>
        <div className='crypto-address-text deposit-crypto-row'>
          <h2 className="crypto-address-text-title row-title">{_t('Address', 'DEPOSIT_CRYPTO.ADDRESS')}</h2>
          <div className="crypto-address-text-code">
            {currentTransaction
              && currentTransaction.address
              && currentTransaction.currency_id === currency.id ?
                <p>{currentTransaction.address}</p>
                :
                <p>{loadingMessage}</p>
            }
            <button 
              className='crypto-address-copy-button button' 
              disabled={loadingAddress} 
              onClick={() => this.copyToClipboard(currentTransaction.address)} 
            >
              {_t('Copy Code', 'DEPOSIT_CRYPTO.COPY_CODE')}
            </button>
          </div>
        </div>
        <div className="crypto-address-qr-code deposit-crypto-row">
          <h2 className='crypto-address-qr-code-title row-title'>{_t('QR Code', 'DEPOSIT_CRYPTO.QR_CODE')}</h2>
          <div className="crypto-address-qr-code-image">
          {this.props.currentTransaction
          && this.props.currentTransaction.address
          && this.props.currentTransaction.currency_id == this.props.currency.id ? (
            <Fragment>
              <QRCode
                value={`${(products[this.props.currency.id]
                  && products[this.props.currency.id].walletName)
                  || this.props.currency.id}:${this.props.currentTransaction.address}`}
                size={80}
              />
              <p>
                {_t(
                  'Once your deposit is sent to this address, your account will automatically update after the cryptocurrency network confirms your transaction.',
                  'DEPOSIT_CRYPTO.INSTRUCTIONS_1',
                )}
              </p>
            </Fragment>
          ) : (
            <Fragment>
              <div className='placeholder'>
                <i className="fal fa-spinner fa-spin" />
              </div>
            </Fragment>
          )}
          </div>
        </div>
        <ToastContainer />
      </Fragment>
      );
    };
    
  renderError = () => {
    if (this.props.deposit.statusCode === 'verification_code_mandatory') {
      return (
        <Fragment>
          <h3>
            {_t('An error occurred please contact support.', 'DEPOSIT_CRYPTO.VERIFICATION_ERROR')}
          </h3>
          {/* {this.closeButton()} */}
        </Fragment>
      );
    }

    return (
      <Fragment>
        <h3>
          {_t(
            'Looks like we hit a snag. Please try again.',
            'DEPOSIT_CRYPTO.GENERAL_ERROR',
          )}
        </h3>
        {/* {this.closeButton()} */}
      </Fragment>
    );
  };

  closeButton = () => (
    <div className="close-button">
      <Button className="close-button" onClick={this.close}>
        {_t('Close', 'BUTTON.CLOSE')}
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
