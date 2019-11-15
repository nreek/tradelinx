export const chartColors = {
  chartBackgroundGradient1: '#252637',
  chartBackgroundGradient2: '#252637',
  chartGridline: '#2B2B2B',

  valueAxisBackground: '#252637',
  valueAxisText: '#c8c8c8',
  valueAxisTick: '#c8c8c8F',

  dateAxisBackground: '#252637',
  dateAxisText: '#c8c8c8',

  indicatorUp: '#18bea0',
  indicatorDown: '#bd594d',

  scrollOverviewStroke: '#7E8DAB',
  scrollOverviewFill: '#33354d',
  scrollOverviewBackground: '#191a2a',

  bid: '#7acd45',
};

// NOTE: For the inserted styling to work it needs to be hosted from a https source

export var fxblueChartConfig = {
  layout: 'single',
  _activeTabIndex: 0,
  cssUrl: 'fx-blue-charts.css',
  charts: [
    {
      isFullChartState: true,
      chart: {
        fullWindowMode: false,
        autoSave: false,
        priceStyle: 'hollowCandle',
        xGridVisible: false,
        yGridVisible: true,
        scrollEnabled: true,
        zoomEnabled: true,
        useMomentumScrolling: true,
        theme: {
          name: 'Dark',
          mainPanelPadding: 25,
          scrollOverview: {
            line: {
              useStroke: true,
              width: 2,
              strokeColor: chartColors.scrollOverviewStroke,
            },
            fill: {
              fillColor: chartColors.scrollOverviewFill,
            },
            background: chartColors.scrollOverviewBackground,
          },
          indicatorDefaults: {
            showParamsInTitle: true,
            general: [
              {
                k: 'Line Width',
                v: 3,
              },
              {
                k: 'Line 2 Width',
                v: 3,
              },
              {
                k: 'Line 3 Width',
                v: 3,
              },
            ],
            indicator_17: [
              {
                k: 'Line Style',
                v: 'icon-f111',
              },
              {
                k: 'Line Width',
                v: 2,
              },
            ],
            indicator_30007: [
              {
                k: 'Line Width',
                v: 5,
              },
              {
                k: 'Line 2 Width',
                v: 5,
              },
            ],
          },
          // Chart background colors
          chart: {
            background: ['#191a2a', '#252637'],
            border: {
              width: 1,
              strokeColor: 'grey',
              lineStyle: 'solid',
            },
            instrumentWatermark: {
              symbol: {
                fontFamily: 'Arial',
                fontSize: 70,
                fontStyle: 'normal',
                fillColor: 'white',
              },
              details: {
                fontFamily: 'Arial',
                fontSize: 40,
                fontStyle: 'normal',
                fillColor: 'white',
              },
            },
          },
          splitter: {
            fillColor: 'grey',
            hoverFillColor: 'white',
          },
          chartPanel: {
            grid: {
              width: 1,
              lineStyle: 'solid',
              strokeColor: '#463F64',
            },
            title: {
              fontFamily: 'Open Sans',
              fontSize: 11,
              fontStyle: 'normal',
              fillColor: 'white',
            },
            watermark: {
              text: {
                fontFamily: 'Arial',
                fontSize: 40,
                fontStyle: 'normal',
                fillColor: 'white',
              },
            },
          },
          valueScale: {
            minValueOffsetPixels: 80,
            fill: {
              fillColor: '#191a2a',
            },
            text: {
              fontFamily: 'Open Sans',
              fontSize: 13,
              fontStyle: 'normal',
              fillColor: 'white',
            },
            line: {
              width: 1,
              strokeColor: '#505050',
            },
            border: {
              width: 0,
              strokeColor: 'darkgray',
              lineStyle: 'solid',
            },
            valueMarker: {
              text: {
                fontFamily: 'Open Sans',
                fontSize: 14,
                fillColor: 'white',
              },
              fill: {
                fillColor: '#F20500',
              },
            },
          },
          dateScale: {
            fill: {
              fillColor: '#18103E',
            },
            text: {
              fontFamily: 'Open Sans',
              fontSize: 13,
              fillColor: '#FFFFFF',
            },
            line: {
              width: 1,
              strokeColor: '#505050',
            },
            border: {
              width: 1,
              strokeColor: 'darkgray',
              lineStyle: 'solid',
            },
            dateMarker: {
              text: {
                fontFamily: 'Open Sans',
                fontSize: 11,
                fillColor: '#FFFFFF',
              },
              fill: {
                fillColor: 'green',
              },
              stroke: {
                strokePriority: 'color',
                strokeColor: '#696969',
                width: 1,
                lineStyle: 'solid',
                lineJoin: 'miter',
                lineCap: 'butt',
              },
            },
            breakLine: {
              stroke: {
                strokeColor: '#545454',
                width: 1,
                lineStyle: 'dash',
              },
            },
          },
          crossHair: {
            text: {
              fontFamily: 'Open Sans',
              fontSize: 11,
              fillColor: 'black',
            },
            line: {
              width: 1,
              strokeColor: 'darkgray',
              lineStyle: 'dashed',
            },
            fill: {
              fillColor: 'white',
            },
          },
          zoomIn: {
            border: {
              width: 1,
              strokeColor: 'white',
              lineStyle: 'solid',
            },
            fill: {
              fillColor: 'rgba(255, 255, 255, 0.5)',
            },
          },
          plot: {
            point: {
              dot: {
                fill: {
                  fillColor: 'white',
                },
              },
            },
            line: {
              simple: {
                width: 4,
                strokeColor: 'white',
              },
              mountain: {
                line: {
                  width: 2,
                  useLineShadow: true,
                  strokeColor: 'white',
                },
                fill: {
                  fillColor: 'rgba(0, 0, 255, 0.5)',
                },
              },
              step: {
                width: 1,
                strokeColor: 'white',
              },
            },
            histogram: {
              line: {
                width: 1,
                strokeColor: 'white',
              },
              coloredLine: {
                upBar: {
                  width: 1,
                  strokeColor: 'green',
                },
                downBar: {
                  width: 1,
                  strokeColor: 'red',
                },
              },
              column: {
                line: {
                  strokeEnabled: false,
                  width: 1,
                  strokeColor: 'white',
                },
                fill: {
                  fillColor: 'blue',
                },
              },
              coloredColumn: {
                upBar: {
                  line: {
                    strokeEnabled: false,
                    width: 1,
                    strokeColor: 'white',
                  },
                  fill: {
                    fillColor: 'green',
                  },
                },
                downBar: {
                  line: {
                    strokeEnabled: false,
                    width: 1,
                    strokeColor: 'white',
                  },
                  fill: {
                    fillColor: 'red',
                  },
                },
              },
            },
            bar: {
              OHLC: {
                width: 1,
                strokeColor: 'white',
              },
              HLC: {
                width: 1,
                strokeColor: 'white',
              },
              HL: {
                width: 1,
                strokeColor: 'white',
              },
              coloredOHLC: {
                upBar: {
                  width: 2,
                  strokeColor: 'green',
                },
                downBar: {
                  width: 2,
                  strokeColor: 'red',
                },
              },
              coloredHLC: {
                upBar: {
                  width: 2,
                  strokeColor: 'green',
                },
                downBar: {
                  width: 2,
                  strokeColor: 'red',
                },
              },
              coloredHL: {
                upBar: {
                  width: 2,
                  strokeColor: 'green',
                },
                downBar: {
                  width: 2,
                  strokeColor: 'red',
                },
              },
              candle: {
                useGradient: true,
                upCandle: {
                  border: {
                    strokeEnabled: false,
                    width: 1,
                    strokeColor: 'white',
                  },
                  fill: {
                    fillColor: 'rgba(0,180,0,1)',
                  },
                  wick: {
                    width: 1,
                    strokeColor: 'rgba(0,180,0,1)',
                  },
                },
                downCandle: {
                  border: {
                    strokeEnabled: false,
                    width: 1,
                    strokeColor: 'white',
                  },
                  fill: {
                    fillColor: 'red',
                  },
                  wick: {
                    width: 1,
                    strokeColor: 'red',
                  },
                },
              },
              heikinAshi: {
                upCandle: {
                  border: {
                    strokeEnabled: false,
                    width: 1,
                    strokeColor: 'white',
                  },
                  fill: {
                    fillColor: 'green',
                  },
                  wick: {
                    width: 1,
                    strokeColor: 'white',
                  },
                },
                downCandle: {
                  border: {
                    strokeEnabled: false,
                    width: 1,
                    strokeColor: 'white',
                  },
                  fill: {
                    fillColor: 'red',
                  },
                  wick: {
                    width: 1,
                    strokeColor: 'white',
                  },
                },
              },
              renko: {
                upCandle: {
                  border: {
                    strokeEnabled: false,
                    width: 1,
                    strokeColor: 'white',
                  },
                  fill: {
                    fillColor: 'green',
                  },
                },
                downCandle: {
                  border: {
                    strokeEnabled: false,
                    width: 1,
                    strokeColor: 'white',
                  },
                  fill: {
                    fillColor: 'red',
                  },
                },
              },
              lineBreak: {
                upCandle: {
                  border: {
                    strokeEnabled: true,
                    width: 1,
                    strokeColor: 'green',
                  },
                  fill: {
                    fillEnabled: false,
                    fillColor: 'green',
                  },
                },
                downCandle: {
                  border: {
                    strokeEnabled: false,
                    width: 1,
                    strokeColor: 'red',
                  },
                  fill: {
                    fillEnabled: true,
                    fillColor: 'red',
                  },
                },
              },
              hollowCandle: {
                upCandle: {
                  border: {
                    strokeEnabled: false,
                    width: 1,
                    strokeColor: 'white',
                  },
                  fill: {
                    fillColor: 'green',
                  },
                  wick: {
                    width: 1,
                    strokeColor: 'white',
                  },
                },
                downCandle: {
                  border: {
                    strokeEnabled: false,
                    width: 1,
                    strokeColor: 'white',
                  },
                  fill: {
                    fillColor: 'red',
                  },
                  wick: {
                    width: 1,
                    strokeColor: 'white',
                  },
                },
                upHollowCandle: {
                  border: {
                    width: 1,
                    strokeColor: 'green',
                  },
                  wick: {
                    width: 1,
                    strokeColor: 'green',
                  },
                },
                downHollowCandle: {
                  border: {
                    width: 1,
                    strokeColor: 'red',
                  },
                  wick: {
                    width: 1,
                    strokeColor: 'red',
                  },
                },
              },
              pointAndFigure: {
                upCandle: {
                  border: {
                    strokeEnabled: true,
                    width: 1,
                    strokeColor: 'green',
                  },
                },
                downCandle: {
                  border: {
                    strokeEnabled: true,
                    width: 1,
                    strokeColor: 'red',
                  },
                },
              },
              kagi: {
                upCandle: {
                  border: {
                    strokeEnabled: true,
                    width: 2,
                    strokeColor: 'green',
                  },
                },
                downCandle: {
                  border: {
                    strokeEnabled: true,
                    width: 2,
                    strokeColor: 'red',
                  },
                },
              },
            },
            indicator: {
              convertLineToArea: true,
              bandFill: {
                fillColor: 'rgba(0,0,255,0.5)',
              },
              bandLine: {
                width: 3,
                strokeColor: 'rgba(255,255,255,0.5)',
                lineStyle: 'solid',
              },
              line1: {
                width: 2,
                lineStyle: 'solid',
                strokeColor: '#FDC228',
              },
              line2: {
                width: 2,
                lineStyle: 'solid',
                strokeColor: '#32CD32',
              },
              line3: {
                width: 2,
                lineStyle: 'solid',
                strokeColor: '#FF0000',
              },
              line4: {
                width: 2,
                lineStyle: 'solid',
                strokeColor: '#0000FF',
              },
            },
          },
          selectionMarker: {
            line: {
              strokeColor: 'white',
              width: 1,
            },
            fill: {
              fillColor: 'black',
            },
          },
          drawing: {
            note: {
              text: {
                fontFamily: 'Open Sans',
                fontSize: 11,
                fillColor: 'white',
              },
              fill: {
                fillColor: '#FDC228',
              },
              centerPointFill: {
                fillColor: 'rgb(68, 68, 68)',
              },
            },
            measure: {
              line: {
                width: 1,
                strokeColor: 'white',
                strokeEnabled: true,
                lineStyle: 'dash',
              },
              border: {
                width: 1,
                strokeColor: 'white',
                strokeEnabled: true,
                lineStyle: 'dash',
              },
              fill: {
                fillEnabled: true,
                fillColor: 'rgba(255, 255, 255, 0.9)',
              },
              balloon: {
                text: {
                  fontFamily: 'Open Sans',
                  fontSize: 12,
                  fillColor: '#404040',
                },
                border: {
                  width: 1,
                  strokeColor: 'darkgray',
                  strokeEnabled: true,
                  lineStyle: 'solid',
                },
                fill: {
                  fillEnabled: true,
                  fillColor: 'rgba(255, 255, 255, 0.5)',
                },
              },
            },
            measureTool: {
              line: {
                width: 1,
                strokeColor: 'white',
              },
              text: {
                fontFamily: 'Open Sans',
                fontSize: 11,
                fillColor: 'white',
              },
              fill: {
                fillColor: 'rgba(0, 0, 0, 0.8)',
              },
            },
            abstract: {
              line: {
                strokeColor: '#FDC228',
                width: 3,
              },
              fill: {
                fillColor: 'rgba(255, 255, 255, 0.3)',
              },
              text: {
                fontFamily: 'Open Sans',
                fontSize: 12,
                fillColor: 'white',
                decoration: '',
              },
            },
            callout: {
              line: {
                strokeColor: '#FDC228',
                width: 2,
              },
              connector: {
                strokeColor: '#FFFFFF',
                width: 1,
                lineStyle: 'dot',
              },
              fill: {
                fillColor: 'rgba(255, 255, 255, 0.3)',
              },
              text: {
                fontFamily: 'Open Sans',
                fontSize: 16,
                fillColor: 'white',
                decoration: '',
              },
            },
            trendAngle: {
              line: {
                strokeColor: 'white',
                width: 1,
              },
              text: {
                fontFamily: 'Open Sans',
                fontSize: 12,
                fillColor: 'white',
                decoration: '',
              },
              arc: {
                strokeColor: 'white',
                width: 1,
                lineStyle: 'dot',
              },
              horizontalLine: {
                strokeColor: 'white',
                width: 1,
                lineStyle: 'dot',
              },
            },
            abstractMarker: {
              line: {
                strokeColor: '#FDC228',
                width: 3,
              },
              fill: {
                fillColor: 'white',
              },
              text: {
                fontFamily: 'Open Sans',
                fontSize: 12,
                fillColor: '#404040',
                decoration: '',
              },
            },
            fibonacci: {
              trendLine: {
                strokeColor: 'white',
                width: 1,
                lineStyle: 'dash',
              },
              line: {
                strokeColor: 'white',
                width: 1,
              },
              fill: {
                fillColor: 'rgba(255, 255, 255, 0.3)',
              },
              text: {
                fontFamily: 'Open Sans',
                fontSize: 12,
                fillColor: 'white',
              },
            },
            arrowUp: {
              fill: {
                fillColor: 'limegreen',
              },
            },
            arrowDown: {
              fill: {
                fillColor: 'red',
              },
            },
            text: {
              text: {
                fontFamily: 'Open Sans',
                fontSize: 12,
                fillColor: '#FFFFFF',
                decoration: '',
              },
            },
            image: {
              noImage: {
                line: {
                  strokeColor: 'red',
                  width: 1,
                },
              },
            },
          },
          tooltip: {
            text: {
              fontFamily: 'Open Sans',
              fontSize: 12,
              fillColor: 'white',
              fontWeight: 'normal',
              fontStyle: 'normal',
              decoration: '',
            },
            border: {
              enabled: true,
              width: 1,
              color: '#C0C0C0',
              lineStyle: 'solid',
            },
            fill: {
              enabled: true,
              color: 'rgba(44, 44, 44, 0.95)',
            },
          },
          spread: {
            ask: {
              line: {
                width: 1,
                strokeColor: '#00D533',
              },
              valueMarker: {
                fill: {
                  fillColor: '#00D533',
                },
                text: {
                  fontFamily: 'Open Sans',
                  fontSize: 14,
                  fontStyle: 'normal',
                  fillColor: 'white',
                },
              },
            },
            bid: {
              line: {
                width: 1,
                strokeColor: '#F20500',
              },
              valueMarker: {
                fill: {
                  fillColor: '#F20500',
                },
                text: {
                  fontFamily: 'Open Sans',
                  fontStyle: 'normal',
                  fillColor: 'white',
                },
              },
            },
          },
        },
        locale: 'en',
        enableKeyboardEvents: true,
        enableMouseEvents: true,
        showBarInfoInTitle: false, // true, // removes text up at the top
        showInstrumentWatermark: true,
        navigationVisible: false, // true, // removes nav buttons
        hideScrollOverview: true, // NEW // hides the bottom scroll overview
        systemDockComponentVisibility: [],
        container: null,
      },
      priceStyle: {
        className: 'hollowCandle',
      },
      dateScale: {
        allowPartialRecords: true,
        firstVisibleRecord: 961,
        lastVisibleRecord: 999,
        minVisibleRecords: 18.570102135561743,
        textPadding: {
          left: 3,
          top: 3,
          right: 3,
          bottom: 3,
        },
        height: 19,
        useManualHeight: true,
        scrollKind: 'autoscaled',
        zoomKind: 'autoscaled',
        zoomMode: 'pin_center',
        rightAdditionalSpaceRatio: 0.5,
        majorTickMarkLength: 5,
        minorTickMarkLength: 3,
        formatter: {
          className: 'StockChartX.CustomTimeIntervalDateTimeFormat',
          locale: 'en',
          timeInterval: 3600000,
        },
        calibrator: {
          className: 'StockChartX.CustomDateScaleCalibrator',
          options: {},
        },
      },
      valueScales: [
        {
          showLeftPanel: false,
          showRightPanel: true,
          width: 50,
          useManualWidth: true,
        },
      ],
      crossHair: {
        crossHairType: 'none',
      },
      chartPanelsContainer: {
        newPanelHeightRatio: 0.2,
        panelPadding: {
          left: 5,
          top: 10,
          right: 5,
          bottom: 10,
        },
        panels: [
          {
            options: {
              minHeightRatio: 0.05,
              maxHeightRatio: 1,
              heightRatio: 1,
              showXGrid: true,
              showYGrid: true,
              moveDirection: 'horizontal',
              moveKind: 'autoscaled',
            },
            valueScales: [
              {
                options: {
                  minVisibleValue: 7440,
                  maxVisibleValue: 7710,
                  minAllowedValue: null,
                  maxAllowedValue: null,
                  minAllowedValueRatio: 0.8,
                  maxAllowedValueRatio: 0.8,
                  minValueRangeRatio: 0.1,
                  maxValueRangeRatio: 5,
                  majorTickMarkLength: 3,
                  minorTickMarkLength: 3,
                  padding: {
                    left: 6,
                    top: 3,
                    right: 3,
                    bottom: 3,
                  },
                },
                formatter: {
                  className: 'StockChartX.IntlNumberFormat',
                  locale: 'en',
                  options: {
                    locale: 'en-GB',
                    numberingSystem: 'latn',
                    style: 'decimal',
                    useGrouping: true,
                    minimumIntegerDigits: 1,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                },
                calibrator: {
                  className: 'StockChartX.IntervalValueScaleCalibrator',
                  options: {
                    majorTicks: {
                      interval: 10,
                    },
                  },
                },
              },
            ],
            isMainPanel: true,
          },
        ],
      },
      indicators: [],
      drawings: [],
      instrumentDef: {
        timeframe: 86400,
      },
      theme: {
        name: 'Dark',
        mainPanelPadding: 25,
        scrollOverview: {
          line: {
            useStroke: true,
            width: 2,
            strokeColor: chartColors.scrollOverviewStroke,
          },
          fill: {
            fillColor: chartColors.scrollOverviewFill,
          },
          background: chartColors.scrollOverviewBackground,
        },
        indicatorDefaults: {
          showParamsInTitle: true,
          general: [
            {
              k: 'Line Width',
              v: 3,
            },
            {
              k: 'Line 2 Width',
              v: 3,
            },
            {
              k: 'Line 3 Width',
              v: 3,
            },
          ],
          indicator_17: [
            {
              k: 'Line Style',
              v: 'icon-f111',
            },
            {
              k: 'Line Width',
              v: 2,
            },
          ],
          indicator_30007: [
            {
              k: 'Line Width',
              v: 5,
            },
            {
              k: 'Line 2 Width',
              v: 5,
            },
          ],
        },
        chart: {
          // Chart background gradient
          background: [chartColors.chartBackgroundGradient1, chartColors.chartBackgroundGradient2],
          border: {
            width: 0,
            strokeColor: 'grey',
            lineStyle: 'solid',
          },
          instrumentWatermark: {
            symbol: {
              fontFamily: 'Arial',
              fontSize: 70,
              fontStyle: 'normal',
              fillColor: 'white',
            },
            details: {
              fontFamily: 'Arial',
              fontSize: 40,
              fontStyle: 'normal',
              fillColor: 'white',
            },
          },
        },
        splitter: {
          fillColor: 'grey',
          hoverFillColor: 'white',
        },
        chartPanel: {
          grid: {
            width: 1,
            lineStyle: 'solid',
            strokeColor: chartColors.chartGridline,
          },
          title: {
            fontFamily: 'Open Sans',
            fontSize: 10,
            fontStyle: 'normal',
            fillColor: 'white',
          },
          watermark: {
            text: {
              fontFamily: 'Arial',
              fontSize: 40,
              fontStyle: 'normal',
              fillColor: 'white',
            },
          },
        },
        valueScale: {
          minValueOffsetPixels: 80,
          fill: {
            fillColor: chartColors.valueAxisBackground,
          },
          text: {
            fontFamily: 'Open Sans',
            fontSize: 11,
            fontStyle: 'normal',
            fillColor: chartColors.valueAxisText,
          },
          line: {
            width: 1,
            strokeColor: chartColors.valueAxisTick,
          },
          border: {
            width: 0,
            strokeColor: 'white',
            lineStyle: 'solid',
          },
          valueMarker: {
            text: {
              fontFamily: 'Open Sans',
              fontSize: 11,
              fillColor: 'white',
            },
            fill: {
              fillColor: '#F20500',
            },
          },
        },
        dateScale: {
          fill: {
            fillColor: chartColors.dateAxisBackground,
          },
          text: {
            fontFamily: 'Open Sans',
            fontSize: 11,
            fillColor: chartColors.dateAxisText,
          },
          line: {
            width: 1,
            strokeColor: '#505050',
          },
          border: {
            width: 0,
            strokeColor: 'darkgray',
            lineStyle: 'solid',
          },
          dateMarker: {
            text: {
              fontFamily: 'Open Sans',
              fontSize: 11,
              fillColor: '#FFFFFF',
            },
            fill: {
              fillColor: 'green',
            },
            stroke: {
              strokePriority: 'color',
              strokeColor: '#696969',
              width: 1,
              lineStyle: 'solid',
              lineJoin: 'miter',
              lineCap: 'butt',
            },
          },
          breakLine: {
            stroke: {
              strokeColor: '#545454',
              width: 1,
              lineStyle: 'dash',
            },
          },
        },
        crossHair: {
          text: {
            fontFamily: 'Open Sans',
            fontSize: 11,
            fillColor: 'black',
          },
          line: {
            width: 1,
            strokeColor: 'darkgray',
            lineStyle: 'dashed',
          },
          fill: {
            fillColor: 'white',
          },
        },
        zoomIn: {
          border: {
            width: 1,
            strokeColor: 'white',
            lineStyle: 'solid',
          },
          fill: {
            fillColor: 'rgba(255, 255, 255, 0.5)',
          },
        },
        plot: {
          point: {
            dot: {
              fill: {
                fillColor: 'white',
              },
            },
          },
          line: {
            simple: {
              width: 4,
              strokeColor: 'white',
            },
            mountain: {
              line: {
                width: 2,
                useLineShadow: true,
                strokeColor: 'white',
              },
              fill: {
                fillColor: 'rgba(0, 0, 255, 0.5)',
              },
            },
            step: {
              width: 1,
              strokeColor: 'white',
            },
          },
          histogram: {
            line: {
              width: 1,
              strokeColor: 'white',
            },
            coloredLine: {
              upBar: {
                width: 1,
                strokeColor: 'green',
              },
              downBar: {
                width: 1,
                strokeColor: 'red',
              },
            },
            column: {
              line: {
                strokeEnabled: false,
                width: 1,
                strokeColor: 'white',
              },
              fill: {
                fillColor: 'blue',
              },
            },
            coloredColumn: {
              upBar: {
                line: {
                  strokeEnabled: false,
                  width: 1,
                  strokeColor: 'white',
                },
                fill: {
                  fillColor: 'green',
                },
              },
              downBar: {
                line: {
                  strokeEnabled: false,
                  width: 1,
                  strokeColor: 'white',
                },
                fill: {
                  fillColor: 'red',
                },
              },
            },
          },
          bar: {
            OHLC: {
              width: 1,
              strokeColor: 'white',
            },
            HLC: {
              width: 1,
              strokeColor: 'white',
            },
            HL: {
              width: 1,
              strokeColor: 'white',
            },
            coloredOHLC: {
              upBar: {
                width: 2,
                strokeColor: chartColors.indicatorUp,
              },
              downBar: {
                width: 2,
                strokeColor: chartColors.indicatorDown,
              },
            },
            coloredHLC: {
              upBar: {
                width: 2,
                strokeColor: chartColors.indicatorUp,
              },
              downBar: {
                width: 2,
                strokeColor: chartColors.indicatorDown,
              },
            },
            coloredHL: {
              upBar: {
                width: 2,
                strokeColor: chartColors.indicatorUp,
              },
              downBar: {
                width: 2,
                strokeColor: chartColors.indicatorDown,
              },
            },
            candle: {
              useGradient: true,
              upCandle: {
                border: {
                  strokeEnabled: false,
                  width: 1,
                  strokeColor: 'white',
                },
                fill: {
                  fillColor: chartColors.indicatorUp,
                },
                wick: {
                  width: 1,
                  strokeColor: chartColors.indicatorUp,
                },
              },
              downCandle: {
                border: {
                  strokeEnabled: false,
                  width: 1,
                  strokeColor: 'white',
                },
                fill: {
                  fillColor: chartColors.indicatorDown,
                },
                wick: {
                  width: 1,
                  strokeColor: chartColors.indicatorDown,
                },
              },
            },
            heikinAshi: {
              upCandle: {
                border: {
                  strokeEnabled: false,
                  width: 1,
                  strokeColor: 'white',
                },
                fill: {
                  fillColor: 'green',
                },
                wick: {
                  width: 1,
                  strokeColor: 'white',
                },
              },
              downCandle: {
                border: {
                  strokeEnabled: false,
                  width: 1,
                  strokeColor: 'white',
                },
                fill: {
                  fillColor: 'red',
                },
                wick: {
                  width: 1,
                  strokeColor: 'white',
                },
              },
            },
            renko: {
              upCandle: {
                border: {
                  strokeEnabled: false,
                  width: 1,
                  strokeColor: 'white',
                },
                fill: {
                  fillColor: 'green',
                },
              },
              downCandle: {
                border: {
                  strokeEnabled: false,
                  width: 1,
                  strokeColor: 'white',
                },
                fill: {
                  fillColor: 'red',
                },
              },
            },
            lineBreak: {
              upCandle: {
                border: {
                  strokeEnabled: true,
                  width: 1,
                  strokeColor: 'green',
                },
                fill: {
                  fillEnabled: false,
                  fillColor: 'green',
                },
              },
              downCandle: {
                border: {
                  strokeEnabled: false,
                  width: 1,
                  strokeColor: 'red',
                },
                fill: {
                  fillEnabled: true,
                  fillColor: 'red',
                },
              },
            },
            hollowCandle: {
              upCandle: {
                border: {
                  strokeEnabled: false,
                  width: 1,
                  strokeColor: 'white',
                },
                fill: {
                  fillColor: 'green',
                },
                wick: {
                  width: 1,
                  strokeColor: 'white',
                },
              },
              downCandle: {
                border: {
                  strokeEnabled: false,
                  width: 1,
                  strokeColor: 'white',
                },
                fill: {
                  fillColor: 'red',
                },
                wick: {
                  width: 1,
                  strokeColor: 'white',
                },
              },
              upHollowCandle: {
                border: {
                  width: 1,
                  strokeColor: chartColors.indicatorUp,
                },
                wick: {
                  width: 1,
                  strokeColor: chartColors.indicatorUp,
                },
              },
              downHollowCandle: {
                border: {
                  width: 1,
                  strokeColor: chartColors.indicatorDown,
                },
                wick: {
                  width: 1,
                  strokeColor: chartColors.indicatorDown,
                },
              },
            },
            pointAndFigure: {
              upCandle: {
                border: {
                  strokeEnabled: true,
                  width: 1,
                  strokeColor: 'green',
                },
              },
              downCandle: {
                border: {
                  strokeEnabled: true,
                  width: 1,
                  strokeColor: 'red',
                },
              },
            },
            kagi: {
              upCandle: {
                border: {
                  strokeEnabled: true,
                  width: 2,
                  strokeColor: 'green',
                },
              },
              downCandle: {
                border: {
                  strokeEnabled: true,
                  width: 2,
                  strokeColor: 'red',
                },
              },
            },
          },
          indicator: {
            convertLineToArea: true,
            bandFill: {
              fillColor: 'rgba(0,0,255,0.5)',
            },
            bandLine: {
              width: 3,
              strokeColor: 'rgba(255,255,255,0.5)',
              lineStyle: 'solid',
            },
            line1: {
              width: 2,
              lineStyle: 'solid',
              strokeColor: '#FDC228',
            },
            line2: {
              width: 2,
              lineStyle: 'solid',
              strokeColor: '#32CD32',
            },
            line3: {
              width: 2,
              lineStyle: 'solid',
              strokeColor: '#FF0000',
            },
            line4: {
              width: 2,
              lineStyle: 'solid',
              strokeColor: '#0000FF',
            },
          },
        },
        selectionMarker: {
          line: {
            strokeColor: 'white',
            width: 1,
          },
          fill: {
            fillColor: 'black',
          },
        },
        drawing: {
          note: {
            text: {
              fontFamily: 'Open Sans',
              fontSize: 11,
              fillColor: 'white',
            },
            fill: {
              fillColor: '#FDC228',
            },
            centerPointFill: {
              fillColor: 'rgb(68, 68, 68)',
            },
          },
          measure: {
            line: {
              width: 1,
              strokeColor: 'white',
              strokeEnabled: true,
              lineStyle: 'dash',
            },
            border: {
              width: 1,
              strokeColor: 'white',
              strokeEnabled: true,
              lineStyle: 'dash',
            },
            fill: {
              fillEnabled: true,
              fillColor: 'rgba(255, 255, 255, 0.9)',
            },
            balloon: {
              text: {
                fontFamily: 'Open Sans',
                fontSize: 12,
                fillColor: '#404040',
              },
              border: {
                width: 1,
                strokeColor: 'darkgray',
                strokeEnabled: true,
                lineStyle: 'solid',
              },
              fill: {
                fillEnabled: true,
                fillColor: 'rgba(255, 255, 255, 0.5)',
              },
            },
          },
          measureTool: {
            line: {
              width: 1,
              strokeColor: 'white',
            },
            text: {
              fontFamily: 'Open Sans',
              fontSize: 11,
              fillColor: 'white',
            },
            fill: {
              fillColor: 'rgba(0, 0, 0, 0.8)',
            },
          },
          abstract: {
            line: {
              strokeColor: '#FDC228',
              width: 3,
            },
            fill: {
              fillColor: 'rgba(255, 255, 255, 0.3)',
            },
            text: {
              fontFamily: 'Open Sans',
              fontSize: 12,
              fillColor: 'white',
              decoration: '',
            },
          },
          callout: {
            line: {
              strokeColor: '#FDC228',
              width: 2,
            },
            connector: {
              strokeColor: '#FFFFFF',
              width: 1,
              lineStyle: 'dot',
            },
            fill: {
              fillColor: 'rgba(255, 255, 255, 0.3)',
            },
            text: {
              fontFamily: 'Open Sans',
              fontSize: 16,
              fillColor: 'white',
              decoration: '',
            },
          },
          trendAngle: {
            line: {
              strokeColor: 'white',
              width: 1,
            },
            text: {
              fontFamily: 'Open Sans',
              fontSize: 12,
              fillColor: 'white',
              decoration: '',
            },
            arc: {
              strokeColor: 'white',
              width: 1,
              lineStyle: 'dot',
            },
            horizontalLine: {
              strokeColor: 'white',
              width: 1,
              lineStyle: 'dot',
            },
          },
          abstractMarker: {
            line: {
              strokeColor: '#FDC228',
              width: 3,
            },
            fill: {
              fillColor: 'white',
            },
            text: {
              fontFamily: 'Open Sans',
              fontSize: 12,
              fillColor: '#404040',
              decoration: '',
            },
          },
          fibonacci: {
            trendLine: {
              strokeColor: 'white',
              width: 1,
              lineStyle: 'dash',
            },
            line: {
              strokeColor: 'white',
              width: 1,
            },
            fill: {
              fillColor: 'rgba(255, 255, 255, 0.3)',
            },
            text: {
              fontFamily: 'Open Sans',
              fontSize: 12,
              fillColor: 'white',
            },
          },
          arrowUp: {
            fill: {
              fillColor: 'limegreen',
            },
          },
          arrowDown: {
            fill: {
              fillColor: 'red',
            },
          },
          text: {
            text: {
              fontFamily: 'Open Sans',
              fontSize: 12,
              fillColor: '#FFFFFF',
              decoration: '',
            },
          },
          image: {
            noImage: {
              line: {
                strokeColor: 'red',
                width: 1,
              },
            },
          },
        },
        tooltip: {
          text: {
            fontFamily: 'Open Sans',
            fontSize: 12,
            fillColor: 'white',
            fontWeight: 'normal',
            fontStyle: 'normal',
            decoration: '',
          },
          border: {
            enabled: true,
            width: 1,
            color: '#C0C0C0',
            lineStyle: 'solid',
          },
          fill: {
            enabled: true,
            color: 'rgba(44, 44, 44, 0.95)',
          },
        },
        spread: {
          ask: {
            line: {
              width: 1,
              strokeColor: '#00D533',
            },
            valueMarker: {
              fill: {
                fillColor: '#00D533',
              },
              text: {
                fontFamily: 'Open Sans',
                fontSize: 14,
                fontStyle: 'normal',
                fillColor: 'white',
              },
            },
          },
          bid: {
            line: {
              width: 1,
              strokeColor: chartColors.bid,
            },
            valueMarker: {
              fill: {
                fillColor: chartColors.bid,
              },
              text: {
                fontFamily: 'Open Sans',
                fontStyle: 'normal',
                fillColor: 'white',
              },
            },
          },
        },
      },
      chartId: '164faf327d7138f914ec2a93def70001',
      containsTriggerableAlerts: false,
    },
  ],
};

export const ecoChartOptions = (data) => {
  const { teamScore, subjectScore, ecologyScore } = data;
  return {
    chart: {
      type: 'bar',
    },
    title: {
      text: '',
    },
    xAxis: {
      categories: ['TEAM', 'PROJECT', 'ECOSYSTEM'],
      labels: {
        align: 'left',
        reserveSpace: true,
      },
      title: {
        text: null,
      },
      tickLength: 0,
      lineColor: 'transparent',
    },
    exporting: { enabled: false },
    yAxis: {
      min: 0,
      x: 15,
      title: {
        text: '',
        align: '',
      },
      labels: {
        enabled: false,
      },
    },
    tooltip: {
      valueSuffix: '',
      formatter() {
        return this.y;
      },
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: false,
        },
      },
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      series: {
        pointWidth: 10,
      },
    },
    series: [
      {
        showInLegend: false,
        data: [teamScore, subjectScore, ecologyScore],
        pointPadding: 0,
        groupPadding: 0.1,
      },
    ],
  };
};

