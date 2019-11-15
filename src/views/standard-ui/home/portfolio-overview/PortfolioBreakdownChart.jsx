import React, { Component } from 'react';
import Highcharts from 'highcharts/js/highcharts'; // use this for styling via CSS
// import Highcharts from 'highcharts'; // use this for styling via options in config.js

import { formatNumberToLocale } from '../../../../util/helpers';
import { portfolioBreakdownChartOptions } from '../../../../../config/chart-config';

class PortfolioBreakdownChart extends Component {
  state = {
    lockActiveCurrency: false,
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.portfolioBreakdownData.length && this.props.portfolioBreakdownData.length) {
      this.updateChart();
    }
  }

  componentWillUnmount() {
    this.chart && this.chart.destroy();
  }

  updateChart = () => {
    const { portfolioBreakdownData } = this.props;

    const chartData = portfolioBreakdownData.map((data) => {
      let graphPercentage = data.percentage;
      if (data.percentage >= 0 && data.percentage < 2) {
        graphPercentage = 2;
      }
      return {
        ...data,
        className: `${name}`,
        y: graphPercentage,
      };
    });

    if (!this.chart) {
      this.createChart();
    }

    this.chart.series[0].setData(chartData);
  };

  createChart = () => {
    const options = { ...portfolioBreakdownChartOptions };
    options.plotOptions.series.point.events = {
      mouseOver: (e) => {
        if (!this.state.lockActiveCurrency) {
          this.props.setActiveCurrency({
            id: e.target.name,
            name: e.target.fullName,
            percentage: e.target.options.percentage,
            balance: e.target.balance,
          });
        }
      },
      mouseOut: (e) => {
        if (!this.state.lockActiveCurrency) {
          this.props.setActiveCurrency(null);
        }
      },
      unselect: (e) => {
        if (e.target.name === this.props.activeCurrency.id) {
          this.setState({ lockActiveCurrency: false });
          this.props.setActiveCurrency(null);
        }
      },
      select: (e) => {
        this.setState({ lockActiveCurrency: true });
        if (this.props.activeCurrency.id !== e.target.name) {
          this.props.setActiveCurrency({
            id: e.target.name,
            name: e.target.fullName,
            percentage: e.target.options.percentage,
            balance: e.target.balance,
          });
        }
      },
    };

    options.tooltip = {
      formatter() {
        const value = formatNumberToLocale(this.point.options.percentage, 2);
        return `<b class='breakdown-chart-currency'>${this.key}</b><br/><span class='breakdown-chart-percentage'>${value}%</span>`;
      },
    };

    this.chart = Highcharts.chart('portfolio-breakdown-chart', options);
  };

  render() {
    const { activeCurrency } = this.props;

    return (
      <div className="portfolio-breakdown-chart-container">
        <div id="portfolio-breakdown-chart" />
        {activeCurrency && (
          <div className="portfolio-breakdown-stats">
            <h2 className="currency-label">
              <img
                className={`currency-icon ${activeCurrency.id}-icon`}
                src={`images/icons/currency-icons/black/${activeCurrency.id}.svg`}
              />
              <span className="currency-name">{activeCurrency.name}</span>
            </h2>
            <h2 className="portfolio-percentage">
              {formatNumberToLocale(activeCurrency.percentage, 2)}
%
              {activeCurrency.id}
            </h2>
            <h2 className="currency-balance">
              {formatNumberToLocale(activeCurrency.balance, 2)}
              {' '}
              {activeCurrency.id}
            </h2>
          </div>
        )}
      </div>
    );
  }
}

export default PortfolioBreakdownChart;
