// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.4;

import "./interfaces/interfaces.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

/**
 * @title Ethora TokenX Liquidity Pool
 * @notice Accumulates liquidity in TokenX from LPs and distributes P&L in TokenX
 */
contract EthoraBinaryPool is
    ERC20Upgradeable,
    AccessControlUpgradeable,
    ILiquidityPool
{
    using SafeERC20Upgradeable for ERC20Upgradeable;
    ERC20Upgradeable public tokenX;
    uint32 public INITIAL_RATE;
    uint32 public lockupPeriod;
    uint256 public lockedAmount;
    uint256 public lockedPremium;
    uint256 public maxLiquidity;
    address public owner;
    bytes32 private OPTION_ISSUER_ROLE;

    mapping(address => LockedLiquidity[]) public lockedLiquidity;
    mapping(address => uint256) public isHandler;
    mapping(address => ProvidedLiquidity) public liquidityPerUser;

    function initialize(
        address _tokenX,
        uint32 _lockupPeriod
    ) external initializer {
        __ERC20_init("Ethora LP Token", "ELP");
        INITIAL_RATE = 1;
        OPTION_ISSUER_ROLE = keccak256("OPTION_ISSUER_ROLE");
        tokenX = ERC20Upgradeable(_tokenX);
        owner = msg.sender;
        maxLiquidity = 5000000 * 10 ** tokenX.decimals();
        lockupPeriod = _lockupPeriod;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /************************************************
     *  ADMIN ONLY FUNCTIONS
     ***********************************************/

    /**
     * @notice Used for adding or removing handlers
     */
    function setHandler(
        address _handler,
        uint256 _isActive
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        isHandler[_handler] = _isActive;
    }

    function setTokenX(address token_) external payable onlyRole(DEFAULT_ADMIN_ROLE) {
        tokenX = ERC20Upgradeable(token_);
    }

    function setLockupPeriod(
        uint32 period_
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        lockupPeriod = period_;
    }

    /**
     * @notice Used for adjusting the max limit of the pool
     */
    function setMaxLiquidity(
        uint256 _maxLiquidity
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            _maxLiquidity > totalTokenXBalance(),
            "Invalid new maxLiquidity"
        );
        maxLiquidity = _maxLiquidity;
        emit UpdateMaxLiquidity(_maxLiquidity);
    }

    /************************************************
     *  EXTERNAL/PUBLIC FUNCTIONS
     ***********************************************/

    /**
     * @notice ERC20 transferFrom. Overridden to allow handler to transfer without approval
     */
    function transferFrom(
        address _sender,
        address _recipient,
        uint256 _amount
    ) public virtual override returns (bool) {
        if (isHandler[msg.sender] != 0) {
            _transfer(_sender, _recipient, _amount);
            return true;
        }

        uint256 currentAllowance = allowance(_sender, msg.sender);
        if (currentAllowance != type(uint256).max) {
            require(
                currentAllowance >= _amount,
                "Pool: exceeds allowance"
            );
            unchecked {
                _approve(_sender, msg.sender, currentAllowance - _amount);
            }
        }
        _transfer(_sender, _recipient, _amount);
        return true;
    }

    /**
     * @notice A provider supplies tokenX to the pool and receives ELP tokens
     * @param minMint Minimum amount of tokens that should be received by a provider.
                      Calling the provide function will require the minimum amount of tokens to be minted.
                      The actual amount that will be minted could vary but can only be higher (not lower) than the minimum value.
     */
    function provide(
        uint256 tokenXAmount,
        uint256 minMint
    ) external returns (uint256 mint) {
        mint = _provide(tokenXAmount, minMint, msg.sender);
    }

    /**
     * @notice Called by handler to add liquidity for an account
     */
    function provideForAccount(
        uint256 tokenXAmount,
        uint256 minMint,
        address account
    ) external returns (uint256 mint) {
        _validateHandler();
        mint = _provide(tokenXAmount, minMint, account);
    }

    /**
     * @notice Burns ELP and receives X from the pool
     */
    function withdraw(uint256 tokenXAmount) external {
        _withdraw(tokenXAmount, msg.sender);
    }

    /**
     * @notice Called by the Handler to burns ELP and receives X for a user
     */
    function withdrawForAccount(
        uint256 tokenXAmount,
        address account
    ) external returns (uint256 burn) {
        _validateHandler();
        burn = _withdraw(tokenXAmount, account);
    }

    /************************************************
     *  OPTION ONLY FUNCTIONS
     ***********************************************/

    /**
     * @notice Called by EthoraBinaryOptions to lock the funds
     * @param id optionId
     * @param tokenXAmount Amount of funds that should be locked in an option
     * @param premium Premium paid to liquidity pool to lock the above funds
     */
    function lock(
        uint256 id,
        uint256 tokenXAmount,
        uint256 premium
    ) external override onlyRole(OPTION_ISSUER_ROLE) {
        require(id == lockedLiquidity[msg.sender].length, "Pool: Wrong id");

        require(
            (lockedAmount + tokenXAmount) <= totalTokenXBalance(),
            "Pool: Amount is too large."
        );
        tokenX.safeTransferFrom(msg.sender, address(this), premium);

        lockedLiquidity[msg.sender].push(
            LockedLiquidity(tokenXAmount, premium, true)
        );
        lockedPremium = lockedPremium + premium;
        lockedAmount = lockedAmount + tokenXAmount;
    }

    /**
     * @notice Called by EthoraOptions to unlock the funds
     * @param id Id of LockedLiquidity that should be unlocked
     */
    function unlock(uint256 id) external payable override onlyRole(OPTION_ISSUER_ROLE) {
        uint256 premium = _unlock(id);

        emit Profit(id, premium);
    }

    /**
     * @notice Called by EthoraBinaryOptions to send funds to liquidity providers after an option's expiration
     * @param id Id of LockedLiquidity
     * @param to Provider
     * @param tokenXAmount Funds that should be sent
     */
    function send(
        uint256 id,
        address to,
        uint256 tokenXAmount
    ) external override onlyRole(OPTION_ISSUER_ROLE) {
        LockedLiquidity storage ll = lockedLiquidity[msg.sender][id];
        require(ll.locked, "Pool: already unlocked");
        require(to != address(0), "Pool: zero address");

        uint256 transferTokenXAmount = tokenXAmount > ll.amount
            ? ll.amount
            : tokenXAmount;

        ll.locked = false;
        lockedPremium = lockedPremium - ll.premium;
        lockedAmount = lockedAmount - transferTokenXAmount;
        tokenX.safeTransfer(to, transferTokenXAmount);

        if (transferTokenXAmount <= ll.premium)
            emit Profit(id, ll.premium - transferTokenXAmount);
        else emit Loss(id, transferTokenXAmount - ll.premium);
    }

    /************************************************
     *  INTERNAL FUNCTIONS
     ***********************************************/

    function _provide(
        uint256 tokenXAmount,
        uint256 minMint,
        address account
    ) internal returns (uint256 mint) {
        uint256 supply = totalSupply();
        uint256 balance = totalTokenXBalance();

        require(
            balance + tokenXAmount <= maxLiquidity,
            "reached max limit"
        );

        if (supply != 0 && balance != 0)
            mint = (tokenXAmount * supply) / (balance);
        else mint = tokenXAmount * INITIAL_RATE;

        require(mint >= minMint, "Pool: Mint limit is too large");
        require(mint != 0, "Pool: Amount is too small");

        tokenX.safeTransferFrom(account, address(this), tokenXAmount);

        _mint(account, mint);

        LockedAmount memory amountLocked = LockedAmount(block.timestamp, mint);
        liquidityPerUser[account].lockedAmounts.push(amountLocked);
        _updateLiquidity(account);

        emit Provide(account, tokenXAmount, mint);
    }

    function _updateLiquidity(address account) internal {
        (
            uint256 unlockedAmount,
            uint256 nextIndexForUnlock
        ) = _getUnlockedLiquidity(account);

        liquidityPerUser[account].unlockedAmount = unlockedAmount;
        liquidityPerUser[account].nextIndexForUnlock = nextIndexForUnlock;
    }

    function _getUnlockedLiquidity(
        address account
    )
        internal
        view
        returns (uint256 unlockedAmount, uint256 nextIndexForUnlock)
    {
        uint256 len = liquidityPerUser[account].lockedAmounts.length;
        unlockedAmount = liquidityPerUser[account].unlockedAmount;
        uint256 index = liquidityPerUser[account].nextIndexForUnlock;
        nextIndexForUnlock = index;
        uint256 maxIndex = index + 1000 < len ? index + 1000 : len;
        for (uint256 n = index; n < maxIndex; n++) {
            if (
                liquidityPerUser[account].lockedAmounts[n].timestamp +
                    lockupPeriod <=
                block.timestamp
            ) {
                unlockedAmount += liquidityPerUser[account]
                    .lockedAmounts[n]
                    .amount;
                nextIndexForUnlock = n + 1;
            } else {
                break;
            }
        }
    }

    function _validateHandler() private view {
        require(isHandler[msg.sender] != 0, "Pool: forbidden");
    }

    function _withdraw(
        uint256 tokenXAmount,
        address account
    ) internal returns (uint256 burn) {
        require(
            tokenXAmount <= availableBalance(),
            "Pool: Not enough funds"
        );
        uint256 totalSupply = totalSupply();
        uint256 balance = totalTokenXBalance();

        uint256 maxUserTokenXWithdrawal = (balanceOf(account) * balance) /
            totalSupply;

        uint256 tokenXAmountToWithdraw = maxUserTokenXWithdrawal < tokenXAmount
            ? maxUserTokenXWithdrawal
            : tokenXAmount;

        burn = divCeil((tokenXAmountToWithdraw * totalSupply), balance);

        _updateLiquidity(account);

        require(
            liquidityPerUser[account].unlockedAmount >= burn,
            "Pool: exceed unlocked amount"
        );
        require(burn <= balanceOf(account), "Pool: Amount is too large");
        require(burn != 0, "Pool: Amount is too small");

        _burn(account, burn);

        tokenX.safeTransfer(account, tokenXAmountToWithdraw);

        emit Withdraw(account, tokenXAmountToWithdraw, burn);
    }

    function _unlock(uint256 id) internal returns (uint256 premium) {
        LockedLiquidity storage ll = lockedLiquidity[msg.sender][id];
        require(ll.locked, "Pool: already unlocked");
        ll.locked = false;

        lockedPremium = lockedPremium - ll.premium;
        lockedAmount = lockedAmount - ll.amount;
        premium = ll.premium;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 value
    ) internal override {
        if (isHandler[from] == 0 && isHandler[to] == 0 && from != address(0)) {
            _updateLiquidity(from);
            require(
                liquidityPerUser[from].unlockedAmount >= value,
                "Pool: in period is blocked"
            );
            liquidityPerUser[from].unlockedAmount -= value;
            if (to != address(0)) {
                liquidityPerUser[to].unlockedAmount += value;
            }
        }
    }

    /************************************************
     *  READ ONLY FUNCTIONS
     ***********************************************/

    /**
     * @dev Returns the decimals of the token.
     */
    function decimals() public view virtual override returns (uint8) {
        return tokenX.decimals();
    }

    /**
     * @dev Converts ELP to tokenX.
     */
    function toTokenX(uint256 amount) public view returns (uint256) {
        uint256 totalSupply = totalSupply();
        uint256 balance = totalTokenXBalance();
        if (totalSupply != 0) {
            return (amount * balance) / totalSupply;
        }
        return 0;
    }

    /**
     * @dev Returns available liquidity
     */
    function getUnlockedLiquidity(
        address account
    ) external view returns (uint256 unlockedAmount) {
        (unlockedAmount, ) = _getUnlockedLiquidity(account);
    }

    /**
     * @notice Returns provider's share in X
     */
    function shareOf(address account) external view returns (uint256 share) {
        if (totalSupply() > 0)
            share = (totalTokenXBalance() * balanceOf(account)) / totalSupply();
        else share = 0;
    }

    /**
     * @notice Returns the amount of X available for withdrawals
     */
    function availableBalance() public view override returns (uint256 balance) {
        return totalTokenXBalance() - lockedAmount;
    }

    /**
     * @notice Returns the total balance of X provided to the pool
     */
    function totalTokenXBalance()
        public
        view
        override
        returns (uint256 balance)
    {
        return tokenX.balanceOf(address(this)) - lockedPremium;
    }

    function divCeil(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "Pool: undefined");
        uint256 c = a / b;
        if (a % b != 0) c = c + 1;
        return c;
    }

    uint256[47] private __gap;
}
