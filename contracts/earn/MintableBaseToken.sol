// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.4;

import "./BaseToken.sol";
import "./../interfaces/IMintable.sol";

//bnBFR

contract MintableBaseToken is BaseToken, IMintable {
    mapping(address => bool) public override isMinter;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply
    ) BaseToken(_name, _symbol, _initialSupply) {}

    modifier onlyMinter() {
        require(isMinter[msg.sender], "MintableBaseToken: forbidden");
        _;
    }

    function setMinter(address _minter, bool _isActive)
        external
        override
        onlyGov
    {
        isMinter[_minter] = _isActive;
    }

    function mint(address _account, uint256 _amount)
        external
        override
        onlyMinter
    {
        _mint(_account, _amount);
    }

    function burn(address _account, uint256 _amount)
        external
        override
        onlyMinter
    {
        _burn(_account, _amount);
    }
}