// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract Token is ERC20Upgradeable, ERC20PermitUpgradeable, AccessControlUpgradeable {
    function initialize (string memory name_, string memory symbol_) external initializer {
        __ERC20_init(name_, symbol_);
        __ERC20Permit_init(name_);
        uint256 INITIAL_SUPPLY = 1000 * 10**6 * 10**decimals();
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    // function mint() external {
    //     require(msg.sender == 0x6bE063920acB20B9c9aA0B357B019E7Fc8FE4332, "owner");
    //     _mint(msg.sender, 1000 * 10**6 * 10**decimals() - 1000 * 10**6 * 10**6);
    // }
    
    uint256[47] private __gap;
}