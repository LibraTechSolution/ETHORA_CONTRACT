const { parseEther } = require("ethers/lib/utils");
const { upgrades, ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  // let USDC = await ethers.getContractFactory('Token')
  // let usdc = await USDC.deploy("USDC", "USDC")
  // await usdc.deployed();
  // console.log("USDC address:", usdc.address);

  // let Faucet = await ethers.getContractFactory('Faucet')
  // let faucet = await Faucet.deploy(
  //   usdc.address,
  //   process.env.DEV,
  //   1695686400
  // )
  // await faucet.deployed();
  // console.log("Faucet address:", faucet.address);

  let Ref = await ethers.getContractFactory('ReferralStorage')
  let ref = await Ref.deploy()
  await ref.deployed();
  console.log("ReferralStorage address:", ref.address);
  
  await ref.configure(
    [2,4,6],
    [25000,50000,75000]
  );
  console.log(1);
  await sleep(4000);

  await ref.setOperator(
    deployer.address,
    true
  );
  console.log(2);
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
