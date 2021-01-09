const Home = artifacts.require("Home");
const Trade = artifacts.require("Trade");

module.exports = async function(deployer) {
  // Deploy Home
  await deployer.deploy(Home);
  const home = await Home.deployed()

  // Deploy Trade
  await deployer.deploy(Trade, home.address);
  const trade = await Trade.deployed()
};
