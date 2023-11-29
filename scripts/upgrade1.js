async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance 123:", (await deployer.getBalance()).toString());

    const Item = await ethers.getContractFactory("EthoraBinaryOptions");
    const item = await upgrades.upgradeProxy('0x9c4C031A88F3ddd9D29cD9C8e6513a3988964D9b', Item);
    console.log("Item upgraded");

  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });