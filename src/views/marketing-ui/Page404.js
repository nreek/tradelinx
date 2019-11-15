import React, { Component } from 'react';
import Nav from './Nav';
import Footer from './Footer';
import '../../../scss/page404.scss';

export default class Page404 extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div id="page404">
        <Nav className="page404-header" />
        <div className="content">
          <h2 className="page-header">{_t('Sorry, page you are looking for not found.', 'MARKETING.NOT_FOUND_PAGE.TITLE') }</h2>
          <h1 className="page-header-main">404</h1>
        </div>
        <Footer className="page404-footer" />
      </div>
    )
  }
}