export const popChartOptions = {
  chart: {
    type: 'area',
  },
  title: {
    text: '',
  },
  exporting: { enabled: false },
  xAxis: {
    categories: [0, 1, 2, 3, 4, 5, 6],
    tickLength: 0,
    lineColor: 'transparent',
    min: 0,
    max: 7,
  },
  defs: {
    gradient0: {
      tagName: 'linearGradient',
      id: 'gradient-0',
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 1,
      children: [
        {
          tagName: 'stop',
          offset: 0,
        },
        {
          tagName: 'stop',
          offset: 1,
        },
      ],
    },
    gradient1: {
      tagName: 'linearGradient',
      id: 'gradient-1',
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 1,
      children: [
        {
          tagName: 'stop',
          offset: 0,
        },
        {
          tagName: 'stop',
          offset: 1,
        },
      ],
    },
  },
  credits: {
    enabled: false,
  },
  yAxis: {
    title: {
      text: '',
    },
    tickInterval: 35,
  },
  tooltip: {
    pointFormat: false,
  },
  plotOptions: {
    area: {
      pointStart: 0,
      marker: {
        enabled: false,
        symbol: 'circle',
        radius: 2,
        states: {
          hover: {
            enabled: true,
          },
        },
      },
    },
  },
  series: [
    {
      showInLegend: false,
      data: [29.9, 91.5, 106.4, 80.2, 144.0, 120.0, 135.6, 80.5, 116.4, 110.1, 95.6, 54.4, 180],
    },
  ],
};

