const { parseEther } = require("ethers/lib/utils");
const { upgrades, ethers } = require("hardhat");
require("dotenv").config()

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  let SETR = await ethers.getContractFactory('RewardTracker')
  let sETR = await SETR.attach("0x8318F443633D9adA6f2572bE5D6B177A3Ad87D70");

  let SbETR = await ethers.getContractFactory('RewardTracker')
  let sbETR = await SbETR.attach("0xe852450bd4D77C32FB1614d179F130bA67B1f186")

  let SbfETR = await ethers.getContractFactory('RewardTracker')
  let sbfETR = await SbfETR.attach("0x0Bf510206298186f495FAaFe8DcF97AC45DA96d9")

  let FELP = await ethers.getContractFactory('RewardTracker')
  let fELP = await FELP.attach("0x4771ef3397740f2a352B6E40d69621637cbf81d7")

  let FsELP = await ethers.getContractFactory('RewardTracker')
  let fsELP = await FsELP.attach("0x34dc7aF4F37e0b177d57b7D1989ba4c33f2a8FEf")

  let BnETR = await ethers.getContractFactory('MintableBaseToken')
  let bnETR = await BnETR.attach("0xA435D5Fa37Ac1Fa6b21F6e4A71dfD0a4e2853Ce9")

  let EsETR = await ethers.getContractFactory('EsETR')
  let esETR = await EsETR.attach("0x59dfFaa04E9e94327ab9F25C41D58e1Fa7C33c6b");

  let Router = await ethers.getContractFactory('RewardRouter')
  let router = await Router.attach("0x58B68825736f9f80f213Afe9AB3206FcE3969AbB");

  let ELP = await ethers.getContractFactory('EthoraBinaryPool')
  let elp = await ELP.attach("0xF6d6fda1337D5E4aBe582f2f9D66BFDA42A1Ad92");

  let ETRVester = await ethers.getContractFactory('Vester')
  let etrVester = await ETRVester.attach("0x782B64346709E8D666e224dfA78387e428382fb3")

  let ELPVester = await ethers.getContractFactory('Vester')
  let elpVester = await ELPVester.attach("0xAD0Ae16aaBCa5C25C0Fa5b2959E453881c3Ee2Bb")

  await sETR.setHandler(
    router.address, // RRV2
    1
  );
  console.log(1)
  await sleep(3000);

  await sbETR.setHandler(
    router.address, //RRV2
    1
  );
  console.log(2)
  await sleep(3000);

  await sbfETR.setHandler(
    router.address, // RRV2
    1
  );
  console.log(3)
  await sleep(3000);

  await fELP.setHandler(
    router.address, // RRV2
    1
  );
  console.log(4)
  await sleep(3000);

  await fsELP.setHandler(
    router.address, // RRV2
    1
  );
  console.log(5)
  await sleep(3000);

  await sETR.setHandler(
    sbETR.address, // sbETR
    1
  );
  console.log(1)
  await sleep(3000);

  await sbETR.setHandler(
    sbfETR.address, //sbfETR
    1
  );
  console.log(2)
  await sleep(3000);

  await bnETR.setHandler(
    sbfETR.address, // sbfETR
    1
  );
  console.log(3)
  await sleep(3000);

  await fELP.setHandler(
    fsELP.address, // fsELP
    1
  );
  console.log(4)
  await sleep(3000);

  await bnETR.setHandler(
    router.address, // RRV2
    1
  );
  console.log(1)
  await sleep(3000);

  await elp.setHandler(
    router.address, //RRV2
    1
  );
  console.log(2)
  await sleep(3000);

  await sbfETR.setHandler(
    etrVester.address, // etrVester
    1
  );
  console.log(3)
  await sleep(3000);

  await fsELP.setHandler(
    elpVester.address, // elpVester
    1
  );
  console.log(4)
  await sleep(3000);

  await etrVester.setHandler(
    router.address, // RRV2
    1
  );
  console.log(1)
  await sleep(3000);

  await elpVester.setHandler(
    router.address, //RRV2
    1
  );
  console.log(2)
  await sleep(3000);

  await esETR.setHandler(
    etrVester.address, // etrVester
    1
  );
  console.log(3)
  await sleep(3000);

  await esETR.setHandler(
    elpVester.address, // elpVester
    1
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