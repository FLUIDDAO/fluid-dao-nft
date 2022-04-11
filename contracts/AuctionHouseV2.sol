pragma solidity ^0.8.0;

import "./AuctionHouse.sol";
import "./interfaces/IFluidDAONFT.sol";

contract AuctionHouseV2 is AuctionHouse {
    function reMintAndSetNewNFT(IFluidDAONFT newFluidDAONFT)
        external
        onlyOwner
    {
        for (uint256 i = 0; i <= auction.fluidDAONFTId; i++) {
            // Get owner by token ID.
            address owner = IERC721(address(fluidDAONFT)).ownerOf(i);

            // Mint with new NFT.
            newFluidDAONFT.mint(owner);
            fluidDAONFT.burn(i);
        }

        // Replace the NFT address.
        fluidDAONFT = newFluidDAONFT;
    }
}
