// Imports the Alchemy SDK
const { Alchemy, Network } = require("alchemy-sdk");

// Configures the Alchemy SDK
const config = {
    apikey : process.env.REACT_APP_ALCHEMY_API_KEY,
    network : Network.ETH_MAINNET,
}
// Creates an Alchemy object instance with the config to use for making requests
const alchemy = new Alchemy(config);

const main = async () => {
    //Initialize variables for the parameters
    const tx = "0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b"
    
    //Call the method to fetch the transaction receipt of the tx
    let response = await alchemy.core.getTransactionReceipt(tx)

    //Logging the response to the console
    console.log(response)
};

main();
