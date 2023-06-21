import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function App() {
  const [block, setBlock] = useState();
  const [blockNumber, setBlockNumber] = useState();
  const [blockHash, setBlockHash] = useState();
  const [transactions, setTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [address, setAddress] = useState('');
  const [balance,setBalance] = useState(0);
  const [network, setNetwork] = useState("");

  function handleNetworkChange(event) {
    const { name, value } = event.target;
    console.log(value)
    setNetwork(value);
  }

  useEffect(() => {
    async function getBlockData() {
      const getBlock = await alchemy.core.getBlock();
      console.log(getBlock);
      setBlock(getBlock);

      const getBlockNumber = getBlock.number;
      console.log(getBlockNumber);
      setBlockNumber(getBlockNumber);

      const getBlockHash = getBlock.hash;
      console.log(getBlockHash);
      setBlockHash(getBlockHash);

      const getBlockWithTransactions = await alchemy.core.getBlockWithTransactions(getBlockHash);
      console.log(getBlockWithTransactions.transactions);
      setTransactions(getBlockWithTransactions.transactions);
      console.log(getBlockWithTransactions.transactions);
    }

    getBlockData();
  }, []);

  const handleGetBlockTransactions = () => {
    setShowTransactions(true);
  };

  const displayBalance = async () => {

    const settingsBalance = {
      apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
      network: network,
    };
    
    const alchemyBalance = new Alchemy(settingsBalance);

    let response = await alchemyBalance.core.getBalance(address, "latest")
    let balanceHex = response._hex;
    setBalance(parseInt(balanceHex, 16) / Math.pow(10, 18));
    // console.log("Response",response);
  }

  const handleButtonClick = async (hash) => {
    try {
      const transactionReceipt = await alchemy.core.getTransactionReceipt(hash);
      console.log(transactionReceipt);
      setSelectedTransaction(transactionReceipt);
    } catch (error) {
      console.error('Error fetching transaction details:', error);
    }
  };

  return (
    <>
      <div className="App">
        <div>Block Number: {blockNumber}</div>
        <div>Block Hash: {blockHash}</div>

        <div>
          <button
            className="block_details"
            style={{ marginTop: '10px', fontSize:'1rem'}}
            onClick={handleGetBlockTransactions}
          >
            Get Block Transactions
          </button>
        </div>

        {showTransactions && (
          <div style={{marginTop:"100px", marginBottom:"100px"}}>
            <h2>Block Transactions</h2>
            <div style={{alignItems:'center',justifyContent:'center',display:'flex'}}>
            <div className='transaction_table'>
          <table>
            <thead>
              <tr>
                <th>Transaction Hash</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.hash}>
                  <td>{transaction.hash}</td>
                  <td>
                    <button onClick={() => handleButtonClick(transaction.hash)}>View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          </div>
          </div>
        )}

        {selectedTransaction && (
          <div style={{marginBottom:"100px"}}>
            <h2>Transaction Details</h2>
            <table>
              <tbody>
                <tr>
                  <th>Property</th>
                  <th>Value</th>
                </tr>
                <tr>
                  <td>Transaction Hash</td>
                  <td>{selectedTransaction.transactionHash}</td>
                </tr>
                <tr>
                  <td>Block Number</td>
                  <td>{selectedTransaction.blockNumber}</td>
                </tr>
                <tr>
                  <td>From</td>
                  <td>{selectedTransaction.from}</td>
                </tr>
                <tr>
                  <td>To</td>
                  <td>{selectedTransaction.to}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <div style={{marginTop:"100px",alignItems:"center",justifyContent:"center",marginBottom:"100px"}}>
        <h2>Account Balance</h2>
        <div style={{marginTop:"10px",marginBottom:"10px"}}>  
        <select
                    name="networkList"
                    id="networkList"
                    onChange={handleNetworkChange}
                    defaultValue="Choose your network"
                    style={{width:"616px", height:"50px",fontSize:'1.2rem'}}
                >
                    <option defaultValue="Choose your network" />
                    <option value="Choose your network">Choose your network</option>
                    <option value="eth-mainnet">Ethereum Mainnet</option>
                    <option value="eth-goerli">Ethereum Goerli</option>
                    <option value="polygon-mumbai">Polygon Mumbai</option>
                </select>
                </div>
        <input 
          style={{width:"600px", height:"50px",fontSize:'1.2rem',paddingLeft:"10px"}}
          type='text' 
          placeholder='Enter Your Account Address'
          value={address}
          onChange={(e) => setAddress(e.target.value)}></input>
        <div style={{marginTop:"10px",marginBottom:"10px"}}>

        <input 
          style={{width:"600px", height:"50px",fontSize:'1.2rem',paddingLeft:"10px"}}
          type='text' 
          value={balance + " ETH"}
          onChange={(e) => setAddress(e.target.value)}
          readOnly></input>
        </div>

          <div style={{marginTop:"10px",marginBottom:"10px"}}>
          <button 
            className='account_balance_btn'
            onClick={displayBalance}
            style={{ marginTop: '10px', fontSize:'1rem', marginLeft:"10px"}}>
            CHECK ACCOUNT BALANCE 
          </button>
          </div>
      </div>
      </div>
    </>
  );
}

export default App;
