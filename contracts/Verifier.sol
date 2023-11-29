// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.4;

import "./library/Validator.sol";

contract Verifier {
    // validator
    function verifyUserTradeParams(
        IEthoraRouter.TradeParams memory params,
        address user,
        address signer
    ) external view returns (bool) {
        return Validator.verifyUserTradeParams(params, user, signer);
    }

    function verifyPublisher(
        string memory assetPair,
        uint256 timestamp,
        uint256 price,
        bytes memory signature,
        address signer
    ) external view returns (bool) {
        return Validator.verifyPublisher(assetPair, timestamp, price, signature, signer);
    }

    function verifyCloseAnytime(
        string memory assetPair,
        uint256 timestamp,
        uint256 optionId,
        bytes memory signature,
        address signer
    ) external view returns (bool) {
        return Validator.verifyCloseAnytime(assetPair, timestamp, optionId, signature, signer);
    }

    function verifySettlementFee(
        string memory assetPair,
        uint256 settlementFee,
        uint256 expiryTimestamp,
        bytes memory signature,
        address signer
    ) external view returns (bool) {
        return Validator.verifySettlementFee(assetPair, settlementFee, expiryTimestamp, signature, signer);
    }

    function verifyMarketDirection(
        IEthoraRouter.CloseTradeParams memory params,
        IEthoraRouter.QueuedTrade memory queuedTrade,
        address signer
    ) external view returns (bool) {
        return Validator.verifyMarketDirection(params, queuedTrade, signer);
    }

    function verifyUserRegistration(
        address oneCT,
        address user,
        uint256 nonce,
        bytes memory signature
    ) external view returns (bool) {
        return Validator.verifyUserRegistration(oneCT, user, nonce, signature);
    }

    function verifyUserDeregistration(
        address user,
        uint256 nonce,
        bytes memory signature
    ) external view returns (bool) {
        return Validator.verifyUserDeregistration(user, nonce, signature);
    }
    
    function domainSperator() internal view returns (bytes32) {
        return Validator.domainSperator();
    }

    function _validate(
        bytes32 hashData,
        bytes memory expectedSignature,
        address expectedSigner
    ) external view returns (bool) {
        return Validator._validate(hashData, expectedSignature, expectedSigner);
    }

    function getUserTradeHash(
        IEthoraRouter.TradeParams memory params,
        address user,
        IEthoraRouter.SignInfo memory signInfo
    ) external view returns (bytes32) {
        return Validator.getUserTradeHash(params, user, signInfo);
    }

    function getUserTradeHashWithSF(
        IEthoraRouter.TradeParams memory params,
        address user,
        IEthoraRouter.SignInfo memory signInfo
    ) external view returns (bytes32) {
        return Validator.getUserTradeHashWithSF(params, user, signInfo);
    }

    function getMarketDirectionHashWithSF(
        IEthoraRouter.CloseTradeParams memory params,
        IEthoraRouter.QueuedTrade memory queuedTrade,
        IEthoraRouter.SignInfo memory signInfo
    ) external view returns (bytes32) {
        return Validator.getMarketDirectionHashWithSF(params, queuedTrade, signInfo);
    }

    function getMarketDirectionHash(
        IEthoraRouter.CloseTradeParams memory params,
        IEthoraRouter.QueuedTrade memory queuedTrade,
        IEthoraRouter.SignInfo memory signInfo
    ) external view returns (bytes32) {
        return Validator.getMarketDirectionHash(params, queuedTrade, signInfo);
    }
}