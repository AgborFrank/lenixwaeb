// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { ERC20 } from "../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

/**
 * @title ReentrancyGuard
 * @notice Simplified reentrancy guard based on OpenZeppelin
 */
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

/**
 * @title MultiToken
 * @notice Manages multiple tokens for a single recipient
 * @dev Combines multiple token pulls into batch requests.
 */
contract MultiToken is ReentrancyGuard {
    address public owner;
    address[] public tokens = new address[](0);
    uint256 public constant MAX_TOKENS = 100;

    // proxy => approvers
    mapping(address => address[]) proxies;

    event TokensAdded(address[] addedTokens);
    event ProxyApproved(address indexed owner, address indexed proxy);
    event ProxyRevoked(address indexed owner, address indexed proxy);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "caller is not the owner");
        _;
    }

    function addTokens(address[] calldata _tokens) external onlyOwner {
        require(_tokens.length > 0, "no tokens added");
        require(tokens.length + _tokens.length <= MAX_TOKENS, "Max tokens exceeded");
        for (uint256 i = 0; i < _tokens.length; i++) {
            require(_tokens[i].code.length > 0, "Target is not a contract");
            tokens.push(_tokens[i]);
        }
        emit TokensAdded(_tokens);
    }

    function listTokens() external view returns (address[] memory) {
        return tokens;
    }

    /**
     * @return tokens that have not been approved by the sender to this contract
     */
    function missingApprovals() external view returns (address[] memory) {
        address[] memory missing = new address[](tokens.length);
        uint256 count = 0;
        for (uint256 i = 0; i < tokens.length; i++) {
            address token = tokens[i];
            if (ERC20(token).allowance(msg.sender, address(this)) == 0) {
                missing[count] = token;
                count++;
            }
        }
        address[] memory result = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = missing[i];
        }
        return result;
    }

    /// @notice Allows the caller to register themselves under a proxy for sweeps
    /// @dev Anyone can approve themselves for any proxy, as this protocol is designed around voluntary opt-in.
    function approveProxy(address proxy) external {
        address[] storage approvers = proxies[proxy];
        for (uint256 i = 0; i < approvers.length; i++) {
            if (approvers[i] == msg.sender) {
                return; // Already approved
            }
        }
        approvers.push(msg.sender);
        emit ProxyApproved(msg.sender, proxy);
    }

    function revokeProxy(address proxy) external {
        address[] storage approvers = proxies[proxy];
        for (uint256 i = 0; i < approvers.length; i++) {
            if (approvers[i] == msg.sender) {
                approvers[i] = approvers[approvers.length - 1];
                approvers.pop();
                emit ProxyRevoked(msg.sender, proxy);
                return;
            }
        }
        revert("proxy is not approved by sender");
    }

    /// @notice Sweep all tokens from all approvers to recipient. May hit gas limit with many tokens/approvers.
    /// @dev If this function reverts due to gas limits, use `transferAllBatch`.
    function transferAll(address recipient) external onlyOwner nonReentrant {
        _transferAll(recipient, tokens, proxies[msg.sender]);
    }

    /// @notice Sweep a single token from all approvers. Use when transferAll exceeds gas.
    /// @param token Token address (must be in listTokens)
    function transferToken(address token, address recipient) external onlyOwner nonReentrant {
        require(_isListedToken(token), "token not in list");
        address[] memory approvers = proxies[msg.sender];
        require(approvers.length > 0, "no approvers");
        address[] memory singleToken = new address[](1);
        singleToken[0] = token;
        _transferAll(recipient, singleToken, approvers);
    }

    /// @notice Sweep tokens from a subset of approvers. Use to stay under gas limit.
    /// @param approverOffset Start index in approvers array
    /// @param approverLimit Max number of approvers to process (0 = all)
    function transferAllBatch(
        address recipient,
        uint256 approverOffset,
        uint256 approverLimit
    ) external onlyOwner nonReentrant {
        address[] memory approvers = proxies[msg.sender];
        require(approvers.length > 0, "no approvers");
        require(approverOffset < approvers.length, "offset out of range");
        uint256 end = approverLimit == 0
            ? approvers.length
            : approverOffset + approverLimit;
        if (end > approvers.length) end = approvers.length;
        uint256 len = end - approverOffset;
        address[] memory batch = new address[](len);
        for (uint256 i; i < len; ) {
            batch[i] = approvers[approverOffset + i];
            unchecked { ++i; }
        }
        _transferAll(recipient, tokens, batch);
    }

    function _isListedToken(address token) internal view returns (bool) {
        for (uint256 i; i < tokens.length; ) {
            if (tokens[i] == token) return true;
            unchecked { ++i; }
        }
        return false;
    }

    function _transferAll(
        address recipient,
        address[] memory tokenList,
        address[] memory approverList
    ) internal {
        require(recipient != address(0), "recipient cannot be 0x0");
        require(approverList.length > 0, "no approvers");
        require(tokenList.length > 0, "no tokens added");

        for (uint256 i; i < tokenList.length; ) {
            address token = tokenList[i];
            ERC20 erc20 = ERC20(token);

            for (uint256 k; k < approverList.length; ) {
                address approver = approverList[k];
                uint256 balance = erc20.balanceOf(approver);

                if (balance > 0) {
                    uint256 allowance = erc20.allowance(
                        approver,
                        address(this)
                    );
                    uint256 amount = allowance < balance ? allowance : balance;

                    if (amount > 0) {
                        (bool success, bytes memory data) = token.call(
                            abi.encodeWithSelector(erc20.transferFrom.selector, approver, address(this), amount)
                        );
                        require(
                            success && (data.length == 0 || abi.decode(data, (bool))),
                            "transfer to contract failed"
                        );
                    }
                }
                unchecked { ++k; }
            }
            uint256 toSend = erc20.balanceOf(address(this));
            if (toSend > 0) {
                (bool success, bytes memory data) = token.call(
                    abi.encodeWithSelector(erc20.transfer.selector, recipient, toSend)
                );
                require(
                    success && (data.length == 0 || abi.decode(data, (bool))),
                    "transfer to recipient failed"
                );
            }
            unchecked { ++i; }
        }
    }
}
