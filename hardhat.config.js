/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("hardhat-gas-reporter");
require("solidity-coverage");
const {
  infuraProjectId,
  privateKey,
  etherscanApiKey,
  coinMarketCapApiKey,
  rinkebyPrivateKey,
} = require("./secrets.json");
const deployer = "0x51e8c347F85082603b90dD1381e128DEdC825b49";
const mockWeth = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

task("deploy-upgrade", async (_, hre) => {
  let auctionHouseProxyAddress = "0xbd789beddb50f9231ea3e2ec76afeb80c3e43fc8"; // mainnet proxy

  const fluidDAONFTFactory = await ethers.getContractFactory("FluidDAONFT");

  newFluidDAONFT = await fluidDAONFTFactory.deploy();
  await newFluidDAONFT.deployed();
  console.log(`new NFT ${newFluidDAONFT.address}`);

  tx = await newFluidDAONFT.setAuctionHouse(auctionHouseProxyAddress);
  console.log(`setAuctionHouse hash ${tx.hash}`);
  await tx.wait();
  let baseURI = "ipfs://QmZg8yY13qegnucYpP5BvvHBV7172vr428RwqMKx8fCYEQ/";
  tx = await newFluidDAONFT.setBaseURI(baseURI);
  console.log(`setBaseURI hash ${tx.hash}`);
  await tx.wait();

  const auctionHouseFactory = await ethers.getContractFactory("AuctionHouse");
  auctionHouse = auctionHouseFactory.attach(auctionHouseProxyAddress);

  const newAuctionHouseFactory = await ethers.getContractFactory(
    "AuctionHouseV2"
  );
  const implementation = await newAuctionHouseFactory.deploy();
  console.log(`new impl addr ${implementation.address}`);
  await implementation.deployed();
  tx = await auctionHouse.upgradeTo(implementation.address);
  console.log(`upgradeTo hash ${tx.hash}`);
  await tx.wait();

  auctionHouse = newAuctionHouseFactory.attach(auctionHouseProxyAddress);
  tx = await auctionHouse.reMintAndSetNewNFT(newFluidDAONFT.address);
  console.log(`remint hash ${tx.hash}`);
  await tx.wait();
});

task("deploy-auction", async (_, hre) => {
  const fluidDAONFTFactory = await ethers.getContractFactory("FluidDAONFT");
  const auctionHouseFactory = await ethers.getContractFactory("AuctionHouse");
  const auctionHouseProxyFactory = await ethers.getContractFactory(
    "AuctionHouseProxy"
  );

  fluidDAONFT = await fluidDAONFTFactory.deploy({
    gasLimit: ethers.BigNumber.from("2000000"),
  });
  await fluidDAONFT.deployed();

  console.log(`fluidDAONFT ${fluidDAONFT.address}`);

  const implementation = await auctionHouseFactory.deploy();
  await implementation.deployed();
  console.log(`auctionHouse implementation ${implementation.address}`);

  const fragment = auctionHouseFactory.interface.getFunction("initialize");
  const initData = auctionHouseFactory.interface.encodeFunctionData(fragment, [
    fluidDAONFT.address,
    mockWeth,
    300, // 5min
    ethers.BigNumber.from("1000000000000000000"), // 1 ether
    5,
    60 * 60 * 12, // 12hr
  ]);

  const proxy = await auctionHouseProxyFactory.deploy(
    implementation.address,
    initData
  );
  await proxy.deployed();
  console.log(`auctionHouse proxy ${proxy.address}`);
  await fluidDAONFT.setAuctionHouse(proxy.address);
});

task("verify-auction", async (_, hre) => {
  fluidDAONFTAddress = "0x97b6623ff1F426dFBbceAbA24EdA3B312B6dF1Cd";
  impl = "0x4c4770F0c37844E4246aF1b3F96739EEE59792f6";
  proxy = "0x103084347e412EA48751a44b11753FD7780EDeE5";
  addresses = [fluidDAONFTAddress, impl];
  for (i = 0; i < addresses.length; i++) {
    verifyResult = await hre.run("verify:verify", {
      address: addresses[i],
    });
    console.log(verifyResult);
  }

  // const auctionHouseFactory = await ethers.getContractFactory("AuctionHouse");
  // const fragment = auctionHouseFactory.interface.getFunction("initialize");
  // const initData = auctionHouseFactory.interface.encodeFunctionData(
  //   fragment,
  //   [
  //     fluidDAONFTAddress,
  //     mockWeth,
  //     300, // 5min
  //     ethers.BigNumber.from("1000000000000000000"), // 1 ether
  //     5,
  //     60 * 60 * 24, // 24hr
  //   ],
  //   { gasLimit: "800000" }
  // );
  // verifyResult = await hre.run("verify:verify", {
  //   address: proxy,
  //   contract: "contracts/AuctionHouseProxy.sol:AuctionHouseProxy",
  //   constructorArguments: [impl, initData],
  // });
  // console.log(verifyResult);
});
module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: etherscanApiKey,
  },
  networks: {
    mainnet: {
      url: `https://mainnet.infura.io/v3/${infuraProjectId}`,
      // accounts: [`0x${privateKey}`],
      gasPrice: 300000000000,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${infuraProjectId}`,
      accounts: [`0x${privateKey}`],
    },
    hardhat: {
      forking: {
        url: "https://mainnet-eth.compound.finance/",
        blockNumber: 13518840,
        // accounts: [`0x${privateKey}`],
      },
    },
  },
  mocha: {
    timeout: 600000,
  },
  gasReporter: {
    currency: "USD",
    coinmarketcap: coinMarketCapApiKey,
  },
};
