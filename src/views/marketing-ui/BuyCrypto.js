import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class BuyCrypto extends Component {
  render() {
    return (
      <div id="buyCrypto">
        <h1>
          {_t('The Best Way to Purchase Cryptos', 'MARKETING.BUYCRYPTO_TITLE')}
        </h1>
        <h3>
          {_t(
            'Effortlessly connect with the digital economy with our user-friendly interface.',
            'MARKETING.BUYCRYPTO_MAIN_TEXT',
          )}
        </h3>
        <Link to="signup">
          <button>
            {_t('Get Started', 'MARKETING.BUYCRYPTO_BUTTON')}
          </button>
        </Link>
      </div>
    );
  }
}


export default BuyCrypto