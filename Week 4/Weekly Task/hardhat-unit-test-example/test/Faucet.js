const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');

describe('Faucet', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractAndSetVariables() {
    const Faucet = await ethers.getContractFactory('Faucet');
    const faucet = await Faucet.deploy();

    const [owner] = await ethers.getSigners();

    let withdrawAmount = ethers.parseUnits('1', 'ether');

    return { faucet, owner, withdrawAmount };
  }

  it('should deploy and set the owner correctly', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

    expect(await faucet.owner()).to.equal(owner.address);
  });

  it('should not allow withdrawals above .1 ETH at a time', async function () {
    const { faucet, withdrawAmount } = await loadFixture(
      deployContractAndSetVariables
    );
    await expect(faucet.withdraw(withdrawAmount)).to.be.reverted;
  });

  it("should allow the contract owner to call destroyFaucet()", async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);
    await expect(faucet.connect(owner).destroyFaucet()).to.not.be.reverted;
  });
  
  // it("should not allow non-owner to call destroyFaucet()", async function () {
  //   const { faucet } = await loadFixture(deployContractAndSetVariables);
  //   const [, nonOwner] = await ethers.getSigners();
  //   await expect(faucet.connect(nonOwner).destroyFaucet()).to.be.revertedWith(
  //     "Ownable: caller is not the owner"
  //   );
  // }); 
  
  it("should allow the contract owner to call withdrawAll()", async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);
    await expect(faucet.connect(owner).withdrawAll()).to.not.be.reverted;
  });
  
  // it("should not allow non-owner to call withdrawAll()", async function () {
  //   const { faucet } = await loadFixture(deployContractAndSetVariables);
  //   const [, nonOwner] = await ethers.getSigners();
  //   await expect(faucet.connect(nonOwner).withdrawAll()).to.be.revertedWith(
  //     "Ownable: caller is not the owner"
  //   );
  // }); 
  
});