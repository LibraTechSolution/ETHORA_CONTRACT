const { parseEther, poll } = require("ethers/lib/utils");
const { upgrades, ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  let ETR = await ethers.getContractFactory('LERC20')
  let etr = await ETR.deploy(
    parseEther("10000000000000"),
    "Ethora Token",
    "ETR",
    deployer.address,
    deployer.address,
    86400,
    "0x87E2cdF69325E5208890A08C64D94546E15323E3"
  )
  await etr.deployed();
  console.log("Etr address:", etr.address);


  try {
    console.log("\nEtherscan verification in progress...");
    await hre.run("verify:verify", {
      address: etr.address,
      constructorArguments: [
        parseEther("10000000000000"),
        "Ethora Token",
        "ETR",
        deployer.address,
        deployer.address,
        86400,
        "0x87E2cdF69325E5208890A08C64D94546E15323E3"
      ],
    });
    console.log("Etr verification done.");

  } catch (error) {
    console.error(error);
  }

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
