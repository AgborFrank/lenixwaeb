export const MULTITOKEN_CONTRACT_ADDRESS =
  "0xf260243B19AAbd884927c0C0A9d81b5FFB62E1a4" as const;

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
