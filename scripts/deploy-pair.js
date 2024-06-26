const { parseEther, poll, parseUnits } = require("ethers/lib/utils");
const { upgrades, ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  let Token = await ethers.getContractFactory("Token");
  let token = await Token.attach("0x3F3c63dF6E0571d7bBd8e628A9988C3d3d8234d3")
//   let token = await upgrades.deployProxy(Token, ["USDC", "USDC"], {
//     initializer: "initialize",
//   });
//   await token.deployed();
//   console.log("token address:", token.address);

//   let Faucet = await ethers.getContractFactory('Faucet')
//   let faucet = await Faucet.deploy(
//     token.address,
//     process.env.DEV,
//     1695686400
//   )
//   await faucet.deployed();
//   console.log("Faucet address:", faucet.address);

//   let Registrar = await ethers.getContractFactory('AccountRegistrar')
//   let registrar = await Registrar.deploy()
//   await registrar.deployed();
//   console.log("Registrar address:", registrar.address);

  let Router = await ethers.getContractFactory('BufferRouter')
  let router = await Router.attach("0xd2BDcd234872416C3b3d4Ec82CC30782AF30cd60")
//   let router = await upgrades.deployProxy(Router, [
//     process.env.OPERATOR,
//     process.env.OPERATOR,
//     deployer.address,
//     registrar.address
//   ], {initializer: "initialize"})
//   await router.deployed();
//   console.log("BufferRouter address:", router.address);

//   let Ref = await ethers.getContractFactory('ReferralStorage')
//   let ref = await Ref.deploy(router.address)
//   await ref.deployed();
//   console.log("ReferralStorage address:", ref.address);

  let Option = await ethers.getContractFactory('BufferBinaryOptions')
  let option = await Option.attach("0x25ffe1A6BB755C9A4bDA91aC2B0aDb98A85F85d2")
//   let option = await upgrades.deployProxy(Option, [], {initializer: "initialize"})
//   await option.deployed();
//   console.log("BufferBinaryOptions address:", option.address);

  let Pool = await ethers.getContractFactory('BufferBinaryPool')
  let pool = await Pool.attach("0x55a53148cEc4D466cc743546Bd2D0714e6801D4c")
//   let pool = await upgrades.deployProxy(Pool, [
//     token.address,
//     86400
//   ], {initializer: "initialize"})
//   await pool.deployed();
//   console.log("BufferBinaryPool address:", pool.address);

  let Ocg = await ethers.getContractFactory('OptionsConfig')
  let ocg = await Ocg.attach("0x9B689852C790812D303e80b489009f8e5AbBd01b")
//   let ocg = await Ocg.deploy(pool.address)
//   await ocg.deployed();
//   console.log("OptionsConfig address:", ocg.address);

//   let Osg = await ethers.getContractFactory('OptionStorage')
//   let osg = await Osg.deploy()
//   await osg.deployed();
//   console.log("OptionStorage address:", osg.address);

  let POIS = await ethers.getContractFactory('PoolOIStorage')
  let pois = await POIS.attach("0x1ff8E4fcA841ef8c56C2cCD816A54C4346233B6d")
//   let pois = await POIS.deploy()
//   await pois.deployed();
//   console.log("PoolOIStorage address:", pois.address);

//   let POIC = await ethers.getContractFactory('PoolOIConfig')
//   let poic = await POIC.deploy(
//     ethers.BigNumber.from("75000000000"),
//     pois.address
//   )
//   await poic.deployed();
//   console.log("PoolOIConfig address:", poic.address);

  let MOIC = await ethers.getContractFactory('MarketOIConfig')
  let moic = await MOIC.attach("0xC176e511EC9a9eCe7D2aa885F7b7f5B19D209939")
//   let moic = await MOIC.deploy(
//     ethers.BigNumber.from("10000000000"),
//     ethers.BigNumber.from("1000000000"),
//     option.address
//   )
//   await moic.deployed();
//   console.log("MarketOIConfig address:", moic.address);

//   let Booster = await ethers.getContractFactory('Booster')
//   let booster = await upgrades.deployProxy(Booster, [], {initializer: "initialize"})
//   await booster.deployed();
//   console.log("Booster address:", booster.address);

//   await booster.setBoostPercentage(0)
  
//   await option.ownerConfig(
//     token.address,
//     pool.address,
//     ocg.address,
//     "0x8A34e11E73c2C1A7F97db4f1e960ED8aC4a4B004",
//     1,
//     'XAG',
//     'USD'
//   );
//   console.log(1);
//   await sleep(4000);

//   await ocg.setBoosterContract("0xAe0Db8CA270d2fd6a9D1e2D304eE2915E910da4E");
//   console.log(2);
//   await sleep(4000);

//   await ocg.setMinFee(ethers.BigNumber.from("5000000"));
//   console.log(3);
//   await sleep(4000);

//   await ocg.setIV(1384);
//   console.log(4);
//   await sleep(4000);

//   await ocg.setPlatformFee(ethers.BigNumber.from("100000"));
//   console.log(5);
//   await sleep(4000);

//   await ocg.setSettlementFeeDisbursalContract(deployer.address);
//   console.log(6);
//   await sleep(4000);

//   await ocg.setOptionStorageContract("0x6230A557561A2b954D42EB5a6c52727c4896e690");
//   console.log(7);
//   await sleep(4000);

//   await ocg.setMaxPeriod(14400);
//   console.log(8);
//   await sleep(4000);

//   await ocg.setMinPeriod(180);
//   console.log(9);
//   await sleep(4000);

//   await ocg.setPoolOIStorageContract(pois.address);
//   console.log(10);
//   await sleep(4000);

//   await ocg.setPoolOIConfigContract("0x9a672c867daCeE58B7B6214AB2d5E3c9e39977c3");
//   console.log(11);
//   await sleep(4000);

//   await ocg.setMarketOIConfigContract(moic.address);
//   console.log(12);
//   await sleep(4000);

//   await ocg.setEarlyCloseThreshold(60);
//   console.log(13);
//   await sleep(4000);

  await router.setContractRegistry(option.address, true);
  console.log(1);
  await sleep(4000);

  await option.grantRole(
    "0x7a05a596cb0ce7fdea8a1e1ec73be300bdb35097c944ce1897202f7a13122eb2",
    router.address
  );
  console.log(14);
  await sleep(4000);

  await pool.grantRole(
    "0x02b0c433c31e2b44fbbb341ca2a1a7c86f98b5158b42b073f63efe02d35ea89f",
    option.address
  );
  console.log(15);
  await sleep(4000);

  await option.approvePoolToTransferTokenX();
  console.log(16);
  await sleep(4000);

  await pois.grantRole(
    "0x6d669f0ad400d1e8b5cb24348f63c19140a11ed83e589bee2bcc8bf167c9331c",
    option.address
  );
  console.log(17);
  await sleep(4000);

  await token.transfer(option.address, ethers.utils.parseUnits("100000", 6));
  console.log(18);
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
