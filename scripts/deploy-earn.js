const { parseEther, poll } = require("ethers/lib/utils");
const { upgrades, ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  let BFR = await ethers.getContractFactory("Token");
  let bfr = await upgrades.deployProxy(BFR, ["Buffer Token", "BFR"], {
    initializer: "initialize",
  });
  await bfr.deployed();
  console.log("Bfr address:", bfr.address);

  let BnBFR = await ethers.getContractFactory('MintableBaseToken')
  let bnBfr = await BnBFR.deploy(
    "Bonus BFR",
    "bnBFR",
    parseEther("10000000000000")
  )
  await bnBfr.deployed();
  console.log("bnBfr address:", bnBfr.address);

  let EsBFR = await ethers.getContractFactory('EsBFR')
  let esBfr = await EsBFR.deploy()
  await esBfr.deployed();
  console.log("esBfr address:", esBfr.address);

  // let Gov = await ethers.getContractFactory('Governable')
  // let gov = await Gov.deploy()
  // await gov.deployed();
  // console.log("gov address:", gov.address);

  //stakedBFRTracker sBFR 
  let SBFR = await ethers.getContractFactory('RewardTracker')
  let sBFR = await SBFR.deploy(
    "Staked BFR",
    "sBFR"
  )
  await sBFR.deployed();
  console.log("sBFR address:", sBFR.address);

  let SBFRDis = await ethers.getContractFactory('RewardDistributor')
  let sBFRDis = await SBFRDis.deploy(
    esBfr.address,
    sBFR.address // sBFR
  )
  await sBFRDis.deployed();
  console.log("sBFRDistributor address:", sBFRDis.address);

  //bonusBFRTracker sbBFR
  let SbBFR = await ethers.getContractFactory('RewardTracker')
  let sbBFR = await SbBFR.deploy(
    "Staked + Bonus BFR",
    "sbBFR"
  )
  await sbBFR.deployed();
  console.log("sbBFR address:", sbBFR.address);

  let SbBFRDis = await ethers.getContractFactory('BonusDistributor')
  let sbBFRDis = await SbBFRDis.deploy(
    bnBfr.address,
    sbBFR.address // sbBFR
  )
  await sbBFRDis.deployed();
  console.log("sbBFRDistributor address:", sbBFRDis.address);

  //feeBFRTracker sbfBFR
  let SbfBFR = await ethers.getContractFactory('RewardTracker')
  let sbfBFR = await SbfBFR.deploy(
    "Staked + Bonus + Fee BFR",
    "sbfBFR"
  )
  await sbfBFR.deployed();
  console.log("sbfBFR address:", sbfBFR.address);

  let SbfBFRDis = await ethers.getContractFactory('RewardDistributor')
  let sbfBFRDis = await SbfBFRDis.deploy(
    "0x3F3c63dF6E0571d7bBd8e628A9988C3d3d8234d3", // USDC
    sbfBFR.address // sbfBFR
  )
  await sbfBFRDis.deployed();
  console.log("sbfBFRDistributor address:", sbfBFRDis.address);

  //feeBLPTracker fBLP
  let FBLP = await ethers.getContractFactory('RewardTracker')
  let fBLP = await FBLP.deploy(
    "Fee BLP",
    "fBLP"
  )
  await fBLP.deployed();
  console.log("fBLP address:", fBLP.address);

  let FBLPDis = await ethers.getContractFactory('RewardDistributor')
  let fBLPDis = await FBLPDis.deploy(
    "0x3F3c63dF6E0571d7bBd8e628A9988C3d3d8234d3", // USDC
    fBLP.address // fBLP
  )
  await fBLPDis.deployed();
  console.log("fBLPDistributor address:", fBLPDis.address);

  //stakedBLPTracker fsBLP
  let FsBLP = await ethers.getContractFactory('RewardTracker')
  let fsBLP = await FsBLP.deploy(
    "Fee + Staked BLP",
    "fsBLP"
  )
  await fsBLP.deployed();
  console.log("fsBLP address:", fsBLP.address);

  let FsBLPDis = await ethers.getContractFactory('RewardDistributor')
  let fsBLPDis = await FsBLPDis.deploy(
    esBfr.address, // esBFR
    fsBLP.address // fBLP
  )
  await fsBLPDis.deployed();
  console.log("fsBLPDistributor address:", fsBLPDis.address);


  let BFRVester = await ethers.getContractFactory("Vester");
  let bfrVester = await upgrades.deployProxy(BFRVester, [
    "Vested BFR",
    "vBFR",
    31536000,
    esBfr.address,
    sbfBFR.address, // sbf bfr
    bfr.address,
    sBFR.address, //sBfr
  ], {
    initializer: "initialize",
  });
  await bfrVester.deployed();
  console.log("bfrVester address:", bfrVester.address);

  let BLPVester = await ethers.getContractFactory("Vester");
  let blpVester = await upgrades.deployProxy(BLPVester, [
    "Vested BLP",
    "vBLP",
    31536000,
    esBfr.address,
    fsBLP.address, // fsBLP
    bfr.address,
    fsBLP.address, //fsBLP
  ], {
    initializer: "initialize",
  });
  await blpVester.deployed();
  console.log("blpVester address:", blpVester.address);

  let RouterV2 = await ethers.getContractFactory("RewardRouterV2");
  let routerV2 = await upgrades.deployProxy(RouterV2, [
    "0x3F3c63dF6E0571d7bBd8e628A9988C3d3d8234d3",
    bfr.address,
    esBfr.address,
    bnBfr.address,
    "0x55a53148cEc4D466cc743546Bd2D0714e6801D4c",
    sBFR.address,
    sbBFR.address,
    sbfBFR.address,
    fBLP.address,
    fsBLP.address,
    bfrVester.address,
    blpVester.address
  ], {
    initializer: "initialize",
  });
  await routerV2.deployed();
  console.log("RewardRouterV2 address:", routerV2.address);

  await sleep(4000);

  await sBFR.initialize(
    [
      bfr.address,
      esBfr.address
    ],
    sBFRDis.address
  );
  console.log(1);
  await sleep(4000);

  await sbBFR.initialize(
    [
      sBFR.address
    ],
    sbBFRDis.address
  );
  console.log(2);
  await sleep(4000);

  await sbfBFR.initialize(
    [
      sbBFR.address,
      bnBfr.address
    ],
    sbfBFRDis.address
  );
  console.log(3);
  await sleep(4000);

  await fBLP.initialize(
    [
      "0x55a53148cEc4D466cc743546Bd2D0714e6801D4c"
    ],
    fBLPDis.address
  );
  console.log(4);
  await sleep(4000);

  await fsBLP.initialize(
    [
      fBLP.address
    ],
    fsBLPDis.address
  );
  console.log(5);
  await sleep(4000);

  try {
    console.log("\nEtherscan verification in progress...");
    await hre.run("verify:verify", {
      address: bnBfr.address,
      constructorArguments: [
        "Bonus BFR",
        "bnBFR",
        parseEther("10000000000000")
      ],
    });
    console.log("bnBfr verification done.");
    await sleep(4000);

    await hre.run("verify:verify", {
      address: sBFR.address,
      constructorArguments: [
        "Staked BFR",
        "sBFR"
      ],
    });
    console.log("sBfr verification done.");
    await sleep(4000);

    await hre.run("verify:verify", {
      address: sbBFR.address,
      constructorArguments: [
        "Staked + Bonus BFR",
        "sbBFR"
      ],
    });
    console.log("sbBfr verification done.");
    await sleep(4000);

    await hre.run("verify:verify", {
      address: sbfBFR.address,
      constructorArguments: [
        "Staked + Bonus + Fee BFR",
        "sbfBFR"
      ],
    });
    console.log("sbfBfr verification done.");
    await sleep(4000);

    await hre.run("verify:verify", {
      address: fBLP.address,
      constructorArguments: [
        "Fee BLP",
        "fBLP"
      ],
    });
    console.log("fBLP verification done.");
    await sleep(4000);

    await hre.run("verify:verify", {
      address: fsBLP.address,
      constructorArguments: [
        "Fee + Staked BLP",
        "fsBLP"
      ],
    });
    console.log("fsBLP verification done.");
    await sleep(4000);

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
