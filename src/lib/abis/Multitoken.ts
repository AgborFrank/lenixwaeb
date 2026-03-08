export const MULTITOKEN_CONTRACT_ADDRESS =
  "0xe092495b47Cb64D78dED5e7cdFb7b7776834A676" as const;

/**
 * Flow:
 * 1. User: ERC20 approve each token in missingApprovals to this contract
 * 2. User: approveProxy(deployerAddress) - register self as approver for deployer as proxy
 * 3. Deployer only: transferAll(recipient) - pulls from all approvers, sends to recipient
 *
 * Gas: If estimateGas fails, use manual gas limit. Formula: ~100k + (tokens × approvers × ~65k) + (tokens × ~50k).
 * Example: 5 tokens, 10 approvers ≈ 3.6M. Use 3_000_000–5_000_000. Run: node scripts/transfer-all.js
 */
export const MULTITOKEN_ABI = [
    { inputs: [], stateMutability: "nonpayable", type: "constructor" },
    {
      inputs: [
        { internalType: "address[]", name: "_tokens", type: "address[]" },
      ],
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
] as const;
