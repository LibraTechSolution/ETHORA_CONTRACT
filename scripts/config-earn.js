const { parseEther } = require("ethers/lib/utils");
const { upgrades, ethers } = require("hardhat");
require("dotenv").config()

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  let SETR = await ethers.getContractFactory('RewardTracker')
  let sETR = await SETR.attach("0xb0bEd494FD3297432aE2Da7713e8E3B0879Ecf01");

  let SbETR = await ethers.getContractFactory('RewardTracker')
  let sbETR = await SbETR.attach("0x1c141446C2972F6DAb6Fe4f2B062844C54A9Bc4d")

  let SbfETR = await ethers.getContractFactory('RewardTracker')
  let sbfETR = await SbfETR.attach("0x3382c6f891eB27E4E6B244De4a7c640a85D0D417")

  let FELP = await ethers.getContractFactory('RewardTracker')
  let fELP = await FELP.attach("0x3e2019d52F85197241D985529e33C29c48F93855")

  let FsELP = await ethers.getContractFactory('RewardTracker')
  let fsELP = await FsELP.attach("0x3af29a14db4eA470565f433E2092a3e6E8142058")

  let BnETR = await ethers.getContractFactory('MintableBaseToken')
  let bnETR = await BnETR.attach("0xa91e6160614266c062CB9929A46e819c37774ac9")

  let EsETR = await ethers.getContractFactory('EsETR')
  let esETR = await EsETR.attach("0xDC60Bb738Fd647c2C3704CB4Ba8F7de3B2B097AA");

  let Router = await ethers.getContractFactory('RewardRouter')
  let router = await Router.attach("0x433C3B35ACCb0BF4df9EC92C2FD92D391ddBe899");

  let ELP = await ethers.getContractFactory('EthoraBinaryPool')
  let elp = await ELP.attach("0xb935Dcb88cae8dc4C016E4Bcd2f6115192ae4009");

  let ETRVester = await ethers.getContractFactory('Vester')
  let etrVester = await ETRVester.attach("0x514CA5c7788D997007Ce4d53Fb555E542eDa7694")

  let ELPVester = await ethers.getContractFactory('Vester')
  let elpVester = await ELPVester.attach("0x28f1be8968D136e76a67A72e4866a5FA556f85f0")

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