import React from 'react';
import Fade from 'react-reveal/Fade';
/*
TODO's: convert the svg icons into separate react components (see riotx.com branch)

*/


const About = () => (
  <div>
    <div id="about">
      <Fade left>
        <div>
          <img src="images/icons/dotglobe.svg" className="dotglobe" />
        </div>
      </Fade>
      <Fade right>
        <div className="about-list-content">
          <h5 className="">{_t('About Cointrader', 'MARKETING.ABOUT_BLOCK_ONE_TITLE')}</h5>
          <p>
              Aenean lacinia bibendum nulla sed consectetur. Sed posuere consectetur est at lobortis.
              Maecenas faucibus mollis interdum. Maecenas sed diam eget risus varius blandit sit amet non magna.
              Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
              Vestibulum id ligula porta felis euismod semper.
              Donec id elit non mi porta gravida at eget metus. Aenean lacinia bibendum nulla sed consectetur.
              Cras justo odio, dapibus ac facilisis in, egestas eget quam.
          </p>
        </div>
      </Fade>
    </div>


    <div id="vision">
      <Fade left>
        <div className="about-list-content">
          <h5 className="">{_t('About Us', 'MARKETING.ABOUT_BLOCK_TWO_TITLE')}</h5>
          <p>
              Aenean lacinia bibendum nulla sed consectetur. Sed posuere consectetur est at lobortis.
              Maecenas faucibus mollis interdum. Maecenas sed diam eget risus varius blandit sit amet non magna.
              Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
              Vestibulum id ligula porta felis euismod semper.
          </p>
          <h5 className="">{_t('Address', 'MARKETING.ABOUT_ADDRESS_TITLE')}</h5>
          <p>
            {_t('315 Madison Ave, 24th Floor', 'MARKETING.ABOUT_ADDRESS_TEXT_ONE')}
            <br />
            {_t('New York, NY 10017', 'MARKETING.ABOUT_ADDRESS_TEXT_TWO')}
          </p>
        </div>
      </Fade>
      <Fade right>
        <div className="">
          <img src="images/icons/stackedsquares.svg" className="stackedsquares" />
        </div>
      </Fade>
    </div>
  </div>

);

export default About;
