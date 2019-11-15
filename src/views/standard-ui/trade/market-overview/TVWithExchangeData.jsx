import React, { Component } from 'react';
import { connect } from 'react-redux';
import { generateDataFeed } from '../../../../util/helpers';
import { loadHistory, loadCurrentBars } from '../../../../actions';
import {
  selectedInstrumentAll,
  quote,
  base,
  historicalBars,
} from '../../../../reducers/selectedInstrument';
import { selectChartConfig, selectSiteTheme } from '../../../../reducers';

function getLanguageFromURL() {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(window.location.search);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

class TVWithExchangeData extends Component {
  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  renderChart = () => {
    const {
      base, quote, loadCurrentBars, loadHistory, siteTheme,
    } = this.props;

    const {
      symbol,
      interval,
      containerId,
      libraryPath,
      chartsStorageUrl,
      chartsStorageApiVersion,
      clientId,
      userId,
      fullscreen,
      autosize,
      studiesOverrides,
    } = this.props.chartConfig.defaultProps;

    const {
      overrides, disabled_features, enabled_features, debug,
    } = this.props.chartConfig;

    const widgetOptions = {
      debug,
      symbol: base ? `${base}/${quote}` : symbol,
      datafeed: generateDataFeed(loadHistory, loadCurrentBars),
      interval,
      container_id: containerId,
      library_path: libraryPath,
      locale: getLanguageFromURL() || 'en',
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: ['study_templates'],
      charts_storage_url: chartsStorageUrl,
      charts_storage_api_version: chartsStorageApiVersion,
      client_id: clientId,
      theme: siteTheme === 'dark' ? 'DARK' : 'LIGHT',
      user_id: userId,
      fullscreen,
      autosize,
      studies_overrides: studiesOverrides,
      left_toolbar: false,
      hide_left_toolbar_by_default: true,
      overrides: {
        'paneProperties.background': siteTheme === 'dark' ? 'rgb(19,23,34)' : 'rgb(255,255,255)',
        'paneProperties.vertGridProperties.color': '#363c4e',
        'paneProperties.horzGridProperties.color': '#363c4e',
        'symbolWatermarkProperties.transparency': 90,
        'scalesProperties.backgroundColor':
          siteTheme === 'dark' ? 'rgb(19,23,34)' : 'rgb(255,255,255)',
        'scalesProperties.textColor': '#AAA',
        'mainSeriesProperties.candleStyle.wickUpColor': '#336854',
        'mainSeriesProperties.candleStyle.wickDownColor': '#7f323f',
      },
      // disabled_features,
      // enabled_features,
    };
    const widget = (window.tvWidget = new window.TradingView.widget(widgetOptions));
  };

  render() {
    return <div id="tv_chart_container" className="TVChartContainer" />;
  }
}

const mapStateToProps = state => ({
  historicalBars: historicalBars(state),
  base: base(state),
  quote: quote(state),
  selectedInstrument: selectedInstrumentAll(state),
  chartConfig: selectChartConfig(state),
  siteTheme: selectSiteTheme(state),
});

const mapDispatchToProps = dispatch => ({
  loadHistory: (bars, onHistoryCallback) => dispatch(loadHistory(bars, onHistoryCallback)),
  loadCurrentBars: blob => dispatch(loadCurrentBars(blob)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TVWithExchangeData);
