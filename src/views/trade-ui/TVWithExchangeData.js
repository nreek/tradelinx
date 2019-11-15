import React, { Component } from 'react';
import { connect } from 'react-redux';

import config from '../../../config/config';
import { generateDataFeed } from '../../util/helpers';
import { loadHistory, loadCurrentBars } from '../../actions';


function getLanguageFromURL() {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(window.location.search);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

class TVWithExchangeData extends Component {
  static defaultProps = config.chartConfig.defaultProps;

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  renderChart = () => {
    const {
      base,
      quote,
      symbol,
      loadCurrentBars,
      loadHistory,
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
      updateCurrentBars,
    } = this.props;

    const {
      overrides, disabled_features, enabled_features, debug,
    } = config.chartConfig;

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
      theme: this.props.siteTheme === 'dark' ? 'DARK' : 'LIGHT',
      user_id: userId,
      fullscreen,
      autosize,
      studies_overrides: studiesOverrides,
      left_toolbar: false,
      hide_left_toolbar_by_default: true,
      overrides,
      //disabled_features,
      //enabled_features,
    };
    const widget = (window.tvWidget = new window.TradingView.widget(widgetOptions));
  };

  render() {
    return <div id={this.props.containerId} className="TVChartContainer" />;
  }
}

const mapStateToProps = state => ({
  historicalBars: state.historicalBars,
  base: state.selectedInstrument.base,
  quote: state.selectedInstrument.quote,
  selectedInstrument: state.selectedInstrument,
});

const mapDispatchToProps = dispatch => ({
  loadHistory: (bars, onHistoryCallback) => dispatch(loadHistory(bars, onHistoryCallback)),
  loadCurrentBars: blob => dispatch(loadCurrentBars(blob)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TVWithExchangeData);
