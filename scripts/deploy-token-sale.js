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
    "0x205cf2ECE09BF8681c2fa0F6e117f18088567cA1",
    "0x652D76De559326dAd75ae9BEC711CdFC05111f9f",
    1702339200,
    1702857600,
    604800,
    deployer.address
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
