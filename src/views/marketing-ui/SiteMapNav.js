import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';


const SiteMapNav = () => (
  <ul className="nav-items">
    <li>
      <NavLink to="/terms">
        {_t('Terms', 'MARKETING.SITEMAP_LINK_TERMS')}
      </NavLink>
    </li>
    <li>
      <NavLink to="/privacy">
        {_t('Privacy policy', 'MARKETING.SITEMAP_LINK_PRIVACY')}
      </NavLink>
    </li>
  </ul>
);

export default SiteMapNav;
