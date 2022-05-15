// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RoyaltyReceiver is Ownable {
    address public recipient1;
    address public recipient2;
    
    function setRecipient1(address _recipient) external onlyOwner {
        require(recipient1 == address(0), "already set");
        recipient1 = _recipient;
    }


    function setRecipient2(address _recipient) external onlyOwner {
        require(recipient2 == address(0), "already set");
        recipient2 = _recipient;
    }

    function claimRoyalties(address token) external {
        // divide rewards by two - distribute 
        uint256 balance = IERC20(token).balanceOf(address(this));
        uint256 half = balance/2;
        IERC20(token).transfer(recipient1, half);
        IERC20(token).transfer(recipient2, half);
    }
}