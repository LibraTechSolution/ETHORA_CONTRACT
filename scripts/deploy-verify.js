const { parseEther } = require("ethers/lib/utils");
const { upgrades, ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  let Ref = await ethers.getContractFactory('Verifier')
  let ref = await Ref.deploy()
  await ref.deployed();
  console.log("Verifier address:", ref.address);
  
  await sleep(4000);

  await hre.run("verify:verify", {
    address: ref.address,
    constructorArguments: [],
  });
  console.log("Verifier verification done.");
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
