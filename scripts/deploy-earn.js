const { parseEther, poll } = require("ethers/lib/utils");
const { upgrades, ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  let ETR = await ethers.getContractFactory("Token");
  let etr = await upgrades.deployProxy(ETR, ["Ethora Token", "ETR"], {
    initializer: "initialize",
  });
  await etr.deployed();
  console.log("Etr address:", etr.address);

  let BnETR = await ethers.getContractFactory('MintableBaseToken')
  let bnEtr = await BnETR.deploy(
    "Bonus ETR",
    "bnETR",
    parseEther("10000000000000")
  )
  await bnEtr.deployed();
  console.log("bnEtr address:", bnEtr.address);

  let EsETR = await ethers.getContractFactory('EsETR')
  let esEtr = await EsETR.deploy()
  await esEtr.deployed();
  console.log("esEtr address:", esEtr.address);

  // let Gov = await ethers.getContractFactory('Governable')
  // let gov = await Gov.deploy()
  // await gov.deployed();
  // console.log("gov address:", gov.address);

  //stakedETRTracker sETR 
  let SETR = await ethers.getContractFactory('RewardTracker')
  let sETR = await SETR.deploy(
    "Staked ETR",
    "sETR"
  )
  await sETR.deployed();
  console.log("sETR address:", sETR.address);

  let SETRDis = await ethers.getContractFactory('RewardDistributor')
  let sETRDis = await SETRDis.deploy(
    esEtr.address,
    sETR.address // sETR
  )
  await sETRDis.deployed();
  console.log("sETRDistributor address:", sETRDis.address);

  //bonusETRTracker sbETR
  let SbETR = await ethers.getContractFactory('RewardTracker')
  let sbETR = await SbETR.deploy(
    "Staked + Bonus ETR",
    "sbETR"
  )
  await sbETR.deployed();
  console.log("sbETR address:", sbETR.address);

  let SbETRDis = await ethers.getContractFactory('BonusDistributor')
  let sbETRDis = await SbETRDis.deploy(
    bnEtr.address,
    sbETR.address // sbETR
  )
  await sbETRDis.deployed();
  console.log("sbETRDistributor address:", sbETRDis.address);

  //feeETRTracker sbfETR
  let SbfETR = await ethers.getContractFactory('RewardTracker')
  let sbfETR = await SbfETR.deploy(
    "Staked + Bonus + Fee ETR",
    "sbfETR"
  )
  await sbfETR.deployed();
  console.log("sbfETR address:", sbfETR.address);

  let SbfETRDis = await ethers.getContractFactory('RewardDistributor')
  let sbfETRDis = await SbfETRDis.deploy(
    "0x22F2D35C812Ad4Fe5B8AA3658a5E3Fc1c3D7bA27", // USDC
    sbfETR.address // sbfETR
  )
  await sbfETRDis.deployed();
  console.log("sbfETRDistributor address:", sbfETRDis.address);

  //feeELPTracker fELP
  let FELP = await ethers.getContractFactory('RewardTracker')
  let fELP = await FELP.deploy(
    "Fee ELP",
    "fELP"
  )
  await fELP.deployed();
  console.log("fELP address:", fELP.address);

  let FELPDis = await ethers.getContractFactory('RewardDistributor')
  let fELPDis = await FELPDis.deploy(
    "0x22F2D35C812Ad4Fe5B8AA3658a5E3Fc1c3D7bA27", // USDC
    fELP.address // fELP
  )
  await fELPDis.deployed();
  console.log("fELPDistributor address:", fELPDis.address);

  //stakedELPTracker fsELP
  let FsELP = await ethers.getContractFactory('RewardTracker')
  let fsELP = await FsELP.deploy(
    "Fee + Staked ELP",
    "fsELP"
  )
  await fsELP.deployed();
  console.log("fsELP address:", fsELP.address);

  let FsELPDis = await ethers.getContractFactory('RewardDistributor')
  let fsELPDis = await FsELPDis.deploy(
    esEtr.address, // esETR
    fsELP.address // fELP
  )
  await fsELPDis.deployed();
  console.log("fsELPDistributor address:", fsELPDis.address);


  let ETRVester = await ethers.getContractFactory("Vester");
  let etrVester = await upgrades.deployProxy(ETRVester, [
    "Vested ETR",
    "vETR",
    31536000,
    esEtr.address,
    sbfETR.address, // sbf etr
    etr.address,
    sETR.address, //sEtr
  ], {
    initializer: "initialize",
  });
  await etrVester.deployed();
  console.log("etrVester address:", etrVester.address);

  let ELPVester = await ethers.getContractFactory("Vester");
  let elpVester = await upgrades.deployProxy(ELPVester, [
    "Vested ELP",
    "vELP",
    31536000,
    esEtr.address,
    fsELP.address, // fsELP
    etr.address,
    fsELP.address, //fsELP
  ], {
    initializer: "initialize",
  });
  await elpVester.deployed();
  console.log("elpVester address:", elpVester.address);

  let Router = await ethers.getContractFactory("RewardRouter");
  let router = await upgrades.deployProxy(Router, [
    "0x22F2D35C812Ad4Fe5B8AA3658a5E3Fc1c3D7bA27",  //usdc
    etr.address,
    esEtr.address,
    bnEtr.address,
    "0xF6d6fda1337D5E4aBe582f2f9D66BFDA42A1Ad92",
    sETR.address,
    sbETR.address,
    sbfETR.address,
    fELP.address,
    fsELP.address,
    etrVester.address,
    elpVester.address
  ], {
    initializer: "initialize",
  });
  await router.deployed();
  console.log("RewardRouter address:", router.address);

  // let Fee = await ethers.getContractFactory("SettlementFeeDistributor");
  // let fee = await upgrades.deployProxy(Fee, [
  //   "0x22F2D35C812Ad4Fe5B8AA3658a5E3Fc1c3D7bA27" //USDC
  // ], {
  //   initializer: "initialize",
  // });
  // await fee.deployed();
  // console.log("SettlementFeeDistributor address:", fee.address);

  // await sleep(4000);

  // await fee.setShareHolderDetails(
  //   [
  //     fELPDis.address,
  //     sbfETRDis.address,
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

  await sETR.initialize(
    [
      etr.address,
      esEtr.address
    ],
    sETRDis.address
  );
  console.log(1);
  await sleep(4000);

  await sbETR.initialize(
    [
      sETR.address
    ],
    sbETRDis.address
  );
  console.log(2);
  await sleep(4000);

  await sbfETR.initialize(
    [
      sbETR.address,
      bnEtr.address
    ],
    sbfETRDis.address
  );
  console.log(3);
  await sleep(4000);

  await fELP.initialize(
    [
      "0xF6d6fda1337D5E4aBe582f2f9D66BFDA42A1Ad92" //elp
    ],
    fELPDis.address
  );
  console.log(4);
  await sleep(4000);

  await fsELP.initialize(
    [
      fELP.address
    ],
    fsELPDis.address
  );
  console.log(5);
  await sleep(4000);

  try {
    console.log("\nEtherscan verification in progress...");
    await hre.run("verify:verify", {
      address: bnEtr.address,
      constructorArguments: [
        "Bonus ETR",
        "bnETR",
        parseEther("10000000000000")
      ],
    });
    console.log("bnEtr verification done.");
    await sleep(4000);

    await hre.run("verify:verify", {
      address: sETR.address,
      constructorArguments: [
        "Staked ETR",
        "sETR"
      ],
    });
    console.log("sEtr verification done.");
    await sleep(4000);

    await hre.run("verify:verify", {
      address: sbETR.address,
      constructorArguments: [
        "Staked + Bonus ETR",
        "sbETR"
      ],
    });
    console.log("sbEtr verification done.");
    await sleep(4000);

    await hre.run("verify:verify", {
      address: sbfETR.address,
      constructorArguments: [
        "Staked + Bonus + Fee ETR",
        "sbfETR"
      ],
    });
    console.log("sbfEtr verification done.");
    await sleep(4000);

    await hre.run("verify:verify", {
      address: fELP.address,
      constructorArguments: [
        "Fee ELP",
        "fELP"
      ],
    });
    console.log("fELP verification done.");
    await sleep(4000);

    await hre.run("verify:verify", {
      address: fsELP.address,
      constructorArguments: [
        "Fee + Staked ELP",
        "fsELP"
      ],
    });
    console.log("fsELP verification done.");
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
