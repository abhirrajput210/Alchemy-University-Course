const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const {toHex, utf8ToBytes} = require("ethereum-cryptography/utils")

app.use(cors());
app.use(express.json());

const balances = {
  "04b6adaa39595b3d40a3bd5bc668e811c080d3f789311b7ab0ee42717a15d9c5e940c36beb0d10dc2f15df91aa1679756b4d5b6300b5b4810e8b891dfaf8a4e834": 100,
  "0466e9b26a7ca346db790c1f741f9d5c3907302cac734a5d24c6088d3f98dd94bda49d742d23773254aa6a6cb76574168f836586733fd2acffa9727a5847ce74f7": 50,
  "048b68b0ebd469a4ca98b7b8c19b862b1b4283dd61a40ca025405b08ce0e42d86a8bc60b66a4815e376559ba2d408d11f9e543b89004317e823e9e2cc3090fc0aa": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async(req, res) => {
  console.log("In Server : ");
  console.log(req.body);
  const { sender, recipient, amount, signature, recovery } = req.body;

  // if(!signature) res.status(404).send({ message: "signature not provide" });
  // if(!recovery) res.status(400).send({ message: "recovery not provide" });

  try {
    
    const bytes = utf8ToBytes(JSON.stringify({ sender, recipient, amount }));
    const hash = keccak256(bytes);

    const sig = new Uint8Array(signature);
    const publicKey = await secp.recoverPublicKey(hash, sig, recovery);
    console.log("Public Key :",publicKey);

    if(toHex(publicKey) !== sender){
      res.status(400).send({ message: "signature is not valid" });
    }

    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } catch (error) {
    console.log(error.message)
  }
  
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}


