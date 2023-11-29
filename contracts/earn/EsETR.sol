// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.4;

import "./MintableBaseToken.sol";

contract EsETR is MintableBaseToken {
    constructor() MintableBaseToken("Escrowed ETR", "esETR", 0) {}

    function id() external pure returns (string memory _name) {
        return "esETR";
    }
}