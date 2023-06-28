const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game4', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game4');
    const game = await Game.deploy();

    const address1 = ethers.provider.getSigner(0);
    const address2 = ethers.provider.getSigner(1);


    return { game, address1, address2 };
  }
  it('should be a winner', async function () {
    const { game, address1, address2 } = await loadFixture(deployContractAndSetVariables);

    // nested mappings are rough :}

    await game.connect(address1).write(address2.getAddress());
    await game.connect(address2).win(address1.getAddress());

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
