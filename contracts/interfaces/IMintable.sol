// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.4;

interface IMintable {
    function isMinter(address _account) external returns (uint256);

    function setMinter(address _minter, uint256 _isActive) external;

    function mint(address _account, uint256 _amount) external;

    function burn(address _account, uint256 _amount) external;
}
