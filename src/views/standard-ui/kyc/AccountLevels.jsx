import React, { Component } from 'react';
import { connect } from 'react-redux';

import { selectKycStatus } from '../../../reducers/user';

import Spinner from '../../../elements/Spinner';

class AccountLevels extends Component {
  render() {
    if (this.props.kycStatus) {
      const { status, status_code } = this.props.kycStatus || {};
      let level = 0;
      
      if (
        status === 'pending'
        || status_code === 'OK'
        || status === 'approved'
        || status === 'in_progress'
      ) {
        level = 1;
      }
      if (status === 'succeeded') {
        level = 2;
      }

      return (
        <div className='account-levels component'>
          <div className='component-header'>
            <h1>{_t('Account Levels', 'KYC_LEVELS.TITLE')}</h1>
          </div>
          <div className='component-content'>
            <section className='account-level-section'>
              <i className={`fas fa-circle account-level-dot ${level > 0 ? 'highlight' : ''}`} />
              <h4 className='account-level-title'>{_t('Level 1 - Deposit Funds', 'KYC_LEVELS.LEVEL_1_TITLE')}</h4>
              <ul className='account-level-details'>
                <li>{_t('First Name', 'KYC_LEVELS.LEVEL_1_TEXT_1')}</li>
                <li>{_t('Last Name', 'KYC_LEVELS.LEVEL_1_TEXT_2')}</li>
              </ul>
            </section>
            <section className='account-level-section'>
              <i className={`fas fa-circle account-level-dot ${level > 1 ? 'highlight' : ''}`} />
              <h4>{_t('Level 2 - Withdraw Funds', 'KYC_LEVELS.LEVEL_2_TITLE')}</h4>
              <ul className='account-level-details'>
                <li>{_t('Address', 'KYC_LEVELS.LEVEL_2_TEXT_1')}</li>
                <li>{_t('Date of Birth', 'KYC_LEVELS.LEVEL_2_TEXT_2')}</li>
              </ul>
            </section>
          </div>
        </div>
      )
    } else {
      return (
        <div className="loader-container">
          <div className="loader">
            <Spinner />
          </div>
        </div>
      )
    }
  }
}

const mapStateToProps = state => ({
  kycStatus: selectKycStatus(state),
});

export default connect(
  mapStateToProps,
  null
)(AccountLevels);