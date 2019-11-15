import React, { Component } from 'react';
import Highcharts from 'highcharts/js/highcharts'; // use this for styling via CSS
// import Highcharts from 'highcharts'; // use this for styling via options in config.js
import moment from 'moment';

import { formatNumberToLocale } from '../../../../util/helpers';
import { portfolioHistoryChartOptions } from '../../../../../config/chart-config';

class PortfolioHistoryChart extends Component {
  state = {
    historyChartTimeframe: '1m',
    validTimeframes: [],
  }

  historyChartTimeframes = {
    '1d': {
      intervalInHours: 1,
      lengthInHours: 36,
      intervalInMS: 3600000,
      lengthInMS: 129600000,
    },
    '1w': {
      intervalInHours: 2,
      lengthInHours: 168,
      intervalInMS: 7200000,
      lengthInMS: 604800000,
    },
    '1m': {
      intervalInHours: 6,
      lengthInHours: 730,
      intervalInMS: 21600000,
      lengthInMS: 2628000000,
    },
    '1y': {
      intervalInHours: 24,
      lengthInHours: 8760,
      intervalInMS: 86400000,
      lengthInMS: 31536000000,
    },
    'All': {
      intervalInHours: 24,
      intervalInMS: 86400000,
      lengthInHours: null,
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.portfolioHistoricalData.length && this.props.portfolioHistoricalData.length) {
      this.updateChart();
    }
  }

  componentWillUnmount() {
    this.chart && this.chart.destroy();
  }

  changeChartTimeframe = (time) => {
    this.setState({ historyChartTimeframe: time }, () => {
      const filteredHistoricalData = this.filterHistoricalData(time);
      const displayedHistoricalData = [...filteredHistoricalData]
        // .map(datapoint => [datapoint.balanceTimestamp, datapoint.comparisonBalance])
        .sort((a, b) => {
          return b[0] - a[0];
        })
      
      if (this.state.totalPortfolioValue) {
        displayedHistoricalData.unshift([Date.now(), this.props.totalPortfolioValue]);
      }

      this.setState({ filteredHistoricalData, displayedHistoricalData });

      this.chart.series[0].setData([...displayedHistoricalData].reverse());
    });
  }

  filterValidTimeframes = (history) => {
    const validTimeframes = [];
    const historyTimeframe = history[0][0] - history[history.length - 1][0];

    Object.keys(this.historyChartTimeframes).forEach(timeframe => {
      if (this.historyChartTimeframes[timeframe].lengthInMS < historyTimeframe) {
        validTimeframes.push(timeframe);
      }
    })

    validTimeframes.push('All');
    
    return validTimeframes;
  }

  filterHistoricalData = (historyChartTimeframe) => {
    const { portfolioHistoricalData } = this.props;
    let filteredHistoricalData = [...portfolioHistoricalData];
    const timeframeStart = portfolioHistoricalData[0][0];
    const selectedTimeframe = this.historyChartTimeframes[historyChartTimeframe];

    filteredHistoricalData = filteredHistoricalData.filter((datapoint, index) => {
      return (timeframeStart - datapoint[0]) % selectedTimeframe.intervalInMS === 0;
    })

    if (historyChartTimeframe !== 'All') {
      const timeframeEnd = timeframeStart - selectedTimeframe.lengthInMS;

      filteredHistoricalData = filteredHistoricalData.filter((datapoint, index) => {
        return datapoint[0] >= timeframeEnd;
      })
    } 

    return filteredHistoricalData;
  }

  updateChart = () => {
    const validTimeframes = this.filterValidTimeframes(this.props.portfolioHistoricalData);
    const historyChartTimeframe = this.state.historyChartTimeframe || validTimeframes[validTimeframes.length - 2] || 'All';
    const filteredHistoricalData = this.filterHistoricalData(historyChartTimeframe);
    const displayedHistoricalData = [...filteredHistoricalData]
      // .map(datapoint => [datapoint.balanceTimestamp, datapoint.comparisonBalance])
      .sort((a, b) => {
        return b[0] - a[0];
      })
      
    if (this.props.totalPortfolioValue || this.props.totalPortfolioValue === 0) {
      displayedHistoricalData.unshift([Date.now(), this.state.totalPortfolioValue]);
    }

    this.setState({ 
      filteredHistoricalData,
      displayedHistoricalData, 
      validTimeframes,
      historyChartTimeframe
    });

    if (!this.chart) {
      this.createChart();
    }
      
    this.chart.series[0].setData([...displayedHistoricalData].reverse());
  }

  createChart = () => {
    const options = {
      ...portfolioHistoryChartOptions,
      tooltip: {
        formatter: function() {
          let value = formatNumberToLocale(this.y, 2);
          let date = moment(this.x).format('MMM D, YYYY h:mmA');
          return `<b class='tooltip-text chart-date'>${date}</b><br/><span class='tooltip-text chart-amount'>$${value}</span>`;
        },
        useHTML: true,
        shadow: false,
        padding: 0
      }
    }
    this.chart = Highcharts.chart('total-value-chart', options);
  }

  render() {
    const { portfolioHistoricalData } = this.props;
    const { historyChartTimeframe, validTimeframes } = this.state;

    const timeframes = validTimeframes.map((timeframe, index) => {
      return (
        <span 
          className={`chart-timeframe-option tab ${historyChartTimeframe === timeframe ? 'active' : ''}`} 
          onClick={() => this.changeChartTimeframe(timeframe)}
          key={index}
        >
          {timeframe}
        </span>
      )
    })

    return (
      <div className='portfolio-history-chart-container'>
        <div className='chart-timeframe-select'>
          {portfolioHistoricalData.length ? timeframes : null}
        </div>
        <div id='total-value-chart'>
          {this.state.loadingHistory && portfolioHistoricalData.length === 0 &&
            <div className='loading-spinner'>
              <i className='fal fa-spinner fa-spin' />
              <label>Loading history</label>
            </div>
          }
        </div>
      </div>
    )
  }
}

export default PortfolioHistoryChart;