export const portfolioHistoryChartOptions = {
  chart: {
    type: 'line',
    backgroundColor: 'rgba(0,0,0,0)',
    marginLeft: -10,
    marginRight: -10,
  },
  title: {
    text: undefined,
    align: 'left',
    style: {
      color: '#000',
      fontSize: '14px',
      fontFamily: '"Gotham", sans-serif',
      fontWeight: 'bold',
    },
  },
  legend: {
    enabled: false,
    layout: 'vertical',
    align: 'left',
    verticalAlign: 'top',
    x: 150,
    y: 100,
    floating: true,
    borderWidth: 1,
    backgroundColor: '#121212',
    itemStyle: {
      color: '#999999',
    },
    itemHoverStyle: {
      color: '#CCCCCC',
    },
    itemHiddenStyle: {
      color: '#444444',
    },
  },
  plotOptions: {
    series: {
      fillOpacity: 0.35,
      softThreshold: true,
      lineWidth: 1,
      marker: {
        enabled: false,
        radius: 2,
      },
      states: {
        hover: {
          enabled: false,
          lineWidth: 1,
        },
      },
    },
  },
  xAxis: {
    title: {
      text: '',
    },
    type: 'datetime',
    dateTimeLabelFormats: {
      day: '%b %e',
      week: '%b %e',
    },
    labels: {
      step: 2,
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
  series: [
    {
      name: 'Value',
      color: '#7ACD45',
      data: [],
    },
  ],
  defs: {
    gradient0: {
      // key
      tagName: 'linearGradient',
      id: 'gradient-0',
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 1,
      children: [
        {
          tagName: 'stop',
          offset: 0,
        },
        {
          tagName: 'stop',
          offset: 1,
        },
      ],
    },
  },
};

export const portfolioBreakdownChartOptions = {
  chart: {
    type: 'pie',
  },
  title: {
    text: undefined,
  },
  plotOptions: {
    series: {
      allowPointSelect: true,
      point: {},
    },
    pie: {
      innerSize: '55%',
      startAngle: 20,
      slicedOffset: 5,
      dataLabels: {
        enabled: false,
      },
      states: {
        hover: {
          halo: {
            size: 5,
          },
        },
      },
    },
  },
  credits: {
    enabled: false,
  },
  series: [
    {
      name: 'Portfolio Breakdown',
      data: [],
    },
  ],
};
