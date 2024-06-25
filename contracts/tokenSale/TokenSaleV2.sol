// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "./../interfaces/ITokenSaleV2.sol";
import "./WhiteList.sol";

/**
 * @title TokenSaleV2
 */
contract TokenSaleV2 is ITokenSaleV2, ReentrancyGuardUpgradeable, PausableUpgradeable, Whitelist {
    using SafeMathUpgradeable for uint256;
    using SafeERC20Upgradeable for IERC20Upgradeable;

    // The address of the smart chef factory
    address public BEAGLE_FACTORY;

    // Max times (for sanity checks)
    uint256 public MAX_ETHORA_TIMES;

    // The LP token used
    IERC20Upgradeable public raiseToken;

    // The offering token
    IERC20Upgradeable public offeringToken;

    // Whether it is initialized
    bool public isInitialized;
        
    uint256 public publicTime;

    // The time number when Token sale starts
    uint256 public startTime;

    // The time number when Token sale ends
    uint256 public endTime;

    // Total tokens distributed across the pools
    uint256 public totalTokensOffered;

    // Array of PoolCharacteristics of size NUMBER_POOLS
    PoolCharacteristics private _poolInformation;

    // It maps the address to pool id to UserInfo
    mapping(address => UserInfo) private _userInfo;

    // Struct that contains each pool characteristics
    struct PoolCharacteristics {
        uint256 raisingAmountPool; // amount of tokens raised for the pool (in LP tokens)
        uint256 offeringAmountPool; // amount of tokens offered for the pool (in offeringTokens)
        uint256 limitPerUserInLP; // limit of tokens per user (if 0, it is ignored)
        uint256 totalAmountPool; // total amount pool deposited (in LP tokens)
    }

    // Struct that contains each user information for both pools
    struct UserInfo {
        uint256 amountPool; // How many tokens the user has provided for pool
        bool claimedPool; // Whether the user has claimed (default: false) for pool
    }

    // // vesting startTime, everyone will be started at same timestamp
    // uint256 public vestingStartTime;

    // A flag for vesting is being revoked
    bool public vestingRevoked;

    // Struct that contains vesting schedule
    struct VestingSchedule {
        bool isVestingInitialized;
        // beneficiary of tokens after they are released
        address beneficiary;
        // total amount of tokens to be released at the end of the vesting
        uint256 amountTotal;
        // amount of tokens has been released
        uint256 released;
    }

    uint256 public vestingPeriodCount;
    mapping (uint256 => VestingPeriod) private vestingPeriods;

    address[] private vestingSchedulesIds;
    mapping(address => VestingSchedule) private vestingSchedules;
    uint256 private vestingSchedulesTotalAmount;

    // Admin withdraw events
    event AdminWithdraw(uint256 amountLP, uint256 amountOfferingToken);

    // Admin recovers token
    event AdminTokenRecovery(address tokenAddress, uint256 amountTokens);

    // Deposit event
    event Deposit(address indexed user, uint256 amount);

    // Harvest event
    event Harvest(
        address indexed user,
        uint256 offeringAmount,
        uint256 excessAmount
    );

    // Create VestingSchedule event
    event CreateVestingSchedule(
        address indexed user,
        uint256 offeringAmount,
        uint256 excessAmount
    );

    // Event for new start & end times
    event NewStartAndEndTimes(uint256 startTime, uint256 endTime);

    // Event when parameters are set for one of the pools
    event PoolParametersSet(
        uint256 offeringAmountPool,
        uint256 raisingAmountPool
    );

    // Event when released new amount
    event Released(address indexed beneficiary, uint256 amount);

    // Event when revoked
    event Revoked();

    // Modifier to prevent contracts to participate
    modifier notContract() {
        require(!_isContract(msg.sender), "contract not allowed");
        require(msg.sender == tx.origin, "proxy contract not allowed");
        _;
    }

    /**
     * @notice Constructor
     */
    function initialize() external initializer {
        __Pausable_init();
        __Whitelist_init();
        BEAGLE_FACTORY = msg.sender;
    }

    /**
     * @notice It initializes the contract
     * @dev It can only be called once.
     * @param _raiseToken: the LP token used
     * @param _offeringToken: the token that is offered for the Token sale
     * @param _startTime: the start time for the Token sale
     * @param _endTime: the end time for the Token sale
     * @param _maxEthoraTimes: maximum Ethora of times from the current block timestamp
     */
    function initSale(
        address _raiseToken,
        address _offeringToken,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _maxEthoraTimes,
        uint256 _privateDuration
    ) public {
        require(!isInitialized, "Operations: Already initialized");
        require(msg.sender == BEAGLE_FACTORY, "Operations: Not factory");

        // Make this contract initialized
        isInitialized = true;

        raiseToken = IERC20Upgradeable(_raiseToken);
        offeringToken = IERC20Upgradeable(_offeringToken);
        startTime = _startTime;
        endTime = _endTime;
        publicTime = startTime + _privateDuration;
        MAX_ETHORA_TIMES = _maxEthoraTimes;

        // Transfer ownership to admin
        // transferOwnership(_adminAddress);
    }

    /**
     * @notice It allows users to deposit LP tokens to pool
     * @param _amount: the number of LP token used (18 decimals)
     */
    function depositPool(
        uint256 _amount
    ) external override whenNotPaused nonReentrant notContract {

        // Checks that pool was set
        require(
            _poolInformation.offeringAmountPool > 0 &&
                _poolInformation.raisingAmountPool > 0,
            "Deposit: Pool not set"
        );

        // Checks whether the block timestamp is not too early
        require(block.timestamp > startTime, "Deposit: Too early");

        // Checks whether the block timestamp is not too late
        require(block.timestamp < endTime, "Deposit: Too late");

        // Checks that the amount deposited is not inferior to 0
        require(_amount > 0, "Deposit: Amount must be > 0");

        // // Verify tokens were deposited properly
        // require(
        //     offeringToken.balanceOf(address(this)) >= totalTokensOffered,
        //     "Deposit: Tokens not deposited properly"
        // );

        // Must meet one of three admission requirement
        require(
            _isQualifiedWhitelist(msg.sender) ||
            block.timestamp > publicTime,
            "Deposit: Not meet any one of required conditions"
        );

        // Transfers funds to this contract
        raiseToken.safeTransferFrom(msg.sender, address(this), _amount);

        // Update the user status
        _userInfo[msg.sender].amountPool = _userInfo[msg.sender]
            .amountPool
            .add(_amount);

        // Check if the pool has a limit per user
        if (_poolInformation.limitPerUserInLP > 0) {
            // Checks whether the limit has been reached
            require(
                _userInfo[msg.sender].amountPool <=
                    _poolInformation.limitPerUserInLP,
                "Deposit: New amount above user limit"
            );
        }

        // Updates the totalAmount for pool
        _poolInformation.totalAmountPool = _poolInformation
            .totalAmountPool
            .add(_amount);

        emit Deposit(msg.sender, _amount);
    }

    /**
     * @notice It allows users to harvest from pool
     */
    function _harvestPool() internal {
        // Checks whether it is too early to harvest
        require(block.timestamp > vestingPeriods[0].vestingTime, "Harvest: Too early");

        // Checks whether the user has participated
        require(_userInfo[msg.sender].amountPool > 0, "Harvest: Did not participate");

        // Checks whether the user has already harvested
        require(!_userInfo[msg.sender].claimedPool, "Harvest: Already done");

        // Updates the harvest status
        _userInfo[msg.sender].claimedPool = true;

        // Updates the vesting startTime
        // if (vestingStartTime == 0) {
        //     vestingStartTime = block.timestamp;
        // }

        // Initialize the variables for offering, refunding user amounts
        (
            uint256 offeringTokenAmount,
            uint256 refundingTokenAmount
        ) = _calculateOfferingAndRefundingAmountsPool(msg.sender);

        // Transfer these tokens back to the user if quantity > 0
        if (offeringTokenAmount > 0) {
            _createVestingSchedule(msg.sender, offeringTokenAmount);

            emit CreateVestingSchedule(
                msg.sender,
                offeringTokenAmount,
                refundingTokenAmount
            );
            // TODO: realese
            _release(msg.sender);
        }

        if (refundingTokenAmount > 0) {
            raiseToken.safeTransfer(msg.sender, refundingTokenAmount);
        }
    }

    function harvest() external override whenNotPaused nonReentrant notContract {
        if (!_userInfo[msg.sender].claimedPool) {
            _harvestPool();
        } else {
            _release(msg.sender);
        }
        
    }

    /**
     * @notice It allows the admin to withdraw funds
     * @param _lpAmount: the number of LP token to withdraw (18 decimals)
     * @param _offerAmount: the number of offering amount to withdraw
     * @dev This function is only callable by admin.
     */
    function finalWithdraw(
        uint256 _lpAmount,
        uint256 _offerAmount
    ) external override onlyOwner {
        require(
            _lpAmount <= raiseToken.balanceOf(address(this)),
            "Operations: Not enough LP tokens"
        );
        require(
            _offerAmount <= offeringToken.balanceOf(address(this)),
            "Operations: Not enough offering tokens"
        );

        if (_lpAmount > 0) {
            raiseToken.safeTransfer(msg.sender, _lpAmount);
        }

        if (_offerAmount > 0) {
            offeringToken.safeTransfer(msg.sender, _offerAmount);
        }

        emit AdminWithdraw(_lpAmount, _offerAmount);
    }

    /**
     * @notice It allows the admin to recover wrong tokens sent to the contract
     * @param _tokenAddress: the address of the token to withdraw (18 decimals)
     * @param _tokenAmount: the number of token amount to withdraw
     * @dev This function is only callable by admin.
     */
    function recoverWrongTokens(
        address _tokenAddress,
        uint256 _tokenAmount
    ) external onlyOwner {
        require(
            _tokenAddress != address(raiseToken),
            "Recover: Cannot be LP token"
        );
        require(
            _tokenAddress != address(offeringToken),
            "Recover: Cannot be offering token"
        );

        IERC20Upgradeable(_tokenAddress).safeTransfer(msg.sender, _tokenAmount);

        emit AdminTokenRecovery(_tokenAddress, _tokenAmount);
    }

    function setPublicTime(uint256 _publicTime) external onlyOwner {
        require(_publicTime >= startTime && _publicTime < endTime, "public time must after start time");
        publicTime = _publicTime;
    }

    /**
     * @notice It sets parameters for pool
     * @param _offeringAmountPool: offering amount (in tokens)
     * @param _raisingAmountPool: raising amount (in LP tokens)
     * @param _limitPerUserInLP: limit per user (in LP tokens)
     * @param _periods: information of vesting
     * @dev This function is only callable by admin.
     */
    function setPool(
        uint256 _raisingAmountPool,
        uint256 _offeringAmountPool,
        uint256 _limitPerUserInLP,
        VestingPeriod[] calldata _periods
    ) external override onlyOwner {
        require(
            block.timestamp < startTime,
            "Operations: Token sale has started"
        );

        _poolInformation.offeringAmountPool = _offeringAmountPool;
        _poolInformation.raisingAmountPool = _raisingAmountPool;
        _poolInformation.limitPerUserInLP = _limitPerUserInLP;
        
        _setVestingPeriod(_periods);
        // Update totalTokensOffered
        totalTokensOffered = _offeringAmountPool;

        emit PoolParametersSet(_offeringAmountPool, _raisingAmountPool);
    }

    function updateVestingPeriod(VestingPeriod[] calldata periods) external onlyOwner {
        _setVestingPeriod(periods);
    }

    function _setVestingPeriod(VestingPeriod[] calldata periods) internal {
        if (periods.length != 0) {
            uint256 totalPercentage;
            uint256 tmp = endTime;
            uint256 len = periods.length;
            for (uint256 i; i < len; i++) {
                require(periods[i].vestingTime >= tmp, "vesting time must be sort");
                vestingPeriods[i] = periods[i];
                totalPercentage += periods[i].vestingPercentage;
                tmp = periods[i].vestingTime;
            }
            require(totalPercentage == 100, "total percentage must equal 100");
            vestingPeriodCount = len;
        }
    }

    /**
     * @notice It allows the admin to update start and end times
     * @param _startTime: the new start time
     * @dev This function is only callable by admin.
     */
    function updateStartTime(
        uint256 _startTime
    ) external onlyOwner {
        require(
            block.timestamp < startTime,
            "Operations: Token sale has started"
        );
        require(
           _startTime < endTime,
            "Operations: New startTime must be lower than new endTime"
        );
        require(
            block.timestamp < _startTime,
            "Operations: New startTime must be higher than current timestamp"
        );

        startTime = _startTime;

        emit NewStartAndEndTimes(_startTime, endTime);
    }

        /**
     * @notice It allows the admin to update start and end times
     * @param _endTime: the new end time
     * @dev This function is only callable by admin.
     */
    function updateEndTime(
        uint256 _endTime
    ) external onlyOwner {
        require(
            startTime < _endTime,
            "Operations: New startTime must be lower than new endTime"
        );
        require(
            block.timestamp < endTime && block.timestamp < _endTime,
            "Operations: New endTime must be higher than current timestamp"
        );

        endTime = _endTime;

        emit NewStartAndEndTimes(startTime, _endTime);
    }


    /**
     * @notice It returns the pool information
     * @return raisingAmountPool: amount of LP tokens raised (in LP tokens)
     * @return offeringAmountPool: amount of tokens offered for the pool (in offeringTokens)
     * @return limitPerUserInLP; // limit of tokens per user (if 0, it is ignored)
     * @return totalAmountPool: total amount pool deposited (in LP tokens)
     */
    function viewPoolInformation()
        external
        view
        override
        returns (uint256, uint256, uint256, uint256)
    {
        return (
            _poolInformation.raisingAmountPool,
            _poolInformation.offeringAmountPool,
            _poolInformation.limitPerUserInLP,
            _poolInformation.totalAmountPool 
        );
    }

    /**
     * @notice It returns the pool vesting information
     */
    function viewPoolVestingInformation() external view override returns (uint256[] memory, uint256[] memory) {
        uint256[] memory vestingTimes = new uint256[](vestingPeriodCount);
        uint256[] memory vestingPercentages = new uint256[](vestingPeriodCount);
        for (uint256 i; i < vestingPeriodCount; i++) {
            vestingTimes[i] = vestingPeriods[i].vestingTime;
            vestingPercentages[i] = vestingPeriods[i].vestingPercentage;
        }
        return (vestingTimes, vestingPercentages);
    }

    /**
     * @notice External view function to see user allocations for both pools
     * @param _user: user address
     * @return
     */
    function viewUserAllocationPools(
        address _user
    ) external view override returns (uint256) {
        return _getUserAllocationPool(_user);
    }

    /**
     * @notice External view function to see user information
     * @param _user: user address
     */
    function viewUserInfo(
        address _user
    ) external view override returns (uint256, uint256, bool) {
        uint256 balance = raiseToken.balanceOf(_user);
        uint256 limit = _poolInformation.limitPerUserInLP - _userInfo[_user].amountPool;
        uint256 maxAmount = balance > limit ? limit : balance;
        return (
            _userInfo[_user].amountPool, 
            maxAmount, 
            _userInfo[_user].claimedPool);
    }

    function viewStartTime(address _user) external view returns (uint256) {
        if (_isQualifiedWhitelist(_user)) {
            return startTime;
        } else {
            return publicTime;
        }
    }

    /**
     * @notice External view function to see user offering and refunding amounts for both pools
     * @param _user: user address
     */
    function viewUserOfferingAndRefundingAmountsForPools(
        address _user
    ) external view override returns (
        uint256 userOfferingAmountPool,
        uint256 userRefundingAmountPool
    ) {
        if (_poolInformation.raisingAmountPool > 0) {
            (
                userOfferingAmountPool,
                userRefundingAmountPool
            ) = _calculateOfferingAndRefundingAmountsPool(_user);
        }
    }

    /**
     * @notice Returns the vesting schedule id at the given index
     * @return The vesting schedule id
     */
    function getVestingScheduleIdAtIndex(
        uint256 _index
    ) external view returns (address) {
        require(_index < getVestingSchedulesCount(), "index out of bounds");
        return vestingSchedulesIds[_index];
    }

    /**
     * @notice Returns the vesting schedule information of a given holder and index
     * @return The vesting schedule object
     */
    function getVestingScheduleByAddressAndIndex(
        address _holder
    ) external view returns (VestingSchedule memory) {
        return
            getVestingSchedule(_holder);
    }

    /**
     * @notice Returns the total amount of vesting schedules
     * @return The vesting schedule total amount
     */
    function getVestingSchedulesTotalAmount() external view returns (uint256) {
        return vestingSchedulesTotalAmount;
    }

    /**
     * @notice Release vested amount of offering tokens
     * @param _vestingScheduleId the vesting schedule identifier
     */
    function release(address _vestingScheduleId) external whenNotPaused nonReentrant {
        _release(_vestingScheduleId);
    }

    function _release(address _vestingScheduleId) internal {
        require(
            vestingSchedules[_vestingScheduleId].isVestingInitialized == true,
            "vesting schedule is not exist"
        );

        VestingSchedule storage vestingSchedule = vestingSchedules[
            _vestingScheduleId
        ];
        bool isBeneficiary = msg.sender == vestingSchedule.beneficiary;
        bool isOwner = msg.sender == owner();
        require(
            isBeneficiary || isOwner,
            "only the beneficiary and owner can release vested tokens"
        );
        uint256 vestedAmount = _computeReleasableAmount(vestingSchedule);
        require(vestedAmount > 0 && vestingSchedulesTotalAmount <= offeringToken.balanceOf(address(this)), "no vested tokens to release");
        vestingSchedule.released = vestingSchedule.released.add(vestedAmount);
        vestingSchedulesTotalAmount = vestingSchedulesTotalAmount.sub(
            vestedAmount
        );
        offeringToken.safeTransfer(vestingSchedule.beneficiary, vestedAmount);

        emit Released(vestingSchedule.beneficiary, vestedAmount);
    }

    /**
     * @notice Revokes all the vesting schedules
     */
    function revoke() external onlyOwner {
        require(!vestingRevoked, "vesting is revoked");

        vestingRevoked = true;

        emit Revoked();
    }

    /**
     * @notice Returns the number of vesting schedules managed by the contract
     * @return The number of vesting count
     */
    function getVestingSchedulesCount() public view returns (uint256) {
        return vestingSchedulesIds.length;
    }

    /**
     * @notice Returns the vested amount of tokens for the given vesting schedule identifier
     * @return The number of vested count
     */
    function computeReleasableAmount(
        address _vestingScheduleId
    ) public view returns (uint256) {
        require(
            vestingSchedules[_vestingScheduleId].isVestingInitialized == true,
            "vesting schedule is not exist"
        );

        VestingSchedule memory vestingSchedule = vestingSchedules[
            _vestingScheduleId
        ];
        return _computeReleasableAmount(vestingSchedule);
    }

    /**
     * @notice Returns the vesting schedule information of a given identifier
     * @return The vesting schedule object
     */
    function getVestingSchedule(
        address _vestingScheduleId
    ) public view returns (VestingSchedule memory) {
        return vestingSchedules[_vestingScheduleId];
    }

    /**
     * @notice Returns the amount of offering token that can be withdrawn by the owner
     * @return The amount of offering token
     */
    function getWithdrawableOfferingTokenAmount()
        public
        view
        returns (uint256)
    {
        if (offeringToken.balanceOf(address(this)) < vestingSchedulesTotalAmount) {
            return 0;
        }
        return
            offeringToken.balanceOf(address(this)).sub(
                vestingSchedulesTotalAmount
            );
    }

    /**
     * @notice Get current Time
     */
    function getCurrentTime() internal view returns (uint256) {
        return block.timestamp;
    }

    function _releasedPercentage(uint256 currentTime) public view returns (uint256 percentage) {
        for (uint256 i; i < vestingPeriodCount; i++) {
            if (currentTime >= vestingPeriods[i].vestingTime) {
                percentage += vestingPeriods[i].vestingPercentage;
            } else {
                return percentage;
            }
        }
    }

    function claimable(address user) external view returns (uint256) {
        if (!_userInfo[user].claimedPool) {
            return _firstHarvest(user);
        } else {
            return computeReleasableAmount(user);
        }
    }

    function _firstHarvest(address user) internal view returns (uint256) {
        uint256 currentTime = getCurrentTime();
        (uint256 offeringTokenAmount, ) = _calculateOfferingAndRefundingAmountsPool(user);
        if (vestingPeriodCount == 0 || currentTime < vestingPeriods[0].vestingTime) {
            return 0;
        } else if (
            currentTime >= vestingPeriods[vestingPeriodCount - 1].vestingTime || vestingRevoked
        ) {
            return offeringTokenAmount;
        } else {
            uint256 percentage = _releasedPercentage(currentTime);

            uint256 vestedAmount;
            if (percentage > 0) {
                vestedAmount = offeringTokenAmount
                    .mul(percentage)
                    .div(100);
            }
            return vestedAmount;
        }
    }

    /**
     * @notice Computes the releasable amount of tokens for a vesting schedule
     * @return The amount of releasable tokens
     */
    function _computeReleasableAmount(
        VestingSchedule memory _vestingSchedule
    ) internal view returns (uint256) {
        uint256 currentTime = getCurrentTime();
        if (vestingPeriodCount == 0 || currentTime < vestingPeriods[0].vestingTime) {
            return 0;
        } else if (
            currentTime >= vestingPeriods[vestingPeriodCount - 1].vestingTime || vestingRevoked
        ) {
            return _vestingSchedule.amountTotal.sub(_vestingSchedule.released);
        } else {
            uint256 percentage = _releasedPercentage(currentTime);

            uint256 vestedAmount;
            if (percentage > 0) {
                vestedAmount = _vestingSchedule
                    .amountTotal
                    .mul(percentage)
                    .div(100);
            }
            vestedAmount = vestedAmount.sub(_vestingSchedule.released);
            return vestedAmount;
        }
    }

    /**
     * @notice Creates a new vesting schedule for a beneficiary
     * @param _beneficiary address of the beneficiary to whom vested tokens are transferred
     * @param _amount total amount of tokens to be released at the end of the vesting
     */
    function _createVestingSchedule(
        address _beneficiary,
        uint256 _amount
    ) internal {
        // require(
        //     getWithdrawableOfferingTokenAmount() >= _amount,
        //     "can not create vesting schedule with sufficient tokens"
        // );

        address vestingScheduleId = _beneficiary;
        require(
            vestingSchedules[vestingScheduleId].beneficiary == address(0),
            "vestingScheduleId is been created"
        );
        vestingSchedules[vestingScheduleId] = VestingSchedule(
            true,
            _beneficiary,
            _amount,
            0
        );
        vestingSchedulesTotalAmount = vestingSchedulesTotalAmount.add(_amount);
        vestingSchedulesIds.push(vestingScheduleId);
    }

    /**
     * @notice It calculates the offering amount for a user and the number of LP tokens to transfer back.
     * @param _user: user address
     * @return {uint256, uint256} It returns the offering amount, the refunding amount (in LP tokens),
     *
     **/
    function _calculateOfferingAndRefundingAmountsPool(
        address _user
    ) internal view returns (uint256, uint256) {
        uint256 userOfferingAmount;
        uint256 userRefundingAmount;

        if (
            _poolInformation.totalAmountPool >
            _poolInformation.raisingAmountPool
        ) {
            // Calculate allocation for the user
            uint256 allocation = _getUserAllocationPool(_user);

            // Calculate the offering amount for the user based on the offeringAmount for the pool
            userOfferingAmount = _poolInformation
                .offeringAmountPool
                .mul(allocation)
                .div(1e12);

            // Calculate the payAmount
            uint256 payAmount = _poolInformation
                .raisingAmountPool
                .mul(allocation)
                .div(1e12);

            // Calculate the refunding amount
            userRefundingAmount = _userInfo[_user].amountPool.sub(
                payAmount
            );
        } else {
            userRefundingAmount = 0;
            // _userInfo[_user] / (raisingAmount / offeringAmount)
            userOfferingAmount = _userInfo[_user]
                .amountPool
                .mul(_poolInformation.offeringAmountPool)
                .div(_poolInformation.raisingAmountPool);
        }
        return (userOfferingAmount, userRefundingAmount);
    }

    /**
     * @notice It returns the user allocation for pool
     * @dev 100,000,000,000 means 0.1 (10%) / 1 means 0.0000000000001 (0.0000001%) / 1,000,000,000,000 means 1 (100%)
     * @param _user: user address
     * @return It returns the user's share of pool
     */
    function _getUserAllocationPool(
        address _user
    ) internal view returns (uint256) {
        if (_poolInformation.totalAmountPool > 0) {
            return
                _userInfo[_user].amountPool.mul(1e18).div(
                    _poolInformation.totalAmountPool.mul(1e6)
                );
        } else {
            return 0;
        }
    }

    /**
     * @notice Check if an address is a contract
     */
    function _isContract(address _addr) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(_addr)
        }
        return size > 0;
    }

    function isQualifiedWhitelist(address _user) external view returns (bool) {
        return isWhitelisted(_user);
    }

    function _isQualifiedWhitelist(address _user) internal view returns (bool) {
        return isWhitelisted(_user);
    }

    function setToken(
        address raiseToken_,
        address offeringToken_
    ) external onlyOwner {
        raiseToken = IERC20Upgradeable(raiseToken_);
        offeringToken = IERC20Upgradeable(offeringToken_);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    uint256[47] private __gap;
}
