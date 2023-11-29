async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance 123:", (await deployer.getBalance()).toString());

  const Item = await ethers.getContractFactory("EthoraBinaryOptions");
  // const item1 = await upgrades.upgradeProxy('0x9c4C031A88F3ddd9D29cD9C8e6513a3988964D9b', Item);
  // console.log("Item1 upgraded");

  // await item1.initIV();
  // console.log(1);
  // await sleep(4000);

  const item2 = await upgrades.upgradeProxy('0xeBACAfBcb0aC27b67319827F6b09cC84B9017BAA', Item);
  console.log("Item2 upgraded");

  await item2.initIV();
  console.log(2);
  await sleep(4000);

  const item3 = await upgrades.upgradeProxy('0xD25B64CE363c03054591CaD3d69b86E571e1aCf6', Item);
  console.log("Item3 upgraded");

  await item3.initIV();
  console.log(3);
  await sleep(4000);

  const item4 = await upgrades.upgradeProxy('0x65CEb3Cd7241894D189F686a5603CE2eD08ce9b0', Item);
  console.log("Item4 upgraded");

  await item4.initIV();
  console.log(4);
  await sleep(4000);

  const item5 = await upgrades.upgradeProxy('0xaf88116F29EB365cE6519A5612F7C9a85a950210', Item);
  console.log("Item5 upgraded");

  await item5.initIV();
  console.log(5);
  await sleep(4000);

  const item6 = await upgrades.upgradeProxy('0x69287935bea51cF4e6a50FCf51997343DDB6760F', Item);
  console.log("Item6 upgraded");

  await item6.initIV();
  console.log(6);
  await sleep(4000);

  const item7 = await upgrades.upgradeProxy('0xf3d2691552a48E0FB1B601e1d9c4B68a17c228f7', Item);
  console.log("Item7 upgraded");

  await item7.initIV();
  console.log(7);
  await sleep(4000);

  const item8 = await upgrades.upgradeProxy('0x0D2c4a4849B9445dF604d9e24D01C906DAAF360f', Item);
  console.log("Item8 upgraded");

  await item8.initIV();
  console.log(8);
  await sleep(4000);

  const item9 = await upgrades.upgradeProxy('0x25Ed2e9eC55522c19dcF46921dFF4706c3e4Ca82', Item);
  console.log("Item9 upgraded");

  await item9.initIV();
  console.log(9);
  await sleep(4000);

  const item10 = await upgrades.upgradeProxy('0x41167b680f71451c7592ca1e6dDBD4406eeaAE08', Item);
  console.log("Item10 upgraded");

  await item10.initIV();
  console.log(10);
  await sleep(4000);

  const item11 = await upgrades.upgradeProxy('0x19FEfFFFC93bA557331136fBbeC38B1c2a08557C', Item);
  console.log("Item11 upgraded");

  await item11.initIV();
  console.log(11);
  await sleep(4000);

  const item12 = await upgrades.upgradeProxy('0x0DF7811A8F1878f844Dc4485cFfAd9Dff1F8e10b', Item);
  console.log("Item12 upgraded");

  await item12.initIV();
  console.log(12);
  await sleep(4000);
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