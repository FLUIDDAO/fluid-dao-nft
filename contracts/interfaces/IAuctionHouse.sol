// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import {IFluidToken} from "./IFluidToken.sol";

interface IAuctionHouse {
    struct Auction {
        // ID for the fluid DAO NFT (ERC721 token ID)
        uint256 fluidDAONFTId;
        // The current highest bid amount
        uint256 amount;
        // The time that the auction started
        uint256 startTime;
        // The time that the auction is scheduled to end
        uint256 endTime;
        // The address of the current highest bid
        address payable bidder;
        // Whether or not the auction has been settled
        bool settled;
    }

    event AuctionCreated(
        uint256 indexed fluidDAONFTId,
        uint256 startTime,
        uint256 endTime
    );

    event AuctionBid(
        uint256 indexed fluidDAONFTId,
        address sender,
        uint256 value,
        bool extended
    );

    event AuctionExtended(uint256 indexed fluidDAONFTId, uint256 endTime);

    event AuctionSettled(
        uint256 indexed fluidDAONFTId,
        address winner,
        uint256 amount
    );

    event AuctionTimeBufferUpdated(uint256 timeBuffer);

    event AuctionReservePriceUpdated(uint256 reservePrice);

    event AuctionDurationUpdated(uint256 duration);

    event AuctionMinBidIncrementPercentageUpdated(
        uint256 minBidIncrementPercentage
    );

    function settleAuction() external;

    function settleCurrentAndCreateNewAuction() external;

    function createBid(uint256 fluidDAONFTId) external payable;

    function pause() external;

    function unpause() external;

    function setTimeBuffer(uint256 timeBuffer) external;

    function setReservePrice(uint256 reservePrice) external;

    function setDuration(uint256 duration) external;

    function setMinBidIncrementPercentage(uint8 minBidIncrementPercentage)
        external;

    function setFluidToken(IFluidToken _fluidToken) external;
}
