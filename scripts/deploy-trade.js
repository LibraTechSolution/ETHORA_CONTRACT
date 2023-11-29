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
    process.env.OPERATOR,
    process.env.OPERATOR,
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

  let Osg = await ethers.getContractFactory('OptionStorage')
  let osg = await Osg.deploy()
  await osg.deployed();
  console.log("OptionStorage address:", osg.address);

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

  let Booster = await ethers.getContractFactory('Booster')
  let booster = await upgrades.deployProxy(Booster, [], {initializer: "initialize"})
  await booster.deployed();
  console.log("Booster address:", booster.address);

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

  await ocg.setBoosterContract(booster.address);
  console.log(2);
  await sleep(4000);

  await ocg.setMinFee(ethers.BigNumber.from("5000000"));
  console.log(3);
  await sleep(4000);

  await ocg.setIV(1384);
  console.log(4);
  await sleep(4000);

  await ocg.setPlatformFee(ethers.BigNumber.from("100000"));
  console.log(5);
  await sleep(4000);

  await ocg.setSettlementFeeDisbursalContract(deployer.address);
  console.log(6);
  await sleep(4000);

  await ocg.setOptionStorageContract(osg.address);
  console.log(7);
  await sleep(4000);

  await ocg.setMaxPeriod(14400);
  console.log(8);
  await sleep(4000);

  await ocg.setMinPeriod(60);
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

  await pool.setMaxLiquidity(ethers.BigNumber.from("5000000000000"));
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
