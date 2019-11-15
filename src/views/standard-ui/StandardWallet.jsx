import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

// Redux
import { 
  selectProducts,
  selectConfig,
} from '../../reducers';

// React Components
import StandardUiWrapper from './StandardUiWrapper';

import WalletBalances from './wallet/WalletBalances';
import DepositWithdraw from './wallet/DepositWithdraw';
import WalletHistory from './wallet/WalletHistory';

import ErrorBoundary from '../../elements/ErrorBoundary';

class StandardWallet extends PureComponent {
  state = {
    currentCurrency: {}
  }

  componentDidMount() {
    if (Object.keys(this.props.products).length > 0) {
      const { defaultProduct } = this.props.config;
      this.setCurrency(this.props.products[defaultProduct])
    }
  }

  componentDidUpdate(prevProps) {
    if (
      !Object.keys(prevProps.products).length && 
      Object.keys(this.props.products).length > 0 && 
      !Object.keys(this.state.currentCurrency).length
    ) {
      const { defaultProduct } = this.props.config;
      this.setCurrency(this.props.products[defaultProduct]);
    }
  }

  setCurrency = currentCurrency => this.setState({ currentCurrency });

  render() {
    const { currentCurrency } = this.state;
    return (
      <StandardUiWrapper title='Wallet' translation='WALLET'>
        <ErrorBoundary>
          <WalletBalances 
            currentCurrency={currentCurrency} 
            setCurrency={this.setCurrency}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <DepositWithdraw 
            currentCurrency={currentCurrency} 
            setCurrency={this.setCurrency}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <WalletHistory 
            currentCurrency={currentCurrency} 
            setCurrency={this.setCurrency}
          />
        </ErrorBoundary>
      </StandardUiWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  products: selectProducts(state),
  config: selectConfig(state),
});

export default connect(
  mapStateToProps,
  null
)(StandardWallet);
