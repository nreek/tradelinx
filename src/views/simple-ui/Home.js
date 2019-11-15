import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUserProfile } from '../../actions';
import { selectKycStatus } from '../../reducers';

// Components
import Button from '../../elements/Button';
import HomeItem from './home/HomeItem';
import SimpleUiWrapper from './SimpleUiWrapper';
import VerifyModal from './home/VerifyModal';
import Modal from '../../elements/Modal';

// Icons
import {
  RegisterAccountIcon,
  FundAccountIcon,
  TransferBitcoinIcon,
} from './home/HomeIcons';


const propTypes = {
  t: PropTypes.string,
};

const defaultProps = {
  t: 'HOME',
};

export class Home extends Component {
  constructor() {
    super();

    this.state = { modal: 'none' };

    this.homeStepContent = [
      {
        header: 'Step 1 - Verify Your Account',
        icon: <RegisterAccountIcon />,
        content:
          "To start making transactions, we run a check to verify your identity. This is for your security and the safety of your funds. We've implemented the latest technology in this process, minimizing the waiting time so that you can have your account up and running fast.",
        action: true,
      },
      {
        header: 'Step 2 - Add Funds',
        icon: <FundAccountIcon />,
        content:
          'To add funds to your account just click on the My Account option in the left menu. There you will be presented your account which you can fund using wire transfer or your existing wallet. The procedure is very simple.',
      },
      {
        header: 'Trade',
        icon: <TransferBitcoinIcon />,
        content:
          'Buying, selling, and trading cryptocurrency in CoinTrader is extremely simple, and after just a few steps you will complete each transaction quickly and securely. Just click the Buy/Sell buttons on the left menu and you will be well on your way. Clarity and simplicity are our main goals, but if you have any questions, just let us know and we will assist you.',
      },
    ];
  }

  showModal = modal => () => {
    this.props.getUserProfile();
    this.setState({ modal });
  };

  verifyAction = () => {
    let message = '';
    let messageIdentifier = '';

    if (!this.props || !this.props.kycStatus) {
      return null;
    }

    if (this.props.kycStatus.status_code === 'OK') {
      message = 'Verification in process';
      messageIdentifier = 'HOME.VERIFY_BUTTON_PENDING';
    } else {
      switch (this.props.kycStatus.status) {
        case 'not_started':
          message = 'Verify Your Account';
          messageIdentifier = 'HOME.VERIFY_BUTTON_NOT_STARTED';
          break;
        case 'pending':
        case 'approved':
        case 'in_progress':
          message = 'Verification in process';
          messageIdentifier = 'HOME.VERIFY_BUTTON_PENDING';
          break;
        case 'rejected':
        case 'failed':
          message = 'Verification error';
          messageIdentifier = 'HOME.VERIFY_BUTTON_REJECTED';
          break;
        case 'succeeded':
          message = 'Account Verified';
          messageIdentifier = 'HOME.VERIFY_BUTTON_VERIFIED';
          break;
        default:
          break;
      }
    }

    return (
      <Button onClick={this.showModal('verify')}>
        {_t(message, messageIdentifier)}
      </Button>
    );
  }

  render() {
    return (
      <SimpleUiWrapper
        title="Home"
        pageHeader="Getting Started with TradeLinx"
        description="Please complete these three easy steps to fully enable your member platform."
        translation={this.props.t}
        pageClass='home'
      >
        <div className="trade-steps-container">
          {this.homeStepContent.map((step, i) => (
            <HomeItem
              action={step.action ? this.verifyAction() : null}
              content={_t(step.content, `${this.props.t}_${i + 1}_CONTENT`)}
              header={_t(step.header, `${this.props.t}.STEP_${i + 1}_HEADER`)}
              icon={step.icon}
              key={i}
            />
          ))}
        </div>
        {this.state.modal === 'verify' ? (
          <Modal className="verify" onClose={this.showModal('none')}>
            <VerifyModal onClose={this.showModal('none')} />
          </Modal>
        ) : null}
      </SimpleUiWrapper>
    );
  }
}

const mapStateToProps = state => ({
  kycStatus: selectKycStatus(state),
});

const mapDispatchToProps = dispatch => ({
  getUserProfile: () => dispatch(getUserProfile()),
});

Home.propTypes = propTypes;
Home.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
