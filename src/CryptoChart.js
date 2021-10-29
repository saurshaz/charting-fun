import ccxt from "ccxt";
import { useEffect } from "react";
// Import the echarts core module, which provides the necessary interfaces for using echarts.
import * as echarts from "echarts";

var upColor = "#00da3c";
var upBorderColor = "#008F28";
var downColor = "#ec0000";
var downBorderColor = "#8A0000";

const chartProps = {
  id: "binance",
  rateLimit: 15 * 1000,
  symbol: "BTC/USDT",
  interval: "15m"
};

export const CryptoChart = () => {
  const { id, symbol, rateLimit, interval } = chartProps;
  useEffect(() => {
    (async function main() {
      let exchangeFound = ccxt.exchanges.indexOf(id) > -1;
      if (exchangeFound) {
        console.log("Instantiating", id, "exchange");

        // instantiate the exchange by id
        let exchange = new ccxt[id]({ enableRateLimit: interval });
        let markets = await exchange.loadMarkets();
        await updateChart(
          id,
          symbol,
          rateLimit,
          option,
          myChart,
          markets,
          exchange
        );
      } else {
        console.log("Exchange " + id + " not found");
        // printSupportedExchanges ()
      }
    })();
  }, []);

  // const log = ololog.noLocate
  let updateChart = async (
    id,
    symbol,
    rateLimit,
    option,
    myChart,
    markets,
    exchange
  ) => {
    // check if the exchange is supported by ccxt

    exchange.rateLimit = rateLimit ? rateLimit : exchange.rateLimit;

    console.log("Rate limit:", exchange.rateLimit.toString());

    // load all markets from the exchange
    if (symbol in exchange.markets) {
      while (true) {
        const tick = await exchange.fetchOHLCV(symbol, interval);
        let index = [];
        let volumes = [];
        let data = [];
        const getValues = function (tick) {
          for (let _t in tick) {
            data.push([tick[_t][1], tick[_t][4], tick[_t][3], tick[_t][2]]);
            volumes.push(tick[_t][6]);
            index.push(tick[_t][0]);
          }
          return { data, index, volumes };
        };
        let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const values = getValues(tick);
        let prevLength = option.series[0].data.length;
        // debugger;
        option.series[0].index = option.series[0].index || [];

        // FIXME: fix the below condition to identify the last candle uniquely
        if (
          option.series[0].data[prevLength - 1] &&
          option.series[0].data[prevLength - 1][0] ===
            values?.data[prevLength - 1][0] &&
          option.series[0].data[prevLength - 1] &&
          option.series[0].data[prevLength - 1][1] ===
            values?.data[prevLength - 1][1]
        ) {
          // keepUpdating Lasttick 'close' value
          option.series[0].data[prevLength - 1] = values.data[prevLength - 1];
          myChart.setOption(option);
          // FIXME: also check if HIGH and LOW CAN ALSO BE CHANGED AND NEED ADJUSTMENT
        } else {
          // extra data received
          option.series[0].data = values.data;
          option.series[0].volumes = values.volumes;
          option.series[0].index = values.index;
          myChart.setOption(option);
          await sleep(15000); // milliseconds
        }
      }
    } else {
      console.log("Symbol", symbol, "not found");
    }
  };

  var global_data = {
    columns: ["Open", "High", "Low", "Close"],
    data: [],
    index: [],
    volumes: []
  };

  var data0 = global_data;

  const _markLine = [];
  _markLine.push({
    name: ["Buy"],
    yAxis: 1.078,
    lineStyle: {
      normal: {
        type: "dashed",
        color: "green"
      }
    },
    label: {
      formatter: "{b}",
      position: "Buy"
    }
  });
  _markLine.push({
    name: ["Sell"],
    lineStyle: {
      normal: {
        type: "dashed",
        color: "red"
      }
    },
    yAxis: 1.068,
    label: {
      formatter: "{b}",
      position: "Sell"
    }
  });

  function calculateMA(dayCount) {
    var result = [];
    for (var i = 0, len = data0.data.length; i < len; i++) {
      if (i < dayCount) {
        result.push("-");
        continue;
      }
      var sum = 0;
      for (var j = 0; j < dayCount; j++) {
        sum += data0.data[i - j][1];
      }
      result.push(sum / dayCount);
    }
    return result;
  }

  let option = {
    title: {
      text: `${symbol} (${id.toUpperCase()})`,
      left: 10,
      top: 10
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross"
      }
    },
    legend: {
      data: ["MA5", "MA50", "MA100", "MA200"],
      top: 30
    },
    grid: {
      left: "10%",
      right: "10%",
      bottom: "15%"
    },
    xAxis: {
      type: "category",
      scale: true,
      splitArea: {
        show: false
      }
    },
    yAxis: {
      scale: true,
      splitArea: {
        show: false
      }
    },
    dataZoom: [
      {
        show: true,
        type: "slider",
        top: "90%"
      }
    ],
    series: [
      {
        name: symbol,
        type: "candlestick",
        data: data0.data,
        itemStyle: {
          type: "custom",
          //
          dimensions: ["open", "highest", "lowest", "close"],
          color: upColor,
          color0: downColor,
          borderColor: upBorderColor,
          borderColor0: downBorderColor
        },

        markPoint: {
          label: {
            normal: {
              formatter: function (param) {
                return param != null ? Math.round(param.value) : "";
              }
            }
          },
          tooltip: {
            formatter: function (param) {
              return param.name + "<br>" + (param.data.coord || "");
            }
          }
        },
        markLine: {
          data: _markLine,
          symbol: "arrow",
          symbolSize: 9,
          label: {
            show: true
          },

          emphasis: {
            label: {
              show: true
            }
          }
        }
      },
      {
        name: "MA5",
        type: "line",
        data: calculateMA(5),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: "MA50",
        type: "line",
        data: calculateMA(50),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: "MA100",
        type: "line",
        data: calculateMA(100),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: "MA200",
        type: "line",
        data: calculateMA(200),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      }
    ]
  };

  var myChart;
  let dom = null;
  useEffect(() => {
    //   FIXME: replace below with React preferred useRef/createRef syntax
    dom = window.document.getElementById("chart-container");
    console.log(dom);
    if (dom) {
      myChart = echarts.init(dom);
      if (option && typeof option === "object") {
        myChart.setOption(option);
      }
      window.onresize = function () {
        myChart.resize();
      };
    }
  }, [dom]);

  return <></>;
};
