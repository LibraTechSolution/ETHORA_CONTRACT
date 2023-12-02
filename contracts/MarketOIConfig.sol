// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.4;

import "./interfaces/interfaces.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MarketOIConfig is Ownable {
    uint256 public _maxMarketOI;
    uint256 public _maxTradeSize;
    IEthoraBinaryOptions public _marketContract;

    constructor(
        uint256 maxMarketOI,
        uint256 maxTradeSize,
        address marketContract
    ) {
        _maxMarketOI = maxMarketOI;
        _maxTradeSize = maxTradeSize;
        _marketContract = IEthoraBinaryOptions(marketContract);
    }

    function setMaxMarketOI(uint256 maxMarketOI) external onlyOwner {
        _maxMarketOI = maxMarketOI;
    }

    function setMaxTradeSize(uint256 maxTradeSize) external onlyOwner {
        _maxTradeSize = maxTradeSize;
    }

    function getMaxMarketOI(
        uint256 currentMarketOI
    ) external view returns (uint256) {
        uint256 remainingOI = _maxMarketOI - currentMarketOI;
        return remainingOI < _maxTradeSize ? remainingOI : _maxTradeSize;
    }

    function getMarketOICap() external view returns (uint256) {
        return _maxMarketOI;
    }
}
