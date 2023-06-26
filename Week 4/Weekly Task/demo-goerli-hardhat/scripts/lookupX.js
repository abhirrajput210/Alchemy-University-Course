const hre = require("hardhat");

const CONTRACT_ADDR = "0x228F0843FEd5232E094eB36B6660FF88A9681F17";

async function main() {
  const contract = await hre.ethers.getContractAt("Contract",CONTRACT_ADDR);

  console.log(await contract.x());

  console.log(
    `Contract was deployed to ${contract.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
