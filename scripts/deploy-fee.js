const { parseEther, poll } = require("ethers/lib/utils");
const { upgrades, ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  let Fee = await ethers.getContractFactory("SettlementFeeDistributor");
  let fee = await upgrades.deployProxy(Fee, [
    "0x22F2D35C812Ad4Fe5B8AA3658a5E3Fc1c3D7bA27"
  ], {
    initializer: "initialize",
  });
  await fee.deployed();
  console.log("SettlementFeeDistributor address:", fee.address);

  // await fee.setShareHolderDetails(
  //   [
  //     "0x2818Ece980Ef660126075E71608F8337BD95A69b",
  //     "0x1A4fe9A6534Ad24081f5A1626D8158B96920e0D0",
  //     "0xc9Be5A7DFc35492C9aA6EE8bF018bF2BFa8E3119"
  //   ],
  //   [
  //       6500,
  //       2500,
  //       1000
  //   ]
  // );
  // console.log(1);
  // await sleep(4000);

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