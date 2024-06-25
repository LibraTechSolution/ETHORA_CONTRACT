async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance 123:", (await deployer.getBalance()).toString());

    // const Item = await ethers.getContractFactory("EthoraBinaryOptions");
    // const item = await upgrades.upgradeProxy('0xFbD781cc27c2373b4d69C42Ff401bDAd305044D3', Item);
    // console.log("Item upgraded");

    // const Router = await ethers.getContractFactory("EthoraRouter");
    // const router = await upgrades.upgradeProxy('0x405F88c12F1E42288684E1bE4CA24565Cd4f9eae', Router);
    // console.log("Item upgraded");

    const Router = await ethers.getContractFactory("TokenSaleV2");
    const router = await upgrades.upgradeProxy('0xefEC69f44b6e86C57CC4C1E3d46F2d521EFB814a', Router);
    console.log("Item upgraded");

  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });