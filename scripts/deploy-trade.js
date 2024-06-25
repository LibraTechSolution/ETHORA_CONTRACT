const { parseEther, poll } = require("ethers/lib/utils");
const { upgrades, ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  let Token = await ethers.getContractFactory("USDC");
  // let token = await upgrades.deployProxy(Token, ["USDC", "USDC"], {
  //   initializer: "initialize",
  // });
  // await token.deployed();
  // console.log("token address:", token.address);
  let token = await Token.attach("0x22F2D35C812Ad4Fe5B8AA3658a5E3Fc1c3D7bA27")

  let Faucet = await ethers.getContractFactory('Faucet')
  // let faucet = await Faucet.deploy(
  //   token.address,
  //   process.env.DEV,
  //   1712448000
  // )
  // await faucet.deployed();
  // console.log("Faucet address:", faucet.address);
  let faucet = await Faucet.attach("0xbb99ae7f3f625f5Ed3690D3CACbef38A0A5E2ad9")

  let Registrar = await ethers.getContractFactory('AccountRegistrar')
  // let registrar = await Registrar.deploy()
  // await registrar.deployed();
  // console.log("Registrar address:", registrar.address);
  let registrar = await Registrar.attach("0x9DF7AecA1d6cf8085c2e88DC83249dfA5c06b314")

  let Router = await ethers.getContractFactory('EthoraRouter')
  // let router = await upgrades.deployProxy(Router, [
  //   "0x7bE47C0bc4e267ffF95226e511d570317b371830",
  //   "0x7bE47C0bc4e267ffF95226e511d570317b371830",
  //   deployer.address,
  //   registrar.address
  // ], {initializer: "initialize"})
  // await router.deployed();
  // console.log("EthoraRouter address:", router.address);
  let router = await Router.attach("0x405F88c12F1E42288684E1bE4CA24565Cd4f9eae")

  let Ref = await ethers.getContractFactory('ReferralStorage')
  // let ref = await Ref.deploy(router.address)
  // await ref.deployed();
  // console.log("ReferralStorage address:", ref.address);
  let ref = await Ref.attach("0x482DBEef3Dc111A1B7b53c75FfF4FD2E31093043")

  let Option = await ethers.getContractFactory('EthoraBinaryOptions')
  // let option = await upgrades.deployProxy(Option, [], {initializer: "initialize"})
  // await option.deployed();
  // console.log("EthoraBinaryOptions address:", option.address);
  let option = await Option.attach("0xFbD781cc27c2373b4d69C42Ff401bDAd305044D3")

  let Pool = await ethers.getContractFactory('EthoraBinaryPool')
  // let pool = await upgrades.deployProxy(Pool, [
  //   token.address,
  //   86400
  // ], {initializer: "initialize"})
  // await pool.deployed();
  // console.log("EthoraBinaryPool address:", pool.address);
  let pool = await Pool.attach("0xF6d6fda1337D5E4aBe582f2f9D66BFDA42A1Ad92")

  let Ocg = await ethers.getContractFactory('OptionsConfig')
  // let ocg = await Ocg.deploy(pool.address)
  // await ocg.deployed();
  // console.log("OptionsConfig address:", ocg.address);
  let ocg = await Ocg.attach("0x4a745d3927EDE05FE1a86F8D47f867B81F933e57")

  let POIS = await ethers.getContractFactory('PoolOIStorage')
  // let pois = await POIS.deploy()
  // await pois.deployed();
  // console.log("PoolOIStorage address:", pois.address);
  let pois = await POIS.attach("0xFAF044398Afcb85B9BFa7481b4cBe706558a8Af2")

  let POIC = await ethers.getContractFactory('PoolOIConfig')
  // let poic = await POIC.deploy(
  //   ethers.BigNumber.from("75000000000"),
  //   pois.address
  // )
  // await poic.deployed();
  // console.log("PoolOIConfig address:", poic.address);
  let poic = await POIC.attach("0x0cd877cF9800261b8E1a09927f3B6a0f1C276327")

  let MOIC = await ethers.getContractFactory('MarketOIConfig')
  // let moic = await MOIC.deploy(
  //   ethers.BigNumber.from("10000000000"),
  //   ethers.BigNumber.from("1000000000"),
  //   option.address
  // )
  // await moic.deployed();
  // console.log("MarketOIConfig address:", moic.address);
  let moic = await MOIC.attach("0x83665D27bc54F7322D3df9Aab9ca5d6C3C944cD8")

  // let Booster = await ethers.getContractFactory('Booster')
  // let booster = await upgrades.deployProxy(Booster, [], {initializer: "initialize"})
  // await booster.deployed();
  // console.log("Booster address:", booster.address);

//   await booster.setBoostPercentage(0)
  
  // await option.ownerConfig(
  //   token.address,
  //   pool.address,
  //   ocg.address,
  //   ref.address,
  //   1,
  //   'BTC',
  //   'USD'
  // );
  // console.log(1);
  // await sleep(4000);

  // // await ocg.setBoosterContract(booster.address);
  // // console.log(2);
  // // await sleep(4000);

  // await ocg.setMinFee(ethers.BigNumber.from("5000000"));
  // console.log(3);
  // await sleep(4000);

  // await ocg.setIV(1384);
  // console.log(4);
  // await sleep(4000);

  // await ocg.setPlatformFee(ethers.BigNumber.from("100000"));
  // console.log(5);
  // await sleep(4000);

  // // await ocg.setSettlementFeeDisbursalContract(deployer.address);
  // // console.log(6);
  // // await sleep(4000);

  // await ocg.setMaxPeriod(14400);
  // console.log(8);
  // await sleep(4000);

  // await ocg.setMinPeriod(180);
  // console.log(9);
  // await sleep(4000);

  // await ocg.setPoolOIStorageContract(pois.address);
  // console.log(10);
  // await sleep(4000);

  // await ocg.setPoolOIConfigContract(poic.address);
  // console.log(11);
  // await sleep(4000);

  // await ocg.setMarketOIConfigContract(moic.address);
  // console.log(12);
  // await sleep(4000);

  // await ocg.setEarlyCloseThreshold(60);
  // console.log(13);
  // await sleep(4000);

  // await ocg.toggleEarlyClose();
  // console.log(14);
  // await sleep(4000);

  // await router.setContractRegistry(option.address, 1);
  // console.log(1);
  // await sleep(4000);

  // await router.setKeeper("0xbE5aC4FE08041ca0Bd211b74191D7d7e715e5047", 1);
  // console.log(1);
  // await sleep(4000);

  // await router.setKeeper("0xdef098259e7831E45eF33c2b9E8a66DD81759c70", 1);
  // console.log(2);
  // await sleep(4000);

  // await router.setKeeper("0x6C3286fDeBAF0A08CD9D15D5722381491d72c5a3", 1);
  // console.log(3);
  // await sleep(4000);

  // await router.setKeeper("0x537D0a145404EaCf417eA4F13448cd362752F239", 1);
  // console.log(4);
  // await sleep(4000);

  // await router.setKeeper("0xc22d7FF9d0bA053C96c2224c37F12F8af340132b", 1);
  // console.log(5);
  // await sleep(4000);

  // await registrar.grantRole(
  //   "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775",
  //   "0x94E0d9D11bEE566093C20cF7881F36ce1fe7Cb4F"
  // );
  // console.log(14);
  // await sleep(4000);

  // await option.grantRole(
  //   "0x7a05a596cb0ce7fdea8a1e1ec73be300bdb35097c944ce1897202f7a13122eb2",
  //   router.address
  // );
  // console.log(14);
  // await sleep(4000);

  // await pool.grantRole(
  //   "0x02b0c433c31e2b44fbbb341ca2a1a7c86f98b5158b42b073f63efe02d35ea89f",
  //   option.address
  // );
  // console.log(15);
  // await sleep(4000);

  // await option.approvePoolToTransferTokenX();
  // console.log(16);
  // await sleep(4000);

  // await pois.grantRole(
  //   "0x6d669f0ad400d1e8b5cb24348f63c19140a11ed83e589bee2bcc8bf167c9331c",
  //   option.address
  // );
  // console.log(17);
  // await sleep(4000);

  // await pool.setMaxLiquidity(ethers.BigNumber.from("10000000000000"));
  // console.log(1);
  // await sleep(4000);

  // await ref.configure(
  //   [2,4,6],
  //   [25000,50000,75000]
  // );
  // console.log(14);
  // await sleep(4000);

  await ref.setOperator(
    deployer.address,
    1
  );
  console.log(15);

  await ref.setOperator(
    "0x94E0d9D11bEE566093C20cF7881F36ce1fe7Cb4F",
    1
  );
  console.log(15);

    // await router.setContractRegistry(option.address, 1);
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
