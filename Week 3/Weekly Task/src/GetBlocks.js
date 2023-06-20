const { Alchemy, Network } = require("alchemy-sdk");

const config = {
    apikey : process.env.REACT_APP_ALCHEMY_API_KEY,
    network : Network.ETH_MAINNET,
}

const alchemy = new Alchemy(config);

const main = async () => {
    let txHash = "0x92fc42b9642023f2ee2e88094df80ce87e15d91afa812fef383e6e5cd96e2ed3"
    let response = await alchemy.core.getBlock(txHash);
    console.log(response);
}

main();