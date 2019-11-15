import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const OrderEntryActionButtons = (props) => {
  const {
    currentAction, setOrderAction, BUY, SELL,
  } = props;
  return (
    <Fragment>
      <div
        className={`order-entry-action-button tab ${currentAction === BUY ? 'selected' : ''}`}
        role="button"
        onClick={() => setOrderAction('buy')}
      >
        {_t('Buy', 'GENERIC.BUY')}
      </div>
      <div
        className={`order-entry-action-button tab ${currentAction === SELL ? 'selected' : ''}`}
        role="button"
        onClick={() => setOrderAction('sell')}
      >
        {_t('Sell', 'GENERIC.SELL')}
      </div>
    </Fragment>
  );
};

export default OrderEntryActionButtons;
