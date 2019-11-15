import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { loadTransactions, loadUserSettings } from '../../../actions';

import DepositCrypto from './deposit-withdraw/DepositCrypto';
import DepositFiat from './deposit-withdraw/DepositFiat';
import WithdrawCrypto from './deposit-withdraw/WithdrawCrypto';
import WithdrawFiat from './deposit-withdraw/WithdrawFiat';


class DepositWithdraw extends Component {
  state = {
    action: 'deposit',
  }

  componentDidMount() {
    this.props.loadTransactions();
    this.props.loadUserSettings();
  }

  setAction = action => this.setState({ action });

  render2FAError = () => {
    return (
      <Fragment>
        <h3>
          {_t('Two-factor authentication code is required for making deposits and withdraws.', 'DEP_WD.2FA_ERROR')}
        </h3>
        <Link to='/settings'>
          {_t('Click here to change your 2FA settings.', 'DEP_WD.2FA_LINK')}
        </Link>
      </Fragment>
    );
  }

  renderComponent = () => {
    const { action } = this.state;
    const { currentCurrency } = this.props;
    const { type } = currentCurrency;

    if (action === 'deposit') {
      if (type === 'crypto') {
        return <DepositCrypto currency={currentCurrency} />
      } else if (type === 'fiat') {
        return <DepositFiat currency={currentCurrency} />
      }
    } else if (action === 'withdraw') {
      if (type === 'crypto') {
        return <WithdrawCrypto currency={currentCurrency} />
      } else if (type === 'fiat') {
        return <WithdrawFiat currency={currentCurrency} />
      }
    }
  }

  render() {
    const { action } = this.state;
    const { currentCurrency } = this.props;

    return (
      <div className='deposit-withdraw component'>
        <div className='component-header'>
          <h1>{_t('Deposit & Withdraw', 'DEP_WD.TITLE')}</h1>
        </div>
        <div className='component-content'>
          <div className='action-selectors'>
            <div 
              className={`action-selector deposit-selector tab ${action === 'deposit' ? 'active' : ''}`}
              onClick={() => this.setAction('deposit')}
            >
              {_t('Deposit', 'GENERIC.DEPOSIT')}
            </div>
            <div 
              className={`action-selector deposit-selector tab ${action === 'withdraw' ? 'active' : ''}`}
              onClick={() => this.setAction('withdraw')}
            >
              {_t('Withdraw', 'GENERIC.WITHDRAW')}
            </div>
          </div>
          <div className={`${action}-${currentCurrency.type}`}>
            {this.props.isUsing2Fa ?
              this.renderComponent()
            :
              this.render2FAError()
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isUsing2Fa: state.settings.is_using_2fa,
});

const mapDispatchToProps = dispatch => ({
  loadTransactions: () => dispatch(loadTransactions()),
  loadUserSettings: () => dispatch(loadUserSettings()),
});

// export default DepositWithdraw;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DepositWithdraw);