// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.4;

contract Governable {
    address public gov;
    address public pendingGov;

    constructor() {
        gov = msg.sender;
    }

    modifier onlyGov() {
        require(msg.sender == gov, "Governable: forbidden");
        _;
    }

    function setPendingGov(address _gov) external onlyGov {
        pendingGov = _gov;
    }

    function acceptGov() external {
        address account = msg.sender;
        require(account == pendingGov, "Governable: caller is not pending gov");
        delete pendingGov;
        gov = account;
    }
}
