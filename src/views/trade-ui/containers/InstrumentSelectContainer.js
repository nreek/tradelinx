import React, { Component } from 'react';

import InstrumentSelect from '../InstrumentSelect';
import WidgetWrapper from '../../../elements/WidgetWrapper';


export default class InstrumentSelectContainer extends Component {
  state = {
    tabs: [_t('Instruments', 'INSTRUMENT_SELECT.INSTRUMENTS')],
    classNames: ['instrument-select'],
  };

  render() {
    return (
      <WidgetWrapper tabs={this.state.tabs} classNames={this.state.classNames}>
        <InstrumentSelect />
        {' '}
      </WidgetWrapper>
    );
  }
}
