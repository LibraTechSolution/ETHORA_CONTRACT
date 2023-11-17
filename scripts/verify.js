const { parseEther, poll } = require("ethers/lib/utils");
const { upgrades, ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

//   let BFRVester = await ethers.getContractFactory("Vester");
//   let bfrVester = await upgrades.deployProxy(BFRVester, [
//     "Vested BFR",
//     "vBFR",
//     31536000,
//     esBfr.address,
//     sbfBFR.address, // sbf bfr
//     bfr.address,
//     sBFR.address, //sBfr
//   ], {
//     initializer: "initialize",
//   });
//   await bfrVester.deployed();
//   console.log("bfrVester address:", bfrVester.address);

//   let BLPVester = await ethers.getContractFactory("Vester");
//   let blpVester = await upgrades.deployProxy(BLPVester, [
//     "Vested BLP",
//     "vBLP",
//     31536000,
//     esBfr.address,
//     fsBLP.address, // fsBLP
//     bfr.address,
//     fsBLP.address, //fsBLP
//   ], {
//     initializer: "initialize",
//   });
//   await blpVester.deployed();
//   console.log("blpVester address:", blpVester.address);

  try {
    console.log("\nEtherscan verification in progress...");
    await hre.run("verify:verify", {
      address: "0x5aE6D6469C525288aEb4B4aB4C2780cf9A0C2fd2",
      constructorArguments: [
        "Vested BFR",
        "vBFR",
        31536000,
        "0x3d5Dbdf29833Ebd5E32F55B243AFB9eDe9A583b3",
        "0x4469eA5afe685C6453b9D0E370453a83fe1f3De1", // sbf bfr
        "0x4749bD9cE254fb0e8057Ef5AA10Bd6bEE809aCA7",
        "0x5B5cB70E334888A485BD410F1fb87Aa81D3ceE3e", //sBfr
      ],
    });
    console.log("vBfr verification done.");
    await sleep(4000);

    await hre.run("verify:verify", {
      address: "0x55DF7f21541adcae4e26B09F6E5D460A169B0432",
      constructorArguments: [
        "Vested BLP",
        "vBLP",
        31536000,
        "0x3d5Dbdf29833Ebd5E32F55B243AFB9eDe9A583b3",
        "0x2d1CFeDA0D40695783fa92bf01dAAE8F86E7Fb85", // fsBLP
        "0x4749bD9cE254fb0e8057Ef5AA10Bd6bEE809aCA7",
        "0x2d1CFeDA0D40695783fa92bf01dAAE8F86E7Fb85" //fsBLP
      ],
    });
    console.log("sBfr verification done.");

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
