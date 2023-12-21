const { parseEther, poll } = require("ethers/lib/utils");
const { upgrades, ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  let Token = await ethers.getContractFactory("USDC");
  let token = await upgrades.deployProxy(Token, ["USDC", "USDC"], {
    initializer: "initialize",
  });
  await token.deployed();
  console.log("token address:", token.address);

  let Faucet = await ethers.getContractFactory('Faucet')
  let faucet = await Faucet.deploy(
    token.address,
    process.env.DEV,
    1695686400
  )
  await faucet.deployed();
  console.log("Faucet address:", faucet.address);

  let Registrar = await ethers.getContractFactory('AccountRegistrar')
  let registrar = await Registrar.deploy()
  await registrar.deployed();
  console.log("Registrar address:", registrar.address);

  let Router = await ethers.getContractFactory('EthoraRouter')
  let router = await upgrades.deployProxy(Router, [
    "0x7bE47C0bc4e267ffF95226e511d570317b371830",
    "0x7bE47C0bc4e267ffF95226e511d570317b371830",
    deployer.address,
    registrar.address
  ], {initializer: "initialize"})
  await router.deployed();
  console.log("EthoraRouter address:", router.address);

  let Ref = await ethers.getContractFactory('ReferralStorage')
  let ref = await Ref.deploy(router.address)
  await ref.deployed();
  console.log("ReferralStorage address:", ref.address);

  let Option = await ethers.getContractFactory('EthoraBinaryOptions')
  let option = await upgrades.deployProxy(Option, [], {initializer: "initialize"})
  await option.deployed();
  console.log("EthoraBinaryOptions address:", option.address);

  let Pool = await ethers.getContractFactory('EthoraBinaryPool')
  let pool = await upgrades.deployProxy(Pool, [
    token.address,
    86400
  ], {initializer: "initialize"})
  await pool.deployed();
  console.log("EthoraBinaryPool address:", pool.address);

  let Ocg = await ethers.getContractFactory('OptionsConfig')
  let ocg = await Ocg.deploy(pool.address)
  await ocg.deployed();
  console.log("OptionsConfig address:", ocg.address);

  let POIS = await ethers.getContractFactory('PoolOIStorage')
  let pois = await POIS.deploy()
  await pois.deployed();
  console.log("PoolOIStorage address:", pois.address);

  let POIC = await ethers.getContractFactory('PoolOIConfig')
  let poic = await POIC.deploy(
    ethers.BigNumber.from("75000000000"),
    pois.address
  )
  await poic.deployed();
  console.log("PoolOIConfig address:", poic.address);

  let MOIC = await ethers.getContractFactory('MarketOIConfig')
  let moic = await MOIC.deploy(
    ethers.BigNumber.from("10000000000"),
    ethers.BigNumber.from("1000000000"),
    option.address
  )
  await moic.deployed();
  console.log("MarketOIConfig address:", moic.address);

  // let Booster = await ethers.getContractFactory('Booster')
  // let booster = await upgrades.deployProxy(Booster, [], {initializer: "initialize"})
  // await booster.deployed();
  // console.log("Booster address:", booster.address);

//   await booster.setBoostPercentage(0)
  
  await option.ownerConfig(
    token.address,
    pool.address,
    ocg.address,
    ref.address,
    1,
    'BTC',
    'USD'
  );
  console.log(1);
  await sleep(4000);

  // await ocg.setBoosterContract(booster.address);
  // console.log(2);
  // await sleep(4000);

  await ocg.setMinFee(ethers.BigNumber.from("5000000"));
  console.log(3);
  await sleep(4000);

  await ocg.setIV(1384);
  console.log(4);
  await sleep(4000);

  await ocg.setPlatformFee(ethers.BigNumber.from("100000"));
  console.log(5);
  await sleep(4000);

  // await ocg.setSettlementFeeDisbursalContract(deployer.address);
  // console.log(6);
  // await sleep(4000);

  await ocg.setMaxPeriod(14400);
  console.log(8);
  await sleep(4000);

  await ocg.setMinPeriod(180);
  console.log(9);
  await sleep(4000);

  await ocg.setPoolOIStorageContract(pois.address);
  console.log(10);
  await sleep(4000);

  await ocg.setPoolOIConfigContract(poic.address);
  console.log(11);
  await sleep(4000);

  await ocg.setMarketOIConfigContract(moic.address);
  console.log(12);
  await sleep(4000);

  await ocg.setEarlyCloseThreshold(60);
  console.log(13);
  await sleep(4000);

  await ocg.toggleEarlyClose();
  console.log(14);
  await sleep(4000);

  await router.setContractRegistry(option.address, true);
  console.log(1);
  await sleep(4000);

  await router.setKeeper("0xbE5aC4FE08041ca0Bd211b74191D7d7e715e5047", true);
  console.log(1);
  await sleep(4000);

  await router.setKeeper("0xdef098259e7831E45eF33c2b9E8a66DD81759c70", true);
  console.log(2);
  await sleep(4000);

  await router.setKeeper("0x6C3286fDeBAF0A08CD9D15D5722381491d72c5a3", true);
  console.log(3);
  await sleep(4000);

  await router.setKeeper("0x537D0a145404EaCf417eA4F13448cd362752F239", true);
  console.log(4);
  await sleep(4000);

  await router.setKeeper("0xc22d7FF9d0bA053C96c2224c37F12F8af340132b", true);
  console.log(5);
  await sleep(4000);

  await registrar.grantRole(
    "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775",
    "0x94E0d9D11bEE566093C20cF7881F36ce1fe7Cb4F"
  );
  console.log(14);
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

  await pool.setMaxLiquidity(ethers.BigNumber.from("10000000000000"));
  console.log(1);
  await sleep(4000);

  await ref.configure(
    [2,4,6],
    [25000,50000,75000]
  );
  console.log(14);
  await sleep(4000);

  await ref.setOperator(
    deployer.address,
    true
  );
  console.log(15);
    await router.setContractRegistry(option.address, true);
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
