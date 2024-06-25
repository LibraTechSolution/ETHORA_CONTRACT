// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/** @title ITokenSale.
 * @notice It is an interface for TokenSale.sol
 */
interface ITokenSaleV2 {
    struct VestingPeriod {
        uint256 vestingTime;
        uint256 vestingPercentage; // 60 means 0.6
    }
    function depositPool(uint256 _amount) external;

    function harvest() external;

    function finalWithdraw(uint256 _lpAmount, uint256 _offerAmount) external;

    function setPool(
        uint256 _offeringAmountPool,
        uint256 _raisingAmountPool,
        uint256 _limitPerUserInLP,
        VestingPeriod[] calldata _periods
    ) external;

    function viewPoolInformation()
        external
        view
        returns (uint256, uint256, uint256, uint256);

    function viewPoolVestingInformation() external view returns (uint256[] memory, uint256[] memory);

    function viewUserAllocationPools(
        address _user
    ) external view returns (uint256);

    function viewUserInfo(
        address _user
    ) external view returns (uint256, uint256, bool);

    function viewUserOfferingAndRefundingAmountsForPools(
        address _user
    ) external view returns (
        uint256 userOfferingAmountPool,
        uint256 userRefundingAmountPool
    );
}
