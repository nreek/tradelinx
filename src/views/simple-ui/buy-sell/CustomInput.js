import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import TextInput from '../../../elements/form-controls/TextInput';

export class CustomInput extends PureComponent {
  renderBaseValue = () => {
    const { errors = [] } = this.props;
    const basevalue = String(this.props.basevalue);

    return (
      <TextInput
        errorMessages={errors}
        className={`input-quantity-custom ${errors.length ? 'input-error' : ''}`}
        name="basevalue"
        placeholder="0"
        base="base"
        translation="BUY_SELL_CUSTOM"
        value={basevalue}
        onChange={() => this.props.onChange(event.target)}
      />
    );
  }

  renderQuoteValue = () => {
    const quotevalue = String(this.props.quotevalue);
    return (
      <TextInput
        name="quotevalue"
        placeholder="0"
        value={quotevalue}
        translation="BUY_SELL_CUSTOM"
        onChange={() => this.props.onChange(event.target)}
      />
    );
  }

  render() {
    const { base, quote } = this.props.selectedInstrument;
    const { transactionType } = this.props;
    const BUY = 'buy';
    const actionLabel = transactionType === BUY
      ? _t('buy', 'BUY_SELL_CUSTOM.BUY')
      : _t('sell', 'BUY_SELL_CUSTOM.SELL');

    return (
      <div>
        <h3>
          {_t(
            'Select Amount to {action}',
            'BUY_SELL_CUSTOM.SELECT_TITLE',
            {
              action: actionLabel,
            },
          )}
        </h3>
        <label>{base}</label>
        {this.renderBaseValue(base)}
        <label>{quote}</label>
        {this.renderQuoteValue(quote)}
        <p>
          {_t(
            'Enter the amount of {base} you wish to {action}. You may enter the amount either directly in {base} units, or in the equivalent amount of {quote}.',
            'BUY_SELL_CUSTOM.AMOUNT_TEXT_TWO',
            { base, quote, action: actionLabel },
          )}
        </p>
      </div>
    );
  }
}

const mapStateToProps = ({ selectedInstrument }) => ({
  selectedInstrument,
});

export default connect(
  mapStateToProps,
  null,
)(CustomInput);
