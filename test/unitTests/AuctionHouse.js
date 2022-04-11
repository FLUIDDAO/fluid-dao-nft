const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const { signLenderMessage } = require("../testUtils.js");

describe("AuctionHouse", () => {
  let accounts;
  let admin, adminAddress;
  let fluidDAONFT;
  let auctionHouse;
  let mockWeth = "0xc778417e063141139fce010982780140aa0cd5ab";

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    admin = accounts[0];
    adminAddress = await admin.getAddress();
    const fluidDAONFTFactory = await ethers.getContractFactory("FluidDAONFT");
    const auctionHouseFactory = await ethers.getContractFactory("AuctionHouse");
    const auctionHouseProxyFactory = await ethers.getContractFactory(
      "AuctionHouseProxy"
    );

    fluidDAONFT = await fluidDAONFTFactory.deploy();
    await fluidDAONFT.deployed();
    console.log(`fluidDAONFT ${fluidDAONFT.address}`);

    const implementation = await auctionHouseFactory.deploy();
    await implementation.deployed();
    console.log(`auctionHouse implementation ${implementation.address}`);

    const fragment = auctionHouseFactory.interface.getFunction("initialize");
    const initData = auctionHouseFactory.interface.encodeFunctionData(
      fragment,
      [
        fluidDAONFT.address,
        mockWeth,
        300, // 5min
        ethers.BigNumber.from("1000000000000000000"), // 1 ether
        5,
        3600, // 60 min one auction
      ]
    );

    const proxy = await auctionHouseProxyFactory.deploy(
      implementation.address,
      initData,
      { gasLimit: ethers.BigNumber.from("500000") }
    );
    await proxy.deployed();
    console.log(`auctionHouse proxy ${proxy.address}`);
    auctionHouse = auctionHouseFactory.attach(proxy.address);
    await fluidDAONFT.setAuctionHouse(proxy.address);
  });
  it("unpause auction", async () => {
    await auctionHouse.unpause();
    auction = await auctionHouse.auction();
    expect(auction.endTime.sub(auction.startTime).eq(60 * 60)).to.be.true;
  });
});
