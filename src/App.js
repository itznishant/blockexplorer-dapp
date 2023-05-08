import axios from 'axios';
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Search from './components/Search';
import LatestBlocks from './components/LatestBlocks';
import Blocks from './pages/Blocks';
import Transactions from './pages/Transactions';
import Errorpage from './pages/Errorpage';
import Addresses from './pages/Addresses';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
export const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
// Alchemy SDK is an umbrella library with several different packages.
const alchemy = new Alchemy(settings);

function App() {
  const [supply, setSupply]= useState("");
  const [blocks, setBlocks] = useState([]);
  const [blockNumber, setBlockNumber] = useState();
  const [blockGasInfo, setBlockGasInfo] = useState([]);
  const [networkGasPrice, setNetworkGasPrice] = useState("");
  const [topTransactions, setTopTransactions] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState();

  const displayBlockchainData = async () => {
      //get block data
      const result = await alchemy.core.getBlock(blockNumber);
      setBlockNumber(parseInt(result.number));
      setTotalTransactions(result.transactions.length);
      
      //gas price in gwei
      const gasPrice = await alchemy.core.getGasPrice().then( response => ((parseInt(Utils.parseUnits(response.toString(), 'wei'))) / 10**9) );
      setNetworkGasPrice(gasPrice.toString());
      const gasTarget = -1 * (parseInt((parseInt(result.gasLimit)/2) - parseInt(result.gasUsed)) / (parseInt(result.gasLimit)/2)) * 100;
      const gasUsedPct = (parseInt(result.gasUsed) / parseInt(result.gasLimit)) * 100;

      setBlockGasInfo([parseInt(result.gasLimit), parseInt(result.gasUsed),parseInt(gasUsedPct),parseInt(gasTarget)]);

      //transactions List
      for (var i = result.transactions.length-1; i >= result.transactions.length-5; i--) {
        topTransactions.push(result.transactions[i]);
      }
      setTopTransactions(topTransactions);

      //latest blocks
      const blockPromises = [];
      for (i = result.number; i > result.number-5;  i--) {
        blockPromises.push(i);
      }

      const blocks = await Promise.all(blockPromises);
      const blockTimestamps = await Promise.all(blockPromises.map(async (blockNumber) => {
          const block = await alchemy.core.getBlock(blockNumber);
          return block.timestamp;
      }));

      const blocksData = blockTimestamps.map((timestamp, index) => ({
          blockNumber: blocks[index]
      }));

      setBlocks(blocksData);

      //ETH Supply
      const BASE_URL = "https://api.etherscan.io/api";
      const REQ_PARAM = "ethsupply";
      const requestUrlSupply = `${BASE_URL}?module=stats&action=${REQ_PARAM}`;

      return new Promise((resolve, reject) => {
        axios.get(requestUrlSupply).then((response) => {
          const ethSupply = response.data.result;
          resolve(setSupply(ethSupply));
        });
      });
  }
  useEffect(() => {
    if(topTransactions.length <= 5) {
      displayBlockchainData()
    }
  }, [topTransactions])


  return (
    <Router>
    <div className="App">
      <Navbar />
      <br />
      <Switch>
      <Route exact path='/'>
      <div className='pt-14 flex justify-center'>
        <Search />
      </div>
      <div className="chain__header_container">
        <div className="chain__stats_l">
          <h2>Mainnet Stats</h2>      
          <ul>
            <li><strong>GAS PRICE: </strong>{networkGasPrice.slice(0,5)} Gwei</li>
            <li><strong>ETH SUPPLY: </strong>{supply}</li>
            <li><strong>TOTAL BLOCKS: </strong>{blockNumber}</li>
          </ul>
        </div>
        <div className="chain__stats_r">
          <h2>Block Stats</h2>
          <ul>
            <li><strong>CURRENT BLOCK: </strong> {blockNumber}</li>
            <li><strong>TOTAL TRANSACTIONS IN BLOCK: </strong> {totalTransactions}</li>
            <li><strong>GAS LIMIT: </strong> {blockGasInfo[0]}</li>
            <li><strong>GAS USED: </strong> {blockGasInfo[1]} ({blockGasInfo[2]}%)</li>
            <li><strong>GAS TARGET: </strong> {blockGasInfo[3]}%</li>
          </ul>
        </div>
      </div>
      <div className="chain__data_container">
        <div className="chain__data_l">
          <h2>Top Transactions (Block)</h2>
          {topTransactions.map( (txID, index) => <ul key={txID}><Link className="App__link" to={`/transaction/${txID}`}>{txID}</Link></ul>)}
        </div>
        <div className='chain__data_r'>
          <h2>Latest Blocks</h2>
          <LatestBlocks blocks={blocks} />
        </div>
      </div>
      </Route>
      <Route exact path="/block/:blocknumber">
        <Blocks />
      </Route>
      <Route exact path="/transaction/:transaction">
        <Transactions />
      </Route>
      <Route exact path="/address/:address">
        <Addresses />
      </Route>
      <Route path="*">
        <Errorpage />
      </Route>
      </Switch>
    <Footer />
  </div>
  </Router>
  );
}

export default App;
