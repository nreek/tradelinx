import React, { Component, Fragment } from 'react';
import config from '../../../../config/config';
import FXBlueChart from '../FXBlueChart';
import DepthChart from '../DepthChart';
import TVWithExternalData from '../TVWithExternalData';
import TVWithExchangeData from '../TVWithExchangeData';
import WidgetWrapper from '../../../elements/WidgetWrapper';


export default class ChartContainer extends Component {
  state = {
    tabs: [
      _t('Charts', 'CHARTS.TITLE'), // tab between two charts, or keep them both on the same time?
    ],
    classNames: ['charts'],
  };

  renderCharts = (chart) => {
    switch (chart) {
      case 'FXBLUE':
        return <FXBlueChart />;
        break;
      case 'TV_EXTERNAL_DATA':
        return <TVWithExternalData />;
        break;
      case "TV_EXCHANGE_DATA":
        return <TVWithExchangeData />
        break;
      default:
        return <TVWithExternalData />;
    }
  }

  render() {
    return (
      <WidgetWrapper tabs={this.state.tabs} classNames={this.state.classNames}>
        <Fragment>
          {this.renderCharts(config.chartConfig.candleStickChart)}
          <DepthChart />
        </Fragment>
      </WidgetWrapper>
    );
  }
}
