import { EthProvider } from "./contexts/EthContext";
import Demo from "./components/Demo";
import Ipfs from "./ipfs/ipfs.js"
function App() {
  return (
    <EthProvider>
      <div id="App">
        <div className="container">
          <hr />
          <Demo />
          <hr />
          <hr />
          <Ipfs />
          <hr />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
