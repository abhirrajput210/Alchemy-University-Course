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
      setTransactions(getBlockWithTransactions.transactions.slice(0, 10));
    }

    getBlockData();
  }, []);

  const handleGetBlockTransactions = () => {
    setShowTransactions(true);
  };

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
          <table >
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
      </div>
    </>
  );
}

export default App;
