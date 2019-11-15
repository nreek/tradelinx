import React, { Component } from 'react';
import { connect } from 'react-redux';
import Highcharts from 'highcharts/js/highcharts'; // use this for styling via CSS
import { loadL2Data } from '../../actions';

// This is the function that filters out outliers in the order book
function filterOutliers(list) {
  if(list.length < 4) return list;
  const props = ['quantity', 'price'];
  const prop = props[1];

  // Copy the values, rather than operating on references to existing values
  const values = list.slice();
  
  // Also make sure we're actually working with numbers
  values.forEach(value => {
    value[prop] = parseFloat(value[prop])
  });

  // Then sort
  values.sort( function(a, b) {
    return a[prop] - b[prop];
  });

  /* Then find a generous IQR. This is generous because if (values.length / 4)
   * is not an int, then really you should average the two elements on either
   * side to find q1.
   */
  const q1 = values[Math.floor((values.length / 4))][prop];
  // Likewise for q3.
  const q3 = values[Math.ceil((values.length * (3 / 4)))][prop];
  const iqr = q3 - q1;

  // Then find min and max values
  const maxValue = q3 + iqr * 1.5;
  const minValue = q1 - iqr * 1.5;

  // Then filter anything beyond or beneath these values.
  const filteredValues = list.slice().filter(function(x) {
      return (parseFloat(x[prop]) < maxValue) && (parseFloat(x[prop]) > minValue);
  });

  // Then return
  return filteredValues;
}

const options = {
  chart: {
    type: 'area',
  },
  title: {
    text: ' ',
    align: 'left',
  },
  legend: {
    enabled: false,
  },
  tooltip: {
    formatter() {
      const baseDecimals = this.series.baseCurr === 'USD' ? 2 : 8;
      const quoteDecimals = this.series.quoteCurr === 'USD' ? 2 : 8;
      return `<b>${this.series.name}</b><br/>${
        this.x.toFixed(quoteDecimals)}${this.series.quoteCurr}: ${this.y.toFixed(baseDecimals)}${this.series.baseCurr}`;
    },
  },
  plotOptions: {
    series: {
      marker: {
        enabled: false,
      },
      step: 'left',
    },
  },
  xAxis: {
    title: {
      text: '',
    },
  },
  yAxis: {
    title: {
      text: '',
    },
  },
  credits: {
    enabled: false,
  },
  series: [{
    name: 'Bids',
    data: [],
  }, {
    name: 'Asks',
    data: [],
  }],
};

class DepthChart extends Component {
  container = 'depth-chart';

  componentDidMount() {
    this.props.loadData(this.props.selectedInstrument.id);
    options.title.text = ' ';
    options.series[0].name = _t('Bids', 'CHARTS.BIDS');
    options.series[1].name = _t('Asks', 'CHARTS.ASKS');
    this.chart = Highcharts.chart(this.container, options);
    this.chart.series.forEach((series) => {
      series.baseCurr = this.props.selectedInstrument.base;
      series.quoteCurr = this.props.selectedInstrument.quote;
    });
    this.updateChart();
  }

  componentDidUpdate(prevProps) {
    this.updateChart();
    if (prevProps.selectedInstrument.id !== this.props.selectedInstrument.id) {
      this.chart.series.forEach((series) => {
        series.baseCurr = this.props.selectedInstrument.base;
        series.quoteCurr = this.props.selectedInstrument.quote;
      });
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  updateChart = () => {
    const { bids, asks } = this.props.data;
    const newBids = [];
    const newAsks = [];

    if (bids && bids.length > 0) {
      let bidVolume = 0;
      const filteredBids = filterOutliers(bids);
      for (const bid of filteredBids) {
        bidVolume += +bid.quantity;
        newBids.push([+bid.price, bidVolume]);
      }
    }

    if (asks && asks.length > 0) {
      let askVolume = 0;
      const filteredAsks = filterOutliers(asks);
      for (const ask of filteredAsks) {
        askVolume += +ask.quantity;
        newAsks.push([+ask.price, askVolume]);
      }
    }

    this.chart.series[0].setData(newBids.reverse(), false);
    this.chart.series[1].setData(newAsks);
  };

  render() {
    return (
      <div id={this.container}>
         Depth Chart
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.orderbook,
  selectedInstrument: state.selectedInstrument,
});

const mapDispatchToProps = dispatch => ({
  loadData: instrument => dispatch(loadL2Data(instrument)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DepthChart);
