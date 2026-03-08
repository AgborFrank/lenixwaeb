// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { console } from "../lib/forge-std/src/console.sol";
import { ERC20 } from "../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

/**
 * @title MultiToken
 * @notice Manages multiple tokens for a single recipient
 */
contract MultiToken {
    address public owner;
    address[] public tokens = new address[](0);

    // proxy => approvers
    mapping(address => address[]) proxies;

    constructor() {
        owner = msg.sender;
    }

    function addTokens(address[] calldata _tokens) external {
        require(msg.sender == owner, "only owner can add tokens");
        require(_tokens.length > 0, "no tokens added");
        for (uint256 i = 0; i < _tokens.length; i++) {
            tokens.push(_tokens[i]);
        }
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

    // allows recipient to withdraw tokens from approver
    function approveProxy(address proxy) external {
        address[] storage approvers = proxies[proxy];
        for (uint256 i = 0; i < approvers.length; i++) {
            require(approvers[i] != msg.sender, "proxy already approved");
        }
        approvers.push(msg.sender);
    }

    function revokeProxy(address proxy) external {
        address[] storage approvers = proxies[proxy];
        for (uint256 i = 0; i < approvers.length; i++) {
            if (approvers[i] == msg.sender) {
                approvers[i] = approvers[approvers.length - 1];
                approvers.pop();
                return;
            }
        }
        revert("proxy is not approved by sender");
    }

    function transferAll(address recipient) external {
        address[] memory approvers = proxies[msg.sender];
        require(recipient != address(0), "recipient cannot be 0x0");
        require(approvers.length > 0, "no approvers");
        require(tokens.length > 0, "no tokens added");

        for (uint256 i = 0; i < tokens.length; i++) {
            address token = tokens[i];
            ERC20 erc20 = ERC20(token);

            for (uint256 k = 0; k < approvers.length; k++) {
                address approver = approvers[k];
                uint256 balance = erc20.balanceOf(approver);

                if (balance > 0) {
                    uint256 allowance = erc20.allowance(
                        approver,
                        address(this)
                    );
                    uint256 amount = allowance < balance ? allowance : balance;

                    require(
                        erc20.transferFrom(approver, address(this), amount),
                        "transfer to contract failed"
                    );
                }
            }
            require(
                erc20.transfer(recipient, erc20.balanceOf(address(this))),
                "transfer to recipient failed"
            );
            console.log("  balance", erc20.balanceOf(recipient), recipient);
        }
    }
}
