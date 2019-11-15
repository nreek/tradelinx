import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Nav from './Nav';
import Features from './Features';
import BuyCrypto from './BuyCrypto';
import About from './About';
import Footer from './Footer';
import BlacklistModal from './BlacklistModal';
import MaintenanceMessage from '../MaintenanceMessage';
import { setDisplayMobile } from '../../actions';
import '../../../scss/marketing.scss';
import '../../../images/WAVE-BACKGROUND.svg';
import '../../../images/splash-hero-banner-bg-img.svg';
import '../../../images/CRYPTO_BG.svg';

import {
  isMaintenanceMessageEnabled,
} from '../../reducers';


/*
TODO's: add <p className="home-hero-blurb">{_t('', 'MARKETING.HOME_HERO_BLURB')}</p>

*/

const propTypes = {
  t: PropTypes.string,
  isMaintenanceModeEnabled: PropTypes.bool,
};

const defaultProps = {
  t: 'MARKETING',
  isMaintenanceModeEnabled: false,
};

export class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { modal: props.blacklistMode ? 'blacklist' : 'none' };
  }
  
  componentDidMount = () => {
    this.senseMobileWidth();
    window.addEventListener('resize', this.senseMobileWidth);
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.senseMobileWidth);
  };

  senseMobileWidth = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth < 768) {
      this.props.setDisplayMobile(true);
    } else {
      this.props.setDisplayMobile(false);
    }
  };

  render() {
    return (
      <div id="top">
        {this.props.isMaintenanceMessageEnabled && <MaintenanceMessage pageType={'marketing-ui'} />}
        <div id="splash-hero-banner-wrapper">
          <Nav
            blacklistMode={this.props.blacklistMode}
          />
          <div className="top-container">
            <img
              className="main-logo"
              src="images/logos/company-logo-white.png"
            />

          </div>
          {/* <Ticker /> TODO add ability to return tickers without login */}
          <div className="mobileLogin only-show-on-mobile">
            <Link to="/login">
              <button to="/login" className="login-btn">
                {_t('Login', `${this.props.t}.LOGIN_MODAL_BTN`)}
              </button>
            </Link>
            <Link to="/signup" className="signup">
              {_t('Sign Up', `${this.props.t}.SIGNUP_MODAL_BTN`)}
            </Link>
          </div>
        </div>

        <Features />
        <BuyCrypto />
        <About />
        <Footer />
        {this.state.modal === 'blacklist' ? <BlacklistModal /> : null}
      </div>
    );
  }
}

Main.propTypes = propTypes;
Main.defaultProps = defaultProps;

const mapStateToProps = state => ({
  isMaintenanceMessageEnabled: isMaintenanceMessageEnabled(state),
});

const mapDispatchToProps = dispatch => ({
  setDisplayMobile: payload => dispatch(setDisplayMobile(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
