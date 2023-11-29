const { parseEther } = require("ethers/lib/utils");
const { upgrades, ethers } = require("hardhat");
require("dotenv").config()

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  let SETR = await ethers.getContractFactory('RewardTracker')
  let sETR = await SETR.attach("0xf117c60B9A023BAEC75c1A1b3a65EB384dC62639");

  let SbETR = await ethers.getContractFactory('RewardTracker')
  let sbETR = await SbETR.attach("0xe9062C6E0fef1B95C790D91225dC074edA8AA6a1")

  let SbfETR = await ethers.getContractFactory('RewardTracker')
  let sbfETR = await SbfETR.attach("0x839e0818e5Ab0ce1d679B4ae7b5A6a41168B87aF")

  let FELP = await ethers.getContractFactory('RewardTracker')
  let fELP = await FELP.attach("0x3c4965973D363f57CfD00fBeBc229ABc0Cd8F3dA")

  let FsELP = await ethers.getContractFactory('RewardTracker')
  let fsELP = await FsELP.attach("0xd2379D27281933F721c4A8a6b1277843e2c176aB")

  let BnETR = await ethers.getContractFactory('MintableBaseToken')
  let bnETR = await BnETR.attach("0x0F2f3c303Ce3Be69F30Ef757bDA7F14a38BEE7F7")

  let EsETR = await ethers.getContractFactory('EsETR')
  let esETR = await EsETR.attach("0x7Fd1A7DfBF63865bd01f3Aef615Ce3c803D750C0");

  let Router = await ethers.getContractFactory('RewardRouter')
  let router = await Router.attach("0xEE2516fec6c8a888b39e3039D93bcADdFCC455b4");

  let ELP = await ethers.getContractFactory('EthoraBinaryPool')
  let elp = await ELP.attach("0xE1751c304c28d46E3D6582D10F427C40d60eAB7C");

  let ETRVester = await ethers.getContractFactory('Vester')
  let etrVester = await ETRVester.attach("0xE19b3Fccd4d9cD7a2436d1451CD3154345b77D66")

  let ELPVester = await ethers.getContractFactory('Vester')
  let elpVester = await ELPVester.attach("0xfe23BaD1323A8CA03C6876e646E24f80BcAEb172")

  await sETR.setHandler(
    router.address, // RRV2
    true
  );
  console.log(1)
  await sleep(3000);

  await sbETR.setHandler(
    router.address, //RRV2
    true
  );
  console.log(2)
  await sleep(3000);

  await sbfETR.setHandler(
    router.address, // RRV2
    true
  );
  console.log(3)
  await sleep(3000);

  await fELP.setHandler(
    router.address, // RRV2
    true
  );
  console.log(4)
  await sleep(3000);

  await fsELP.setHandler(
    router.address, // RRV2
    true
  );
  console.log(5)
  await sleep(3000);

  await sETR.setHandler(
    sbETR.address, // sbETR
    true
  );
  console.log(1)
  await sleep(3000);

  await sbETR.setHandler(
    sbfETR.address, //sbfETR
    true
  );
  console.log(2)
  await sleep(3000);

  await bnETR.setHandler(
    sbfETR.address, // sbfETR
    true
  );
  console.log(3)
  await sleep(3000);

  await fELP.setHandler(
    fsELP.address, // fsELP
    true
  );
  console.log(4)
  await sleep(3000);

  await bnETR.setHandler(
    router.address, // RRV2
    true
  );
  console.log(1)
  await sleep(3000);

  await elp.setHandler(
    router.address, //RRV2
    true
  );
  console.log(2)
  await sleep(3000);

  await sbfETR.setHandler(
    etrVester.address, // etrVester
    true
  );
  console.log(3)
  await sleep(3000);

  await fsELP.setHandler(
    elpVester.address, // elpVester
    true
  );
  console.log(4)
  await sleep(3000);

  await etrVester.setHandler(
    router.address, // RRV2
    true
  );
  console.log(1)
  await sleep(3000);

  await elpVester.setHandler(
    router.address, //RRV2
    true
  );
  console.log(2)
  await sleep(3000);

  await esETR.setHandler(
    etrVester.address, // etrVester
    true
  );
  console.log(3)
  await sleep(3000);

  await esETR.setHandler(
    elpVester.address, // elpVester
    true
  );
  console.log(4)
  await sleep(3000);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }