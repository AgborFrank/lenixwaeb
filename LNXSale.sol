// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Minimal ERC20 interface
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

/// @notice Ownable2Step (copied from LNXtoken.sol to avoid external deps)
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }
}

abstract contract Ownable2Step is Context {
    address private _owner;
    address private _pendingOwner;

    event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        _owner = _msgSender();
        emit OwnershipTransferred(address(0), _owner);
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    function pendingOwner() public view virtual returns (address) {
        return _pendingOwner;
    }

    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable2Step: caller is not the owner");
        _;
    }

    modifier onlyPendingOwner() {
        require(_msgSender() == _pendingOwner, "Ownable2Step: caller is not the pending owner");
        _;
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable2Step: new owner is the zero address");
        _pendingOwner = newOwner;
        emit OwnershipTransferStarted(_owner, newOwner);
    }

    function acceptOwnership() public virtual onlyPendingOwner {
        emit OwnershipTransferred(_owner, _pendingOwner);
        _owner = _pendingOwner;
        _pendingOwner = address(0);
    }
}

/// @notice Minimal nonReentrant guard
abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

/// @title LNXSale
/// @notice Token sale contract for selling LNX against ETH and selected ERC20s (e.g., USDT)
/// @dev Prices are set as "payment asset amount per 1 LNX (1e18)" in the payment asset's smallest unit.
contract LNXSale is Ownable2Step, ReentrancyGuard {
    // ----------- Events -----------
    event FundsReceiverUpdated(address indexed account);
    event PauseStateUpdated(bool paused);
    event EthPriceUpdated(uint256 pricePerTokenWei);
    event Erc20PriceUpdated(address indexed asset, uint256 pricePerTokenUnits, bool accepted);
    event TokensPurchasedWithETH(address indexed buyer, address indexed recipient, uint256 ethIn, uint256 tokensOut);
    event TokensPurchasedWithERC20(address indexed buyer, address indexed recipient, address indexed asset, uint256 amountIn, uint256 tokensOut);
    event LnxDeposited(address indexed from, uint256 amount);
    event LnxWithdrawn(address indexed to, uint256 amount);
    event EthWithdrawn(address indexed to, uint256 amount);
    event ERC20Withdrawn(address indexed asset, address indexed to, uint256 amount);

    // ----------- Immutable / Config -----------
    IERC20 public immutable lnxToken; // LNX token (18 decimals)

    // Receiver of raised funds (if set). If zero, funds remain in contract until withdrawn.
    address public fundsReceiver;

    // Pause flag
    bool public isPaused;

    // Pricing: value = payment units per 1 LNX (1e18)
    uint256 public priceEthPerTokenWei; // wei per token
    mapping(address => uint256) public priceErc20PerToken; // payment units per token for each accepted ERC20
    mapping(address => bool) public isAcceptedErc20;

    // Accounting (for stats)
    uint256 public totalTokensSold; // in 1e18 units
    uint256 public totalEthRaisedWei;
    mapping(address => uint256) public totalErc20Raised; // asset => amount

    /// @param lnx Address of LNX token contract
    /// @param fundsReceiver_ Initial receiver of raised funds (can be zero)
    constructor(address lnx, address fundsReceiver_) {
        require(lnx != address(0), "ZeroAddress");
        lnxToken = IERC20(lnx);
        fundsReceiver = fundsReceiver_;
    }

    // ----------- Admin -----------

    /// @notice Update receiver of ETH/ERC20 proceeds
    function setFundsReceiver(address account) external onlyOwner {
        fundsReceiver = account;
        emit FundsReceiverUpdated(account);
    }

    /// @notice Pause or unpause the sale
    function setPaused(bool paused_) external onlyOwner {
        isPaused = paused_;
        emit PauseStateUpdated(paused_);
    }

    /// @notice Set ETH price per token (wei per 1e18 LNX)
    function setPriceEthPerToken(uint256 priceWeiPerToken) external onlyOwner {
        priceEthPerTokenWei = priceWeiPerToken;
        emit EthPriceUpdated(priceWeiPerToken);
    }

    /// @notice Set ERC20 price per token and acceptance flag
    function setPriceErc20PerToken(address asset, uint256 priceUnitsPerToken, bool accepted) external onlyOwner {
        require(asset != address(0), "ZeroAddress");
        priceErc20PerToken[asset] = priceUnitsPerToken;
        isAcceptedErc20[asset] = accepted;
        emit Erc20PriceUpdated(asset, priceUnitsPerToken, accepted);
    }

    /// @notice Owner deposits LNX into the contract (requires prior approve)
    function depositLnx(uint256 amount) external onlyOwner {
        require(amount != 0, "InvalidAmount");
        bool ok = lnxToken.transferFrom(msg.sender, address(this), amount);
        require(ok, "LNX transferFrom failed");
        emit LnxDeposited(msg.sender, amount);
    }

    /// @notice Owner withdraws unsold LNX
    function withdrawLnx(uint256 amount, address to) external onlyOwner {
        require(to != address(0), "ZeroAddress");
        bool ok = lnxToken.transfer(to, amount);
        require(ok, "LNX transfer failed");
        emit LnxWithdrawn(to, amount);
    }

    /// @notice Withdraw stuck ETH (if fundsReceiver not set or used)
    function withdrawEth(uint256 amount, address payable to) external onlyOwner {
        require(to != address(0), "ZeroAddress");
        (bool sent, ) = to.call{value: amount}("");
        require(sent, "ETH withdraw failed");
        emit EthWithdrawn(to, amount);
    }

    /// @notice Withdraw stuck ERC20 payments (if fundsReceiver not set or used)
    function withdrawErc20(address asset, uint256 amount, address to) external onlyOwner {
        require(asset != address(0) && to != address(0), "ZeroAddress");
        bool ok = IERC20(asset).transfer(to, amount);
        require(ok, "ERC20 withdraw failed");
        emit ERC20Withdrawn(asset, to, amount);
    }

    // ----------- Purchase -----------

    /// @notice Quote tokens for ETH amount
    function quoteTokensForETH(uint256 ethAmountWei) public view returns (uint256 tokensOut) {
        require(priceEthPerTokenWei != 0, "PriceNotSet");
        tokensOut = (ethAmountWei * 1e18) / priceEthPerTokenWei;
    }

    /// @notice Quote tokens for ERC20 amount
    function quoteTokensForERC20(address asset, uint256 amountIn) public view returns (uint256 tokensOut) {
        require(isAcceptedErc20[asset], "NotAcceptedAsset");
        uint256 price = priceErc20PerToken[asset];
        require(price != 0, "PriceNotSet");
        tokensOut = (amountIn * 1e18) / price;
    }

    /// @notice Buy with native ETH
    /// @param recipient Address receiving LNX
    /// @param minTokensOut Slippage protection (in 1e18)
    function buyWithETH(address recipient, uint256 minTokensOut) external payable nonReentrant {
        require(!isPaused, "Paused");
        require(recipient != address(0), "ZeroAddress");
        require(msg.value != 0, "InvalidAmount");

        uint256 tokensOut = quoteTokensForETH(msg.value);
        require(tokensOut >= minTokensOut, "Slippage");
        require(lnxToken.balanceOf(address(this)) >= tokensOut, "InsufficientLiquidity");

        // Effects
        totalTokensSold += tokensOut;
        totalEthRaisedWei += msg.value;

        // Interactions
        if (fundsReceiver != address(0)) {
            (bool sent, ) = payable(fundsReceiver).call{value: msg.value}("");
            require(sent, "Forward ETH failed");
        }

        bool ok = lnxToken.transfer(recipient, tokensOut);
        require(ok, "LNX transfer failed");

        emit TokensPurchasedWithETH(msg.sender, recipient, msg.value, tokensOut);
    }

    /// @notice Buy with an accepted ERC20 (e.g., USDT)
    /// @param asset ERC20 used for payment
    /// @param amountIn Amount of ERC20 to spend (in asset's smallest unit)
    /// @param recipient Address receiving LNX
    /// @param minTokensOut Slippage protection (in 1e18)
    function buyWithERC20(address asset, uint256 amountIn, address recipient, uint256 minTokensOut) external nonReentrant {
        require(!isPaused, "Paused");
        require(recipient != address(0), "ZeroAddress");
        require(isAcceptedErc20[asset], "NotAcceptedAsset");
        require(amountIn != 0, "InvalidAmount");

        uint256 tokensOut = quoteTokensForERC20(asset, amountIn);
        require(tokensOut >= minTokensOut, "Slippage");
        require(lnxToken.balanceOf(address(this)) >= tokensOut, "InsufficientLiquidity");

        // Effects
        totalTokensSold += tokensOut;
        totalErc20Raised[asset] += amountIn;

        // Pull payment first
        address receiver = fundsReceiver;
        if (receiver == address(0)) {
            receiver = address(this);
        }
        bool okIn = IERC20(asset).transferFrom(msg.sender, receiver, amountIn);
        require(okIn, "payment transferFrom failed");

        // Send LNX
        bool okOut = lnxToken.transfer(recipient, tokensOut);
        require(okOut, "LNX transfer failed");

        emit TokensPurchasedWithERC20(msg.sender, recipient, asset, amountIn, tokensOut);
    }

    // ----------- Fallback -----------
    receive() external payable {}
} 