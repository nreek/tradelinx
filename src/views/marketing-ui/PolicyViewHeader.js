import React, { Component } from 'react';
import SiteMapNav from './SiteMapNav';
import { Link } from 'react-router-dom';

class PolicyViewHeader extends Component {
  render() {
    return (
      <nav className="alt-nav">
        <div className="nav-container">
          <Link to="/home" className="logo">
            <img
              src="images/logos/company-logo-icon.png"
              className="logo-img"
            />
          </Link>
          <SiteMapNav />
        </div>
      </nav>
    );
  }
}

export default PolicyViewHeader;
