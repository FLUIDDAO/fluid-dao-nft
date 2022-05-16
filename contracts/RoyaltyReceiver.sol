// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RoyaltyReceiver is Ownable {
    address public stakingPool;
    address public dao = 0xB17ca1BC1e9a00850B0b2436e41A055403512387;
    
    function setStakingPool(address _recipient) external onlyOwner {
        require(stakingPool == address(0), "already set");
        stakingPool = _recipient;
    }

    function claimRoyalties(address token) external {
        // divide rewards by two - distribute 
        uint256 balance = IERC20(token).balanceOf(address(this));
        uint256 functionCallReward = balance/100; // 1% reward to caller
        uint256 half = (balance - functionCallReward)/2;
        IERC20(token).transfer(stakingPool, half);
        IERC20(token).transfer(dao, half);
        IERC20(token).transfer(msg.sender, functionCallReward);
    }
}