import React from 'react';
import Fade from 'react-reveal/Fade';
/*
TODO's: convert the svg icons into separate react components (see riotx.com branch)

*/


const Features = () => (
  <div id="features">
    <Fade left>
      <div className="feat-list-content">
        <img className="content-icon" src="images/icons/SiteIcons2-01.svg" />
        <h5 className="subtitle force-flex-break">{_t('Next Gen Crypto Exchange', 'MARKETING.FEATURES_BLOCK_ONE_TITLE')}</h5>
        <p>{_t('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam porttitor, nunc nec mattis finibus, nulla eros suscipit nibh', 'MARKETING.FEATURES_BLOCK_ONE_TEXT')}</p>
      </div>
    </Fade>
    <Fade right>
      <div className="feat-list-content">
        <img className="content-icon" src="images/icons/SiteIcons2-02.svg" />
        <h5 className="subtitle force-flex-break">{_t('Market Data Streaming', 'MARKETING.FEATURES_BLOCK_TWO_TILE')}</h5>
        <p>{_t('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam porttitor, nunc nec mattis finibus, nulla eros suscipit nibh', 'MARKETING.FEATURES_BLOCK_TWO_TEXT')}</p>
      </div>
    </Fade>
    <Fade left>
      <div className="feat-list-content">
        <img className="content-icon" src="images/icons/SiteIcons2-03.svg" />
        <h5 className="subtitle force-flex-break">{_t('Advanced Financial Integrations', 'MARKETING.FEATURES_BLOCK_THREE_TILE')}</h5>
        <p>{_t('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam porttitor, nunc nec mattis finibus, nulla eros suscipit nibh', 'MARKETING.FEATURES_BLOCK_THREE_TEXT')}</p>
      </div>
    </Fade>
    <Fade right>
      <div className="feat-list-content">
        <img className="content-icon" src="images/icons/SiteIcons2-04.svg" />
        <h5 className="subtitle force-flex-break">{_t('Modular Design', 'MARKETING.FEATURES_BLOCK_FOUR_TILE')}</h5>
        <p>{_t('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam porttitor, nunc nec mattis finibus, nulla eros suscipit nibh', 'MARKETING.FEATURES_BLOCK_FOUR_TEXT')}</p>
      </div>
    </Fade>
  </div>
);

export default Features;
