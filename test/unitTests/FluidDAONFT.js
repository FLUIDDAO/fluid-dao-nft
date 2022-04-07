const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FluidDAONFT", () => {
  let accounts;
  let admin, adminAddress;
  let user1, user1Address;
  let weth = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  let fluidDAONFT;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    admin = accounts[0];
    adminAddress = await admin.getAddress();
    user1 = accounts[1];
    user1Address = await user1.getAddress();
    const fluidDAONFTFactory = await ethers.getContractFactory("FluidDAONFT");
    fluidDAONFT = await fluidDAONFTFactory.deploy();
    await fluidDAONFT.setAuctionHouse(adminAddress);
  });

  it("mint", async () => {
    await fluidDAONFT.mint(user1Address);
    expect(await fluidDAONFT.balanceOf(user1Address)).to.eq(1);
  });
  it("set token URI", async () => {
    let tokenURI = "https://test.com/1";
    let baseURI = "https://base.com/";
    await fluidDAONFT.setTokenURI(0, tokenURI);
    await fluidDAONFT.setBaseURI(baseURI);
    await fluidDAONFT.mint(user1Address);
    expect(await fluidDAONFT.tokenURI(0)).to.eq(tokenURI);
    await fluidDAONFT.mint(user1Address);
    expect(await fluidDAONFT.tokenURI(1)).to.eq(`${baseURI}1`);
  });
});
