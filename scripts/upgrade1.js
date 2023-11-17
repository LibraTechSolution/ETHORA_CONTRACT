async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance 123:", (await deployer.getBalance()).toString());

    const Item = await ethers.getContractFactory("BufferRouter");
    const item = await upgrades.upgradeProxy('0xd2BDcd234872416C3b3d4Ec82CC30782AF30cd60', Item);
    console.log("Item upgraded");

  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });