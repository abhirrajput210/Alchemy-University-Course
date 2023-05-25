const secp = require("ethereum-cryptography/secp256k1");
// const {secp} = require("ethereum-cryptography/secp256k1");
const {toHex} = require("ethereum-cryptography/utils");
// const {keccak256} = require("ethereum-cryptography/keccak")

const privatekey = secp.utils.randomPrivateKey();
console.log("Private Key : ",toHex(privatekey));

// const publickey = keccak256(secp.secp256k1.getPublicKey(privatekey).slice(1)).slice(-20);
const publickey = secp.getPublicKey(privatekey);
console.log("Public Key :", toHex(publickey));


// Private Key :  5c0296aac4e5fb4d6afc11691e0d1fd0790db3d9869b5b657f27c92f0ed00af2
// Public Key : 04b6adaa39595b3d40a3bd5bc668e811c080d3f789311b7ab0ee42717a15d9c5e940c36beb0d10dc2f15df91aa1679756b4d5b6300b5b4810e8b891dfaf8a4e834


// Private Key :  aa44ee9719f83d4b0e3e4625a0147dadaf80cc3f43176bfd6a9f624fac837bb5
// Public Key : 0466e9b26a7ca346db790c1f741f9d5c3907302cac734a5d24c6088d3f98dd94bda49d742d23773254aa6a6cb76574168f836586733fd2acffa9727a5847ce74f7


// Private Key :  26fd158699984ef9daf4eaf9a862e072b3f000ffe8b09bbc8c342be7761c3f9d
// Public Key : 048b68b0ebd469a4ca98b7b8c19b862b1b4283dd61a40ca025405b08ce0e42d86a8bc60b66a4815e376559ba2d408d11f9e543b89004317e823e9e2cc3090fc0aa