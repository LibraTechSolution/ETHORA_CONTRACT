const { parseEther, poll, parseUnits } = require("ethers/lib/utils");
const { upgrades, ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  let TokenSale = await ethers.getContractFactory("TokenSaleV2");
  let ts = await upgrades.deployProxy(TokenSale, [], {
    initializer: "initialize",
  });

  await ts.deployed();
  console.log("TokenSale address:", ts.address);

  await ts.initSale(
    "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    "0x0000000000000000000000000000000000000000",
    1719392400,
    1750928400,
    60480,
    86400
  );
  console.log(1);
  await sleep(4000);

  await ts.setPool(
    parseUnits("150000", 6),
    parseEther("18750000"),
    parseUnits("2000", 6),
    []
  );
  console.log(1);
  await sleep(4000);

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
