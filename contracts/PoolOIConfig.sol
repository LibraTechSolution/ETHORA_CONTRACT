// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.4;

import "./interfaces/interfaces.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

contract PoolOIConfig is Ownable2Step {
    uint256 public _maxPoolOI;
    IPoolOIStorage public _poolOIStorage;

    constructor(uint256 maxPoolOI, address poolOIStorage) {
        _maxPoolOI = maxPoolOI;
        _poolOIStorage = IPoolOIStorage(poolOIStorage);
    }

    function setMaxPoolOI(uint256 maxPoolOI) external onlyOwner {
        _maxPoolOI = maxPoolOI;
    }

    function getMaxPoolOI() external view returns (uint256) {
        uint256 currentPoolOI = _poolOIStorage.totalPoolOI();
        if (currentPoolOI >= _maxPoolOI) {
            return 0;
        } else {
            return _maxPoolOI - currentPoolOI;
        }
    }

    function getPoolOICap() external view returns (uint256) {
        return _maxPoolOI;
    }
}