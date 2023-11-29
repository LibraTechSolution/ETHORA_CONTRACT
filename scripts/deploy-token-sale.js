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
    "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    "0x128FD4d4Fa3930176c8155b12c16c58a20feCf60",
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