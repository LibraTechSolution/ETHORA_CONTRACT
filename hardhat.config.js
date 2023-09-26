require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");

require('dotenv').config()

const mnemonic = process.env.PRIVATE_KEY;
const mum_scan_key = process.env.MUM_SCAN_KEY;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import("hardhat/config").HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "mumbai",
  
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {
      gas: "auto",
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {},
    testnet: {
      url: "https://data-seed-prebsc-2-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 10000000000,
      accounts: [mnemonic],
      gas: 9000000,
      timeout: 200000,
    },
    mainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 10000000000,
      accounts: [mnemonic],
      gasLimit: 200000,
    },
    arbitrum: {
      url: "https://goerli-rollup.arbitrum.io/rpc",
      chainId: 421613	,
      gasPrice: 10000000000,
      accounts: [mnemonic],
      gasLimit: 200000,
    },
    mumbai: {
      url: "https://rpc.ankr.com/polygon_mumbai",
      chainId: 80001	,
      gasPrice: 10000000000,
      accounts: [mnemonic],
      gasLimit: 20000000,
    },
    polygon: {
      url: "https://rpc.ankr.com/polygon",
      chainId: 137,
      accounts: [mnemonic],
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.4.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }

    ],
  },
  etherscan: {
    apiKey: {polygonMumbai: `${mum_scan_key}`},
  },
};
