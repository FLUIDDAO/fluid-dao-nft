// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;
import {IERC721A} from "erc721a/contracts/IERC721A.sol";

interface IFluidDAONFT is IERC721A {
    function mint(address receiver, uint256 amount) external returns (uint256 tokenId);

    function burn(uint256 tokenId) external;
}
