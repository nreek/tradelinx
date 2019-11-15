import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import SiteMapNav from './SiteMapNav';

const Footer = () => (
  <div id="footer">
    <div className="footer-content-wrapper">
      <div className="footer-logo-container">
        <img className="footer-logo-img" src="images/logos/company-logo-white.png" />
        <p className="client-registration-id">{_t('IBC ID Number', 'MARKETING.REGISTRATION_ID')}</p>
      </div>

      <div className="footer-info-container">
        <div>
          <h5>{_t('Address', 'MARKETING.FOOTER_TITLE_ADDRESS')}</h5>
          <p className="footer-address">{_t('30 Wall Street, 8th Floor,', 'MARKETING.FOOTER_LINK_ADDRESS_ONE')}</p>
          <p className="footer-address-last">{_t('New York, NY 10005', 'MARKETING.FOOTER_LINK_ADDRESS_TWO')}</p>
        </div>

        <div className="footer-item">
          <h5>{_t('Contact', 'MARKETING.FOOTER_TITLE_CONTACT')}</h5>
          <ul className="footer-list">
            <li className="footer-list-item">
              <a href="#">
                {_t('Twitter', 'MARKETING.FOOTER_LINK_TWITTER')}
              </a>
            </li>
            <li className="footer-list-item">
              <a href="#">
                {_t('Facebook', 'MARKETING.FOOTER_LINK_FACEBOOK')}
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-item">
          <h5>{_t('Sitemap', 'MARKETING.FOOTER_TITLE_SITEMAP')}</h5>
          <SiteMapNav />
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
