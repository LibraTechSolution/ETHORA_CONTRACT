const { parseEther, poll } = require("ethers/lib/utils");
const { upgrades, ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

//   let ETRVester = await ethers.getContractFactory("Vester");
//   let etrVester = await upgrades.deployProxy(ETRVester, [
//     "Vested ETR",
//     "vETR",
//     31536000,
//     esEtr.address,
//     sbfETR.address, // sbf etr
//     etr.address,
//     sETR.address, //sEtr
//   ], {
//     initializer: "initialize",
//   });
//   await etrVester.deployed();
//   console.log("etrVester address:", etrVester.address);

//   let ELPVester = await ethers.getContractFactory("Vester");
//   let elpVester = await upgrades.deployProxy(ELPVester, [
//     "Vested ELP",
//     "vELP",
//     31536000,
//     esEtr.address,
//     fsELP.address, // fsELP
//     etr.address,
//     fsELP.address, //fsELP
//   ], {
//     initializer: "initialize",
//   });
//   await elpVester.deployed();
//   console.log("elpVester address:", elpVester.address);

  try {
    console.log("\nEtherscan verification in progress...");
    await hre.run("verify:verify", {
      address: "0x5aE6D6469C525288aEb4B4aB4C2780cf9A0C2fd2",
      constructorArguments: [
        "Vested ETR",
        "vETR",
        31536000,
        "0x3d5Dbdf29833Ebd5E32F55B243AFB9eDe9A583b3",
        "0x4469eA5afe685C6453b9D0E370453a83fe1f3De1", // sbf etr
        "0x4749bD9cE254fb0e8057Ef5AA10Bd6bEE809aCA7",
        "0x5B5cB70E334888A485BD410F1fb87Aa81D3ceE3e", //sEtr
      ],
    });
    console.log("vEtr verification done.");
    await sleep(4000);

    await hre.run("verify:verify", {
      address: "0x55DF7f21541adcae4e26B09F6E5D460A169B0432",
      constructorArguments: [
        "Vested ELP",
        "vELP",
        31536000,
        "0x3d5Dbdf29833Ebd5E32F55B243AFB9eDe9A583b3",
        "0x2d1CFeDA0D40695783fa92bf01dAAE8F86E7Fb85", // fsELP
        "0x4749bD9cE254fb0e8057Ef5AA10Bd6bEE809aCA7",
        "0x2d1CFeDA0D40695783fa92bf01dAAE8F86E7Fb85" //fsELP
      ],
    });
    console.log("sEtr verification done.");

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
