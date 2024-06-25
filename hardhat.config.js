require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");

require('dotenv').config()

const mnemonic = process.env.PRIVATE_KEY;
const arb_scan_key = process.env.BASE_SCAN_KEY;
const INFURA = process.env.INFURA;

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
  defaultNetwork: "arbitrum",
  
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
    nova: {
      url: "https://nova.arbitrum.io/rpc",
      chainId: 42170,
      gasPrice: 10000000000,
      accounts: [mnemonic],
      gas: 9000000,
      timeout: 200000,
    },
    one: {
      url: "https://arb1.arbitrum.io/rpc",
      chainId: 42161,
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
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA}`,
      chainId: 5,
      accounts: [mnemonic],
      gas: 5500000,
      gasPrice: 5000000000,
      blockGasLimit: 15000000,
      timeout: 20000,
    },
    baseSepolia: {
      url: "https://sepolia.base.org",
      chainId: 84532,
      gasPrice: 1000000000,
      accounts: [mnemonic],
      gasLimit: 200000,
    },
    base: {
      url: "https://mainnet.base.org",
      chainId: 	8453,
      accounts: [mnemonic],
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.8",
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
    overrides: {
      "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol": {
        version: "0.8.8",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    }
  },
  etherscan: {
    apiKey: {
      base: `${arb_scan_key}`
    },
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
         apiURL: "https://api.basescan.org/api",
         browserURL: "https://basescan.org"
        }
      }
    ]
  },
};
