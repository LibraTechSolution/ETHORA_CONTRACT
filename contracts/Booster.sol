// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.4;

import "./interfaces/interfaces.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-IERC20PermitUpgradeable.sol";

/**
 * @author Heisenberg
 * @notice Ethora Options Router Contract
 */
contract Booster is OwnableUpgradeable, IBooster, AccessControlUpgradeable {
    using SafeERC20Upgradeable for ERC20Upgradeable;

    uint16 public MAX_TRADES_PER_BOOST;
    uint256 public boostPercentage;
    bytes32 public OPTION_ISSUER_ROLE;
    address admin;

    mapping(address => mapping(address => UserBoostTrades))
        public userBoostTrades;

    function initialize() external initializer {
        __Ownable_init();
        admin = msg.sender;
        OPTION_ISSUER_ROLE = keccak256("OPTION_ISSUER_ROLE");
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function getUserBoostData(
        address user,
        address token
    ) external view override returns (UserBoostTrades memory) {
        return userBoostTrades[token][user];
    }

    function updateUserBoost(
        address user,
        address token
    ) external override onlyRole(OPTION_ISSUER_ROLE) {
        UserBoostTrades storage userBoostTrade = userBoostTrades[token][user];
        userBoostTrade.totalBoostTradesUsed += 1;
        emit UpdateBoostTradesUser(user, token);
    }

    function getBoostPercentage(
        address user,
        address token
    ) external view override returns (uint256) {
        UserBoostTrades memory userBoostTrade = userBoostTrades[token][user];
        if (
            userBoostTrade.totalBoostTrades >
            userBoostTrade.totalBoostTradesUsed
        ) {
            return boostPercentage;
        } else return 0;
    }

    function setBoostPercentage(uint256 boost) external onlyOwner {
        boostPercentage = boost;
        emit SetBoostPercentage(boost);
    }

    function approveViaSignature(
        address tokenX,
        address user,
        Permit memory permit
    ) internal {
        IERC20PermitUpgradeable token = IERC20PermitUpgradeable(tokenX);
        uint256 nonceBefore = token.nonces(user);
        token.permit(
            user,
            address(this),
            permit.value,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s
        );

        uint256 nonceAfter = token.nonces(user);
        if (nonceAfter != nonceBefore + 1) {
            revert("Nonce didn't match");
        }
        emit ApproveTokenX(
            user,
            nonceBefore,
            permit.value,
            permit.deadline,
            tokenX
        );
    }

    uint256[47] private __gap;
}
