// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "./interfaces/interfaces.sol";

/**
 * @title Referral Storage
 * @notice Contains referral Logic for option buying
 */
contract ReferralStorage is IReferralStorage, Ownable2Step {
    IEthoraRouter public router;
    mapping(address => uint8) public override referrerTier; // link between user <> tier
    mapping(uint8 => uint8) public override referrerTierStep;
    mapping(uint8 => uint32) public override referrerTierDiscount;
    mapping(string => address) public override codeOwner;
    mapping(address => string) public userCode;
    mapping(address => string) public override traderReferralCodes;
    mapping(address => uint256) public operators;

    constructor(address router_) {
        router = IEthoraRouter(router_);
    }

    function setRouter(address router_) external onlyOwner {
        router = IEthoraRouter(router_);
    }

    /**
     * @notice Sets the config for step reduction and discount on the basis of tier
     */
    function configure(
        uint8[3] calldata _referrerTierStep,
        uint32[3] calldata _referrerTierDiscount // Factor of 1e5
    ) external onlyOwner {
        for (uint8 i; i < 3; i++) {
            referrerTierStep[i] = _referrerTierStep[i];
        }

        for (uint8 i; i < 3; i++) {
            referrerTierDiscount[i] = _referrerTierDiscount[i];
        }
    }

    /************************************************
     *  ADMIN ONLY FUNCTIONS
     ***********************************************/

    function setOperator(address operator, uint256 state) external onlyOwner {
        operators[operator] = state;
    }

    /**
     * @notice Sets referrer's tier
     */
    function setReferrerTier(address _referrer, uint8 tier) external override {
        require(tier < 3);
        require(operators[msg.sender] != 0, "ReferralStorage: not operator");
        referrerTier[_referrer] = tier;
        emit UpdateReferrerTier(_referrer, tier);
    }

    /**
     * @notice Sets referral code for trader
     */
    function setTraderReferralCode(
        address user,
        string memory _code
    ) external override {
        require(operators[msg.sender] != 0, "ReferralStorage: not operator");
        _setTraderReferralCode(user, _code);
    }

    /************************************************
     *  EXTERNAL FUNCTIONS
     ***********************************************/

    /**
     * @notice Sets referral code for trader
     */
    function setTraderReferralCodeByUser(string memory _code) external {
        _setTraderReferralCode(msg.sender, _code);
    }

    /**
     * @notice Creates a referral code for the user to share
     */
    function registerCode(string memory _code) external {
        require(bytes(_code).length != 0, "ReferralStorage: invalid _code");
        require(
            codeOwner[_code] == address(0),
            "ReferralStorage: code already exists"
        );
        require(
            bytes(userCode[msg.sender]).length == 0,
            "ReferralStorage: created code"
        );

        codeOwner[_code] = msg.sender;
        userCode[msg.sender] = _code;
        emit RegisterCode(msg.sender, _code);
    }

    /**
     * @notice Returns the referrer associated with a trader
     */
    function getTraderReferralInfo(
        address user
    ) external view override returns (string memory code, address referrer) {
        code = traderReferralCodes[user];
        if (bytes(code).length != 0) {
            referrer = codeOwner[code];
        }
    }

    /************************************************
     *  PRIVATE FUNCTIONS
     ***********************************************/

    function _setTraderReferralCode(address user, string memory _code) private {
        require(router.tradeds(user) == 0, "ReferralStorage: traded");
        require(
            codeOwner[_code] != address(0),
            "ReferralStorage: code not exist"
        );
        traderReferralCodes[user] = _code;
        emit UpdateTraderReferralCode(user, _code);
    }
}
