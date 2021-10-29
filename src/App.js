import { CryptoChart } from "./CryptoChart";
import { CSVChart } from "./CSVChart";

function App() {
  return (
    <div className="App">
      {/* <CryptoChart /> */}
      <CSVChart />
      <div id="chart-container" style={{ height: 500 }}></div>
    </div>
  );
}

export default App;
