import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';
import { instanceEscrowContract } from './deploy';

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    // const value = ethers.BigNumber.from(document.getElementById('wei').value);
    const value = ethers.utils.parseEther(`${document.getElementById('wei').value}`);

    const escrowContract = await deploy(signer, arbiter, beneficiary, value);

    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value:  `${ethers.utils.formatEther(value.toString())}`,
      // value: value.toString(),
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          document.getElementById(escrowContract.address).className =
            'complete';
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
        });

        await approve(escrowContract, signer);
      },
    };

    const isIncludeEscrow = escrows.findIndex(escrowItem => escrowItem.address === escrow.address);

    if (isIncludeEscrow === -1) {
      setEscrows([...escrows, escrow]);
    } else {
     alert('Escrow has already been inserted');
    }
  }

  async function searchContract() {
    const contractAddress = document.getElementById('contract').value;

    if (contractAddress === "") return alert('contract address dont was provides')

    const escrowContract = await instanceEscrowContract(contractAddress, signer);
    console.log("Escrow Contract -------------",escrowContract);

    const valueContract = await Promise.all([escrowContract.arbiter(), escrowContract.beneficiary(), provider.getBalance(escrowContract.address)])

    const escrow = {
      address: contractAddress,
      arbiter: valueContract[0],
      beneficiary: valueContract[1],
      value: `${ethers.utils.formatEther(valueContract[2].toString())}`,
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          document.getElementById(escrowContract.address).className =
            'complete';
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
        });

        await approve(escrowContract, signer, valueContract[0]);
      },
    };

    const isIncludeEscrow = escrows.findIndex(escrowItem => escrowItem.address === escrow.address);

    if (isIncludeEscrow === -1){
      setEscrows([...escrows, escrow]);
    }else{
      alert('Escrow has already been inserted')
    }
  }

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in Ether)
          <input type="text" id="wei" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

        <div className="contract">
          <h1> SearchContract </h1>
          <label>
            Address Contract
            <input type="text" id="contract" />
          </label>

          <div
            className="button"
            id="Search"
            onClick={(e) => {
              e.preventDefault();

              searchContract();
            }}
          >
            Search
          </div>
        </div>

        <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
    </>
  );
}

export default App;


// import { ethers } from 'ethers';
// import { useEffect, useState } from 'react';
// import deploy from './deploy';
// import Escrow from './Escrow';

// const provider = new ethers.providers.Web3Provider(window.ethereum);

// export async function approve(escrowContract, signer) {
//   const approveTxn = await escrowContract.connect(signer).approve();
//   await approveTxn.wait();
// }

// function saveEscrowsToLocalStorage(escrows) {
//   localStorage.setItem('escrows', JSON.stringify(escrows));
// }

// function App() {
//   const [escrows, setEscrows] = useState([]);
//   const [account, setAccount] = useState();
//   const [signer, setSigner] = useState();

//   useEffect(() => {
//     async function getAccounts() {
//       const accounts = await provider.send('eth_requestAccounts', []);

//       setAccount(accounts[0]);
//       setSigner(provider.getSigner());
//     }

//     getAccounts();
//   }, [account]);

//   useEffect(() => {
//     // Retrieve escrows from local storage on page load
//     const savedEscrows = localStorage.getItem('escrows');
//     if (savedEscrows) {
//       setEscrows(JSON.parse(savedEscrows));
//     }
//   }, [account]);

//   useEffect(() => {
//     return () => {
//       // Remove escrows from local storage when component unmounts
//       localStorage.removeItem('escrows');
//     };
//   }, []);

//   async function newContract() {
//     const beneficiary = document.getElementById('beneficiary').value;
//     const arbiter = document.getElementById('arbiter').value;
//     const value = ethers.utils.parseEther(
//       `${document.getElementById('wei').value}`
//     );

//     const escrowContract = await deploy(signer, arbiter, beneficiary, value);

//     const escrow = {
//       address: escrowContract.address,
//       arbiter,
//       beneficiary,
//       value: `${ethers.utils.formatEther(value.toString())}`,
//       handleApprove: async () => {
//         escrowContract.on('Approved', () => {
//           document.getElementById(escrowContract.address).className =
//             'complete';
//           document.getElementById(escrowContract.address).innerText =
//             "✓ It's been approved!";
//         });

//         await approve(escrowContract, signer);
//       },
//     };

//     const updatedEscrows = [...escrows, escrow];

//     setEscrows(updatedEscrows);

//     // Save escrows to local storage
//     saveEscrowsToLocalStorage(updatedEscrows);
//   }

//   return (
//     <>
//       <div className="contract">
//         <h1>New Contract</h1>
//         <label>
//           Arbiter Address
//           <input type="text" id="arbiter" />
//         </label>

//         <label>
//           Beneficiary Address
//           <input type="text" id="beneficiary" />
//         </label>

//         <label>
//           Deposit Amount (in Ether)
//           <input type="text" id="wei" />
//         </label>

//         <div
//           className="button"
//           id="deploy"
//           onClick={(e) => {
//             e.preventDefault();

//             newContract();
//           }}
//         >
//           Deploy
//         </div>
//       </div>

//       <div className="existing-contracts">
//         <h1>Existing Contracts</h1>

//         <div id="container">
//           {escrows.map((escrow) => {
//             return <Escrow key={escrow.address} {...escrow} />;
//           })}
//         </div>
//       </div>

      
//     </>
//   );
// }

// export default App;
