import React, { Component } from 'react';
import { connect } from 'react-redux';
import seedrandom from 'seedrandom';
import Iframe from '../../elements/Iframe';
import { fxblueChartConfig } from '../../../config/chart-config';
import { setFxBlueChartTimeFrame, loadSelectedFxBlueChartTimeFrame } from '../../actions';

const FRAME_1H = '1H';
const FRAME_1D = '1D';
const FRAME_1W = '1W';
const FRAME_1M = '1M';
const FRAME_3M = '3M';
const FRAME_1Y = '1Y';

const DEFAULT_FRAME = FRAME_1W;

export class FXBlueChart extends Component {
  constructor(props) {
    super(props);
    this.timeframes = {
      [FRAME_1H]: 120,
      [FRAME_1D]: 1800,
      [FRAME_1W]: 14400,
      [FRAME_1M]: 86400,
      [FRAME_3M]: 86400,
      [FRAME_1Y]: 604800,
    };

    this.state = {
      urlSource: 'https://shiftforex.fxbluelabs.com/',
      timeframe: DEFAULT_FRAME,
      userToken: '',
    };

    this.fxblueChartConfig = fxblueChartConfig;
  }

  componentDidMount() {
    this.props.loadSelectedFxBlueChartTimeFrame();
    this.changeInstrument(this.props.selectedInstrument.id);


    const userToken = this.props.user.username ? this.generateUserToken(this.props.username) : '';
    this.setState({ userToken });

    /**
     * Move setChartWorkspace to the end of life circle
     */
    setTimeout(() => {
      this.setChartWorkspace();
      if (this.props.selectedTimeframe) {
        this.setChartTimeframe(this.props.selectedTimeframe);
      }
    }, 0);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedInstrument.id !== this.props.selectedInstrument.id) {
      this.changeInstrument(this.props.selectedInstrument.id);
    }
  }

  generateUserToken(userName) {
    let userToken = '';

    for (let j = 0; j < 20; ++j) {
      let code = 0;
      const charSeed = seedrandom(`${this.props.siteName}${j}${userName}`)();
      const randomizerSeed = seedrandom(`randomizer${this.props.siteName}${j}${userName}`)();
      if (randomizerSeed > 0 && randomizerSeed <= 0.33333333333333333) {
        code = Math.floor(charSeed * 26) + 65;
      } else if (randomizerSeed > 0.33333333333333333 && randomizerSeed <= 0.66666666666666666) {
        code = Math.floor(charSeed * 26) + 97;
      } else if (randomizerSeed > 0.66666666666666666 && randomizerSeed <= 1) {
        code = Math.floor(charSeed * 10) + 48;
      }
      userToken += String.fromCharCode(code);
    }

    return userToken;
  }

  chartUrlParam = instrument => (`bitfinex@${instrument}`).replace('/', '').replace('IOTA', 'IOT');

  changeInstrument = (instrument) => {
    const chart = document.getElementById('fxblue-chart');

    chart.contentWindow.postMessage(
      {
        command: 'setChartSymbol',
        symbol: this.chartUrlParam(instrument),
      },
      '*',
    );
  };

  setChartTimeframe = (timeframe) => {
    this.setState({ timeframe }, () => {
      if (this.state.showFallbackChart) return;

      const chart = document.getElementById('fxblue-chart');
      const seconds = this.timeframes[timeframe];
      this.fxblueChartConfig.charts[0].instrumentDef.symbol = `bitfinex@${this.props.selectedInstrument.id}`;
      this.fxblueChartConfig.charts[0].instrumentDef.symbolCaption = `${this.props.selectedInstrument.id}`;
      this.fxblueChartConfig.charts[0].instrumentDef.timeframe = seconds;

      if (timeframe === FRAME_3M) {
        this.fxblueChartConfig.charts[0].dateScale.firstVisibleRecord = this.fxblueChartConfig.charts[0].dateScale.lastVisibleRecord - 90;
      } else if (timeframe === FRAME_1Y) {
        this.fxblueChartConfig.charts[0].dateScale.firstVisibleRecord = this.fxblueChartConfig.charts[0].dateScale.lastVisibleRecord - 52;
      } else {
        this.fxblueChartConfig.charts[0].dateScale.firstVisibleRecord = 961;
      }
      this.props.setFxBlueChartTimeFrame(timeframe);

      chart.contentWindow.postMessage(
        {
          command: 'setWorkspace',
          workspace: this.fxblueChartConfig,
        },
        '*',
      );
    });
  }

  setChartWorkspace = () => {
    const chart = document.getElementById('fxblue-chart');

    chart.onload = () => {
      chart.contentWindow.postMessage(
        {
          command: 'setWorkspace',
          workspace: fxblueChartConfig,
        },
        '*',
      );
      this.changeInstrument(this.props.selectedInstrument.id);
    };
  };

  render() {
    const { timeframe, userToken } = this.state;
    const frames = Object.keys(this.timeframes).map((frame, index) => (
        <span
          className={`chart-timeframe-option ${timeframe === frame ? 'active' : ''}`}
          onClick={() => this.setChartTimeframe(frame)}
          key={index}
          >
          {_t(frame, `FXBLUE_CHART.${frame.toUpperCase()}`)}
        </span>
      ));
    const url = `${this.state.urlSource
    }?css=//${window.location.host}/${
      fxblueChartConfig.cssUrl
    }&${
      this.chartUrlParam(this.props.selectedInstrument.id)
    }&exchangeID=${this.props.config.chartConfig.clientId}&userID=${userToken}`;

    return (
      <div className="fxblue-chart">
        <div className="chart-timeframe-selector">
          {frames}
        </div>
        <Iframe
          src={url}
          height="400px"
          id="fxblue-chart"
        >
          <p>This feature requires iframe-support to display.</p>
        </Iframe>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  selectedInstrument: state.selectedInstrument,
  selectedTimeframe: state.selectedFxBlueChartTimeframe,
  user: state.user,
  config: state.config,
});

const mapDispatchToProps = dispatch => ({
  setFxBlueChartTimeFrame: timeframe => dispatch(setFxBlueChartTimeFrame(timeframe)),
  loadSelectedFxBlueChartTimeFrame: () => dispatch(loadSelectedFxBlueChartTimeFrame()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FXBlueChart);
