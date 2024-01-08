// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";

contract Whitelist is Ownable2StepUpgradeable {
    mapping(address => uint256) private whitelist;

    event WhitelistedAddressAdded(address indexed _user);
    event WhitelistedAddressRemoved(address indexed _user);

    /**
     * @dev throws if user is not whitelisted.
     * @param _user address
     */
    modifier onlyIfWhitelisted(address _user) {
        require(whitelist[_user] != 0);
        _;
    }

    function __Whitelist_init() internal onlyInitializing {
        __Ownable2Step_init();
    }

    /**
     * @dev add single address to whitelist
     */
    function addAddressToWhitelist(address _user) external onlyOwner {
        whitelist[_user] = 1;
        emit WhitelistedAddressAdded(_user);
    }

    /**
     * @dev add addresses to whitelist
     */
    function addAddressesToWhitelist(
        address[] calldata _users
    ) external onlyOwner {
        for (uint256 i = 0; i < _users.length; i++) {
            whitelist[_users[i]] = 1;
            emit WhitelistedAddressAdded(_users[i]);
        }
    }

    /**
     * @dev remove single address from whitelist
     */
    function removeAddressFromWhitelist(address _user) external onlyOwner {
        delete whitelist[_user];
        emit WhitelistedAddressRemoved(_user);
    }

    /**
     * @dev remove addresses from whitelist
     */
    function removeAddressesFromWhitelist(
        address[] calldata _users
    ) external onlyOwner {
        for (uint256 i = 0; i < _users.length; i++) {
            delete whitelist[_users[i]];
            emit WhitelistedAddressRemoved(_users[i]);
        }
    }

    /**
     * @dev getter to determine if address is in whitelist
     */
    function isWhitelisted(address _user) public view returns (bool) {
        return whitelist[_user] != 0;
    }

    uint256[47] private __gap;
}
