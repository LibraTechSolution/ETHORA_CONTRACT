// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";

import "./../interfaces/IRewardTracker.sol";
import "./../interfaces/IVester.sol";
import "./../interfaces/IMintable.sol";
import "./../interfaces/IElpManager.sol";

contract RewardRouter is ReentrancyGuardUpgradeable {
    using SafeMathUpgradeable for uint256;
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using AddressUpgradeable for address payable;

    address public gov;

    address public usdc;

    address public etr;
    address public esEtr;
    address public bnEtr;

    address public elp; // ETR Liquidity Provider token

    address public stakedEtrTracker;
    address public bonusEtrTracker;
    address public feeEtrTracker;

    address public stakedElpTracker;
    address public feeElpTracker;

    address public elpManager;

    address public etrVester;
    address public elpVester;

    mapping(address => address) public pendingReceivers;

    event StakeEtr(address account, address token, uint256 amount);
    event UnstakeEtr(address account, address token, uint256 amount);

    event StakeElp(address account, uint256 amount);
    event UnstakeElp(address account, uint256 amount);

    receive() external payable {
        revert("Router: Can't receive eth");
    }

    modifier onlyGov() {
        require(msg.sender == gov, "Governable: forbidden");
        _;
    }

    function setGov(address _gov) external onlyGov {
        gov = _gov;
    }

    function initialize(
        address _usdc,
        address _etr,
        address _esEtr,
        address _bnEtr,
        address _elp,
        address _stakedEtrTracker,
        address _bonusEtrTracker,
        address _feeEtrTracker,
        address _feeElpTracker,
        address _stakedElpTracker,
        address _etrVester,
        address _elpVester
    ) external initializer {
        gov = msg.sender;

        usdc = _usdc;

        etr = _etr;
        esEtr = _esEtr;
        bnEtr = _bnEtr;

        elp = _elp;

        stakedEtrTracker = _stakedEtrTracker;
        bonusEtrTracker = _bonusEtrTracker;
        feeEtrTracker = _feeEtrTracker;

        feeElpTracker = _feeElpTracker;
        stakedElpTracker = _stakedElpTracker;

        elpManager = _elp;

        etrVester = _etrVester;
        elpVester = _elpVester;
    }

    // to help users who accidentally send their tokens to this contract
    function withdrawToken(
        address _token,
        address _account,
        uint256 _amount
    ) external onlyGov {
        IERC20Upgradeable(_token).safeTransfer(_account, _amount);
    }

    function batchStakeEtrForAccount(
        address[] memory _accounts,
        uint256[] memory _amounts
    ) external nonReentrant onlyGov {
        address _etr = etr;
        for (uint256 i = 0; i < _accounts.length; i++) {
            _stakeEtr(msg.sender, _accounts[i], _etr, _amounts[i]);
        }
    }

    function stakeEtrForAccount(
        address _account,
        uint256 _amount
    ) external nonReentrant onlyGov {
        _stakeEtr(msg.sender, _account, etr, _amount);
    }

    function stakeEtr(uint256 _amount) external nonReentrant {
        _stakeEtr(msg.sender, msg.sender, etr, _amount);
    }

    function stakeEsEtr(uint256 _amount) external nonReentrant {
        _stakeEtr(msg.sender, msg.sender, esEtr, _amount);
    }

    function unstakeEtr(uint256 _amount) external nonReentrant {
        _unstakeEtr(msg.sender, etr, _amount, true);
    }

    function unstakeEsEtr(uint256 _amount) external nonReentrant {
        _unstakeEtr(msg.sender, esEtr, _amount, true);
    }

    function mintAndStakeElp(
        uint256 _amount,
        uint256 _minElp
    ) external nonReentrant returns (uint256) {
        require(_amount > 0, "RewardRouter: invalid _amount");

        address account = msg.sender;
        uint256 elpAmount = IElpManager(elpManager).provideForAccount(
            _amount,
            _minElp,
            account
        );
        IRewardTracker(feeElpTracker).stakeForAccount(
            account,
            account,
            elp,
            elpAmount
        );
        IRewardTracker(stakedElpTracker).stakeForAccount(
            account,
            account,
            feeElpTracker,
            elpAmount
        );

        emit StakeElp(account, elpAmount);

        return elpAmount;
    }

    function unstakeAndRedeemElp(
        uint256 _elpAmount
    ) external nonReentrant returns (uint256) {
        require(_elpAmount > 0, "RewardRouter: invalid _elpAmount");

        address account = msg.sender;
        IRewardTracker(stakedElpTracker).unstakeForAccount(
            account,
            feeElpTracker,
            _elpAmount,
            account
        );
        IRewardTracker(feeElpTracker).unstakeForAccount(
            account,
            elp,
            _elpAmount,
            account
        );
        uint256 amountOut = IElpManager(elpManager).withdrawForAccount(
            IElpManager(elpManager).toTokenX(_elpAmount),
            account
        );

        emit UnstakeElp(account, _elpAmount);

        return amountOut;
    }

    function claim() external nonReentrant {
        address account = msg.sender;

        IRewardTracker(feeEtrTracker).claimForAccount(account, account);
        IRewardTracker(feeElpTracker).claimForAccount(account, account);

        IRewardTracker(stakedEtrTracker).claimForAccount(account, account);
        IRewardTracker(stakedElpTracker).claimForAccount(account, account);
    }

    function claimEsEtr() external nonReentrant {
        address account = msg.sender;

        IRewardTracker(stakedEtrTracker).claimForAccount(account, account);
        IRewardTracker(stakedElpTracker).claimForAccount(account, account);
    }

    function claimFees() external nonReentrant {
        address account = msg.sender;

        IRewardTracker(feeEtrTracker).claimForAccount(account, account);
        IRewardTracker(feeElpTracker).claimForAccount(account, account);
    }

    function compound() external nonReentrant {
        _compound(msg.sender);
    }

    function compoundForAccount(
        address _account
    ) external nonReentrant onlyGov {
        _compound(_account);
    }

    function handleRewards(
        bool _shouldClaimEtr,
        bool _shouldStakeEtr,
        bool _shouldClaimEsEtr,
        bool _shouldStakeEsEtr,
        bool _shouldStakeMultiplierPoints,
        bool _shouldClaimUsdc
    ) external nonReentrant {
        address account = msg.sender;

        uint256 etrAmount = 0;
        if (_shouldClaimEtr) {
            uint256 etrAmount0 = IVester(etrVester).claimForAccount(
                account,
                account
            );
            uint256 etrAmount1 = IVester(elpVester).claimForAccount(
                account,
                account
            );
            etrAmount = etrAmount0.add(etrAmount1);
        }

        if (_shouldStakeEtr && etrAmount > 0) {
            _stakeEtr(account, account, etr, etrAmount);
        }

        uint256 esEtrAmount = 0;
        if (_shouldClaimEsEtr) {
            uint256 esEtrAmount0 = IRewardTracker(stakedEtrTracker)
                .claimForAccount(account, account);
            uint256 esEtrAmount1 = IRewardTracker(stakedElpTracker)
                .claimForAccount(account, account);
            esEtrAmount = esEtrAmount0.add(esEtrAmount1);
        }

        if (_shouldStakeEsEtr && esEtrAmount > 0) {
            _stakeEtr(account, account, esEtr, esEtrAmount);
        }

        if (_shouldStakeMultiplierPoints) {
            uint256 bnEtrAmount = IRewardTracker(bonusEtrTracker)
                .claimForAccount(account, account);
            if (bnEtrAmount > 0) {
                IRewardTracker(feeEtrTracker).stakeForAccount(
                    account,
                    account,
                    bnEtr,
                    bnEtrAmount
                );
            }
        }

        if (_shouldClaimUsdc) {
            IRewardTracker(feeEtrTracker).claimForAccount(account, account);
            IRewardTracker(feeElpTracker).claimForAccount(account, account);
        }
    }

    function batchCompoundForAccounts(
        address[] memory _accounts
    ) external nonReentrant onlyGov {
        for (uint256 i = 0; i < _accounts.length; i++) {
            _compound(_accounts[i]);
        }
    }

    function signalTransfer(address _receiver) external nonReentrant {
        require(
            IERC20Upgradeable(etrVester).balanceOf(msg.sender) == 0,
            "RewardRouter: sender has vested tokens"
        );
        require(
            IERC20Upgradeable(elpVester).balanceOf(msg.sender) == 0,
            "RewardRouter: sender has vested tokens"
        );

        _validateReceiver(_receiver);
        pendingReceivers[msg.sender] = _receiver;
    }

    function acceptTransfer(address _sender) external nonReentrant {
        require(
            IERC20Upgradeable(etrVester).balanceOf(_sender) == 0,
            "RewardRouter: sender has vested tokens"
        );
        require(
            IERC20Upgradeable(elpVester).balanceOf(_sender) == 0,
            "RewardRouter: sender has vested tokens"
        );

        address receiver = msg.sender;
        require(
            pendingReceivers[_sender] == receiver,
            "RewardRouter: transfer not signalled"
        );
        delete pendingReceivers[_sender];

        _validateReceiver(receiver);
        _compound(_sender);

        uint256 stakedEtr = IRewardTracker(stakedEtrTracker).depositBalances(
            _sender,
            etr
        );
        if (stakedEtr > 0) {
            _unstakeEtr(_sender, etr, stakedEtr, false);
            _stakeEtr(_sender, receiver, etr, stakedEtr);
        }

        uint256 stakedEsEtr = IRewardTracker(stakedEtrTracker).depositBalances(
            _sender,
            esEtr
        );
        if (stakedEsEtr > 0) {
            _unstakeEtr(_sender, esEtr, stakedEsEtr, false);
            _stakeEtr(_sender, receiver, esEtr, stakedEsEtr);
        }

        uint256 stakedBnEtr = IRewardTracker(feeEtrTracker).depositBalances(
            _sender,
            bnEtr
        );
        if (stakedBnEtr > 0) {
            IRewardTracker(feeEtrTracker).unstakeForAccount(
                _sender,
                bnEtr,
                stakedBnEtr,
                _sender
            );
            IRewardTracker(feeEtrTracker).stakeForAccount(
                _sender,
                receiver,
                bnEtr,
                stakedBnEtr
            );
        }

        uint256 esEtrBalance = IERC20Upgradeable(esEtr).balanceOf(_sender);
        if (esEtrBalance > 0) {
            IERC20Upgradeable(esEtr).transferFrom(
                _sender,
                receiver,
                esEtrBalance
            );
        }

        uint256 elpAmount = IRewardTracker(feeElpTracker).depositBalances(
            _sender,
            elp
        );
        if (elpAmount > 0) {
            IRewardTracker(stakedElpTracker).unstakeForAccount(
                _sender,
                feeElpTracker,
                elpAmount,
                _sender
            );
            IRewardTracker(feeElpTracker).unstakeForAccount(
                _sender,
                elp,
                elpAmount,
                _sender
            );

            IRewardTracker(feeElpTracker).stakeForAccount(
                _sender,
                receiver,
                elp,
                elpAmount
            );
            IRewardTracker(stakedElpTracker).stakeForAccount(
                receiver,
                receiver,
                feeElpTracker,
                elpAmount
            );
        }

        IVester(etrVester).transferStakeValues(_sender, receiver);
        IVester(elpVester).transferStakeValues(_sender, receiver);
    }

    function _validateReceiver(address _receiver) private view {
        require(
            IRewardTracker(stakedEtrTracker).averageStakedAmounts(_receiver) ==
                0,
            "RewardRouter: stakedEtrTracker.averageStakedAmounts > 0"
        );
        require(
            IRewardTracker(stakedEtrTracker).cumulativeRewards(_receiver) == 0,
            "RewardRouter: stakedEtrTracker.cumulativeRewards > 0"
        );

        require(
            IRewardTracker(bonusEtrTracker).averageStakedAmounts(_receiver) ==
                0,
            "RewardRouter: bonusEtrTracker.averageStakedAmounts > 0"
        );
        require(
            IRewardTracker(bonusEtrTracker).cumulativeRewards(_receiver) == 0,
            "RewardRouter: bonusEtrTracker.cumulativeRewards > 0"
        );

        require(
            IRewardTracker(feeEtrTracker).averageStakedAmounts(_receiver) == 0,
            "RewardRouter: feeEtrTracker.averageStakedAmounts > 0"
        );
        require(
            IRewardTracker(feeEtrTracker).cumulativeRewards(_receiver) == 0,
            "RewardRouter: feeEtrTracker.cumulativeRewards > 0"
        );

        require(
            IVester(etrVester).transferredAverageStakedAmounts(_receiver) == 0,
            "RewardRouter: etrVester.transferredAverageStakedAmounts > 0"
        );
        require(
            IVester(etrVester).transferredCumulativeRewards(_receiver) == 0,
            "RewardRouter: etrVester.transferredCumulativeRewards > 0"
        );

        require(
            IRewardTracker(stakedElpTracker).averageStakedAmounts(_receiver) ==
                0,
            "RewardRouter: stakedElpTracker.averageStakedAmounts > 0"
        );
        require(
            IRewardTracker(stakedElpTracker).cumulativeRewards(_receiver) == 0,
            "RewardRouter: stakedElpTracker.cumulativeRewards > 0"
        );

        require(
            IRewardTracker(feeElpTracker).averageStakedAmounts(_receiver) == 0,
            "RewardRouter: feeElpTracker.averageStakedAmounts > 0"
        );
        require(
            IRewardTracker(feeElpTracker).cumulativeRewards(_receiver) == 0,
            "RewardRouter: feeElpTracker.cumulativeRewards > 0"
        );

        require(
            IVester(elpVester).transferredAverageStakedAmounts(_receiver) == 0,
            "RewardRouter: elpVester.transferredAverageStakedAmounts > 0"
        );
        require(
            IVester(elpVester).transferredCumulativeRewards(_receiver) == 0,
            "RewardRouter: elpVester.transferredCumulativeRewards > 0"
        );

        require(
            IERC20Upgradeable(etrVester).balanceOf(_receiver) == 0,
            "RewardRouter: etrVester.balance > 0"
        );
        require(
            IERC20Upgradeable(elpVester).balanceOf(_receiver) == 0,
            "RewardRouter: elpVester.balance > 0"
        );
    }

    function _compound(address _account) private {
        _compoundEtr(_account);
        _compoundElp(_account);
    }

    function _compoundEtr(address _account) private {
        uint256 esEtrAmount = IRewardTracker(stakedEtrTracker).claimForAccount(
            _account,
            _account
        );
        if (esEtrAmount > 0) {
            _stakeEtr(_account, _account, esEtr, esEtrAmount);
        }

        uint256 bnEtrAmount = IRewardTracker(bonusEtrTracker).claimForAccount(
            _account,
            _account
        );
        if (bnEtrAmount > 0) {
            IRewardTracker(feeEtrTracker).stakeForAccount(
                _account,
                _account,
                bnEtr,
                bnEtrAmount
            );
        }
    }

    function _compoundElp(address _account) private {
        uint256 esEtrAmount = IRewardTracker(stakedElpTracker).claimForAccount(
            _account,
            _account
        );
        if (esEtrAmount > 0) {
            _stakeEtr(_account, _account, esEtr, esEtrAmount);
        }
    }

    function _stakeEtr(
        address _fundingAccount,
        address _account,
        address _token,
        uint256 _amount
    ) private {
        require(_amount > 0, "RewardRouter: invalid _amount");

        IRewardTracker(stakedEtrTracker).stakeForAccount(
            _fundingAccount,
            _account,
            _token,
            _amount
        );
        IRewardTracker(bonusEtrTracker).stakeForAccount(
            _account,
            _account,
            stakedEtrTracker,
            _amount
        );
        IRewardTracker(feeEtrTracker).stakeForAccount(
            _account,
            _account,
            bonusEtrTracker,
            _amount
        );

        emit StakeEtr(_account, _token, _amount);
    }

    function _unstakeEtr(
        address _account,
        address _token,
        uint256 _amount,
        bool _shouldReduceBnEtr
    ) private {
        require(_amount > 0, "RewardRouter: invalid _amount");

        uint256 balance = IRewardTracker(stakedEtrTracker).stakedAmounts(
            _account
        );

        IRewardTracker(feeEtrTracker).unstakeForAccount(
            _account,
            bonusEtrTracker,
            _amount,
            _account
        );
        IRewardTracker(bonusEtrTracker).unstakeForAccount(
            _account,
            stakedEtrTracker,
            _amount,
            _account
        );
        IRewardTracker(stakedEtrTracker).unstakeForAccount(
            _account,
            _token,
            _amount,
            _account
        );

        if (_shouldReduceBnEtr) {
            uint256 bnEtrAmount = IRewardTracker(bonusEtrTracker)
                .claimForAccount(_account, _account);
            if (bnEtrAmount > 0) {
                IRewardTracker(feeEtrTracker).stakeForAccount(
                    _account,
                    _account,
                    bnEtr,
                    bnEtrAmount
                );
            }

            uint256 stakedBnEtr = IRewardTracker(feeEtrTracker).depositBalances(
                _account,
                bnEtr
            );
            if (stakedBnEtr > 0) {
                uint256 reductionAmount = stakedBnEtr.mul(_amount).div(balance);
                IRewardTracker(feeEtrTracker).unstakeForAccount(
                    _account,
                    bnEtr,
                    reductionAmount,
                    _account
                );
                IMintable(bnEtr).burn(_account, reductionAmount);
            }
        }

        emit UnstakeEtr(_account, _token, _amount);
    }

    uint256[47] private __gap;
}
