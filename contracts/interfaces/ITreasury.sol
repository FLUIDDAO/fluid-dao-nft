// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

interface ITreasury {
    function deposit(
        uint256 _amount,
        address _token,
        uint256 _profit
    ) external returns (uint256);
}
