import ccxt from "ccxt";
import HighchartsReact from "highcharts-react-official";
// Import Highcharts
import Highcharts from "highcharts/highstock";
import React, { useEffect, useState } from "react";

// Load Highcharts modules
require("highcharts/indicators/indicators")(Highcharts);
require("highcharts/indicators/pivot-points")(Highcharts);
require("highcharts/indicators/macd")(Highcharts);
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/map")(Highcharts);

const StockChart = ({ options }) => (
  <HighchartsReact
    highcharts={Highcharts}
    constructorType={"stockChart"}
    options={options}
  />
);

const chartProps = {
  id: "binance",
  rateLimit: 15 * 1000,
  symbol: "BTC/USDT",
  interval: "15m"
};

export const HighStockChart = () => {
  const { id, symbol, rateLimit, interval } = chartProps;
  const [ohlc, setOHLC] = useState([]);
  useEffect(() => {
    (async function main() {
      let exchangeFound = ccxt.exchanges.indexOf(id) > -1;
      if (exchangeFound) {
        console.log("Instantiating", id, "exchange");

        // instantiate the exchange by id
        await updateChart(id, symbol, rateLimit, option);
      } else {
        console.log("Exchange " + id + " not found");
        // printSupportedExchanges ()
      }
    })();
  }, []);

  // const log = ololog.noLocate
  let updateChart = async (id, symbol, rateLimit) => {
    // check if the exchange is supported by ccxt
    let exchange = new ccxt[id]({ enableRateLimit: interval });
    let markets = await exchange.loadMarkets();

    exchange.rateLimit = rateLimit ? rateLimit : exchange.rateLimit;

    console.log("Rate limit:", exchange.rateLimit.toString());

    // load all markets from the exchange
    if (symbol in markets) {
      // while (true) {
      const tick = await exchange.fetchOHLCV(symbol, interval);
      let index = [];
      let volumes = [];
      let data = [];
      const getValues = function (tick) {
        for (let _t in tick) {
          data.push([
            tick[_t][0],
            tick[_t][1],
            tick[_t][2],
            tick[_t][3],
            tick[_t][4]
          ]);
          volumes.push(tick[_t][6]);
          index.push(tick[_t][0]);
        }
        return { data, index, volumes };
      };
      // let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const values = getValues(tick);
      console.log(values);
      setOHLC(values?.data || []);

      // }
    } else {
      console.log("Symbol", symbol, "not found");
    }
  };

  let option = {
    yAxis: [
      {
        height: "75%",
        labels: {
          align: "right",
          x: -3
        },
        title: {
          text: "AAPL"
        }
      },
      {
        top: "75%",
        height: "25%",
        labels: {
          align: "right",
          x: -3
        },
        offset: 0,
        title: {
          text: "MACD"
        }
      }
    ],
    rangeSelector: {
      selected: 1
    },
    plotOptions: {
      candlestick: {
        color: "red",
        upColor: "green"
      }
    },
    series: [
      {
        data: ohlc || [],
        type: "candlestick",
        name: `${symbol} Price`,
        id: symbol
      },

      // {
      //   type: "pivotpoints",
      //   linkedTo: symbol,
      //   zIndex: 0,
      //   lineWidth: 1,
      //   dataLabels: {
      //     overflow: "none",
      //     crop: false,
      //     y: 4,
      //     style: {
      //       fontSize: 9
      //     }
      //   }
      // },
      {
        type: "macd",
        yAxis: 1,
        linkedTo: symbol
      }
    ]
  };

  var myChart;
  let dom = null;
  useEffect(() => {
    //   FIXME: replace below with React preferred useRef/createRef syntax
    dom = window.document.getElementById("chart-container");
  }, [dom]);

  return <StockChart options={option} highcharts={Highcharts} />;
};

// render(<App />, document.getElementById('root'));
