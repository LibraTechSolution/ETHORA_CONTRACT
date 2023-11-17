const { parseEther, poll } = require("ethers/lib/utils");
const { upgrades, ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  let TokenSale = await ethers.getContractFactory("TokenSale");
  let ts = await upgrades.deployProxy(TokenSale, [], {
    initializer: "initialize",
  });
  await ts.deployed();
  console.log("TokenSale address:", ts.address);

  await ts.initSale(
    "0x3F3c63dF6E0571d7bBd8e628A9988C3d3d8234d3",
    "0x4749bD9cE254fb0e8057Ef5AA10Bd6bEE809aCA7",
    1702339200,
    1702857600,
    604800,
    process.env.DEV
  );
  console.log(1);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
