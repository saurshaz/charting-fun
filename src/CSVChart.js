import * as echarts from "echarts";
import { useEffect } from "react";
import CsvParser from "./components/CSVParse";

var upColor = "#00da3c";
var upBorderColor = "#008F28";
var downColor = "#ec0000";
var downBorderColor = "#8A0000";

export const CSVChart = ({
  id = "NASDAQ",
  symbol = "AAPL",
  rateLimit = "15m",
  interval = 15 * 1000
}) => {
  let data = [];

  // const log = ololog.noLocate
  let updateChart = async (data) => {
    // upload OHLC data from CSV file
    console.log("Loaded data from CSV :", data);
    option.series[0].data = data.map((d) => [d.Open, d.Close, d.Low, d.High]);
    option.series[1].data = calculateMA(option.series[0].data, 5);
    option.series[2].data = calculateMA(option.series[0].data, 50);
    option.series[3].data = calculateMA(option.series[0].data, 100);
    option.series[4].data = calculateMA(option.series[0].data, 200);

    console.log(option.series[4].data);

    option.series[0].markLine.data[0].yAxis =
      option.series[4].data[option.series[4].data.length - 2];
    option.series[0].markLine.data[1].yAxis =
      option.series[1].data[option.series[1].data.length - 2];

    option.xAxis.data = data.map((d) => d.Date);
    myChart.setOption(option);
  };

  const _markLine = [];
  _markLine.push({
    name: ["Buy"],
    yAxis: 0,
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
    yAxis: 0,
    label: {
      formatter: "{b}",
      position: "Sell"
    }
  });

  let option = {};

  function calculateMA(data, dayCount) {
    var result = [];
    if (data) {
      for (let i = 0, len = data?.length; i < len; i++) {
        if (i < dayCount) {
          result.push("-");
          continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
          sum += data[i - j][1];
        }
        result.push(sum / dayCount);
      }
    }
    return result;
  }
  option = {
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
        data: data,
        itemStyle: {
          type: "custom",
          //
          dimensions: ["Open", "High", "Low", "Close"],
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
        data: calculateMA(data, 5),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: "MA50",
        type: "line",
        data: calculateMA(data, 50),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: "MA100",
        type: "line",
        data: calculateMA(data, 100),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: "MA200",
        type: "line",
        data: calculateMA(data, 200),
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
    // //   FIXME: replace below with React preferred useRef/createRef syntax
    dom = window.document.getElementById("chart-container");
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

  return (
    <>
      <CsvParser handleData={updateChart} />
    </>
  );
};
