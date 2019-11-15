import React from 'react';
import { connect } from 'react-redux';
import TradingViewWidget from 'react-tradingview-widget';
import { selectChartConfig } from '../../reducers';

const TVWithExternalData = props => (
  <div className="TVWidget">
    {props.selectedInstrument ?
      <TradingViewWidget
        allow_symbol_change={false}
        symbol={`${props.chartConfig.TVProvider}:${props.selectedInstrument}`}
        theme={props.chartConfig.theme}
        interval={5}
        hide_legend={props.chartConfig.hideTVLegend}
        hidevolume={false}
        autosize={true}
        toolbar_bg={props.chartConfig.theme === 'DARK' ? 'rgb(19,23,34)' : 'rgb(255,255,255)'}
      />
      : null}
  </div>
);

const mapStateToProps = state => ({
  selectedInstrument: state.selectedInstrument.id,
  chartConfig: selectChartConfig(state),
});

export default connect(
  mapStateToProps,
  null,
)(TVWithExternalData);
