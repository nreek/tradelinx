import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { base, quote, quoteDecimals } from '../../../../reducers/selectedInstrument';
import { selectProducts } from '../../../../reducers';
import TextInput from '../../../../elements/form-controls/TextInput';
import DateInput from '../../../../elements/form-controls/DateInput';

const BUY = 'buy';
const SELL = 'sell';
const MARKET = 'market';
const LIMIT = 'limit';
const STOP = 'stop';
const GTD = 'gtd';

class OrderEntryForm extends Component {
  generateFormFields = (orderType, orderAction, base, quote, quoteDecimals) => {
    const { products } = this.props;
    let fields = [];
    const orderActionStr = orderAction === BUY
      ? _t('Buy', 'GENERIC.BUY')
      : orderAction === SELL
        ? _t('Sell', 'GENERIC.SELL')
        : '';
    switch (orderType) {
      case MARKET:
        fields = [
          {
            label: '',
            value: 'amount',
            type: 'input',
            decimals: quoteDecimals,
            placeholderParam: {
              action: orderActionStr,
              currency: base,
            },
          },
        ];
        break;

      case LIMIT:
        fields = [
          {
            label: '',
            value: 'amount',
            type: 'input',
            decimals: quoteDecimals,
            placeholderParam: {
              action: orderActionStr,
              currency: base,
            },
          },
          {
            label: '',
            value: 'limitPrice',
            type: 'input',
            decimals: quote ? products[quote].decimals : 0,
            placeholderParam: { currency: quote },
          },
          {
            label: _t('Expire Time', 'ORDER_ENTRY.EXPIRE_TIME'),
            value: 'expireDate',
            type: 'date',
            name: _t('Expire Time', 'ORDER_ENTRY.EXPIRE_TIME'),
            showTimeSelect: true,
            appare: {
              name: 'advancedOrderType',
              value: GTD,
            },
          },
        ];
        break;

      case STOP:
        fields = [
          {
            label: '',
            value: 'amount',
            type: 'input',
            decimals: quoteDecimals,
            placeholderParam: {
              action: orderActionStr,
              currency: base,
            },
          },
          {
            label: _t('Stop Price ({currency})', 'ORDER_ENTRY.STOP_PRICE_AMOUNT', {
              currency: quote,
            }),
            value: 'stopPrice',
            type: 'input',
            decimals: quote ? products[quote].decimals : 0,
            placeholderParam: {
              action: orderActionStr,
              currency: quote,
            },
          },
          {
            label: _t('Expire Time', 'ORDER_ENTRY.ORDER_DATE'),
            name: _t('Expire Time', 'ORDER_ENTRY.ORDER_DATE'),
            value: 'expireDate',
            type: 'date',
            showTimeSelect: true,
            appare: {
              name: 'advancedOrderType',
              value: GTD,
            },
          },
        ];
        break;
      default:
        break;
    }

    return fields;
  };

  render() {
    const {
      base,
      quote,
      quoteDecimals,
      currentType,
      currentAction,
      amount,
      advancedOrderType,
      handleInputChange,
      handleInputUnfocus,
      overAllState,
    } = this.props;
    const fields = this.generateFormFields(currentType, currentAction, base, quote, quoteDecimals);
    return fields.map((field, index) => (
      <Fragment key={index}>
        {(!field.appare || overAllState[field.appare.name] === field.appare.value) && (
          <Fragment>
            {field.type === 'input' && (
              <div className="order-entry-field" key={index}>
                <TextInput
                  name=""
                  onChange={handleInputChange(field.decimals, field.value)}
                  onBlur={handleInputUnfocus}
                  value={overAllState[field.value]}
                  placeholder="0.00"
                  label={field.label}
                  translation="ORDER_ENTRY"
                  placeholderParam={field.placeholderParam}
                />
              </div>
            )}
            {field.type === 'date' && (
              <div className="order-entry-field" key={index}>
                <DateInput
                  name=""
                  onChange={handleInputChange(field.decimals, field.value)}
                  onBlur={handleInputUnfocus}
                  value={overAllState[field.value]}
                  placeholder=""
                  label={field.label}
                  placeholderText=""
                  translation="ORDER_ENTRY"
                  minDate={moment()}
                  showTimeSelect={field.showTimeSelect}
                />
              </div>
            )}
          </Fragment>
        )}
      </Fragment>
    ));
  }
}

const mapStateToProps = state => ({
  base: base(state), // TODO: replace with selectors!
  quote: quote(state),
  quoteDecimals: quoteDecimals(state),
  products: selectProducts(state),
});

export default connect(
  mapStateToProps,
  null,
)(OrderEntryForm);
