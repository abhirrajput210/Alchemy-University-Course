// Imports the Alchemy SDK
const {Alchemy, Network} = require("alchemy-sdk");

// Configures the Alchemy SDK
const config = {
    apikey : process.env.REACT_APP_ALCHEMY_API_KEY,
    network : Network.ETH_MAINNET,
}

// Creates an Alchemy object instance with the config to use for making requests
const alchemy = new Alchemy(config);

const main = async () => {
    //Assign the hash to a variable
    let txHash = "0x92fc42b9642023f2ee2e88094df80ce87e15d91afa812fef383e6e5cd96e2ed3"

    //Call the method to return the block with transactions
    let response = await alchemy.core.getBlockWithTransactions(txHash)

    //Logging the response to the console
    console.log(response)
};

main();