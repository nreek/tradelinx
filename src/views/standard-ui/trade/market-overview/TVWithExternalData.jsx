import React from 'react';
import { connect } from 'react-redux';
import TradingViewWidget from 'react-tradingview-widget';
import {
  chartTheme,
  chartProvider,
  chartLegend,
  selectSiteTheme,
} from '../../../../reducers/index';
import { selectedInstrumentId } from '../../../../reducers/selectedInstrument';

const TVWithExternalData = props => (
  <div className="TVWidget">
    {props.selectedInstrument ? (
      <TradingViewWidget
        allow_symbol_change={false}
        symbol={`${props.chartProvider}:${props.selectedInstrument}`}
        theme={props.siteTheme === 'dark' ? 'DARK' : 'LIGHT'}
        interval={5}
        hide_legend={props.chartLegend}
        hidevolume={false}
        autosize
        toolbar_bg={props.siteTheme === 'dark' ? 'rgb(19,23,34)' : 'rgb(255,255,255)'}
      />
    ) : null}
  </div>
);

const mapStateToProps = state => ({
  selectedInstrument: selectedInstrumentId(state),
  chartTheme: chartTheme(state),
  chartProvider: chartProvider(state),
  chartLegend: chartLegend(state),
  siteTheme: selectSiteTheme(state),
});

export default connect(
  mapStateToProps,
  null,
)(TVWithExternalData);
