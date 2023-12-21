pragma solidity ^0.8.4;

// SPDX-License-Identifier: BUSL-1.1

import "./EthoraBinaryPool.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

/**
 * @author Heisenberg
 * @title Ethora Options Config
 * @notice Maintains all the configurations for the options contracts
 */
contract OptionsConfig is Ownable2Step, IOptionsConfig {
    EthoraBinaryPool public pool;
 
    address public override settlementFeeDisbursalContract;
    address public override creationWindowContract;
    address public override poolOIStorageContract;
    address public override poolOIConfigContract;
    address public override marketOIConfigContract;
    uint32 public override maxPeriod = 24 hours;
    uint32 public override minPeriod = 3 minutes;
    uint32 public override earlyCloseThreshold = 1 minutes;

    uint256 public override minFee = 1e6;
    uint256 public override iv;
    uint256 public override platformFee = 1e5;
    bool public override isEarlyCloseAllowed; 

    constructor(address _pool) {
        pool = EthoraBinaryPool(_pool);
    }

    function setPool(address _pool) external onlyOwner {
        pool = EthoraBinaryPool(_pool);
    }

    function setCreationWindowContract(
        address _creationWindowContract
    ) external onlyOwner {
        creationWindowContract = _creationWindowContract;
        emit UpdateCreationWindowContract(_creationWindowContract);
    }

    function setMinFee(uint256 _minFee) external onlyOwner {
        minFee = _minFee;
        emit UpdateMinFee(_minFee);
    }

    function setIV(uint256 _iv) external onlyOwner {
        iv = _iv;
        emit UpdateIV(_iv);
    }

    function setPlatformFee(uint256 _platformFee) external onlyOwner {
        platformFee = _platformFee;
        emit UpdatePlatformFee(_platformFee);
    }

    function setSettlementFeeDisbursalContract(
        address _settlementFeeDisbursalContract
    ) external onlyOwner {
        settlementFeeDisbursalContract = _settlementFeeDisbursalContract;
        emit UpdateSettlementFeeDisbursalContract(
            _settlementFeeDisbursalContract
        );
    }

    function setMaxPeriod(uint32 _maxPeriod) external onlyOwner {
        require(
            _maxPeriod <= 1 days,
            "MaxPeriod should be less than or equal to 1 day"
        );
        require(
            _maxPeriod >= minPeriod,
            "MaxPeriod needs to be greater than or equal the min period"
        );
        maxPeriod = _maxPeriod;
        emit UpdateMaxPeriod(_maxPeriod);
    }

    function setMinPeriod(uint32 _minPeriod) external onlyOwner {
        require(
            _minPeriod >= 1 minutes,
            "MinPeriod needs to be greater than 1 minute"
        );
        minPeriod = _minPeriod;
        emit UpdateMinPeriod(_minPeriod);
    }

    function setPoolOIStorageContract(
        address _poolOIStorageContract
    ) external onlyOwner {
        poolOIStorageContract = _poolOIStorageContract;
        emit UpdatePoolOIStorageContract(_poolOIStorageContract);
    }

    function setPoolOIConfigContract(
        address _poolOIConfigContract
    ) external onlyOwner {
        poolOIConfigContract = _poolOIConfigContract;
        emit UpdatePoolOIConfigContract(_poolOIConfigContract);
    }

    function setMarketOIConfigContract(
        address _marketOIConfigContract
    ) external onlyOwner {
        marketOIConfigContract = _marketOIConfigContract;
        emit UpdateMarketOIConfigContract(_marketOIConfigContract);
    }

    function setEarlyCloseThreshold(
        uint32 _earlyCloseThreshold
    ) external onlyOwner {
        earlyCloseThreshold = _earlyCloseThreshold;
        emit UpdateEarlyCloseThreshold(_earlyCloseThreshold);
    }

    function toggleEarlyClose() external onlyOwner {
        isEarlyCloseAllowed = !isEarlyCloseAllowed;
        emit UpdateEarlyClose(isEarlyCloseAllowed);
    }
}
