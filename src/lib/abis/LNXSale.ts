export const LNX_SALE_ABI = [
  // Read functions
  {
    type: "function",
    name: "priceEthPerTokenWei",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "priceErc20PerToken",
    stateMutability: "view",
    inputs: [{ name: "asset", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "isAcceptedErc20",
    stateMutability: "view",
    inputs: [{ name: "asset", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "quoteTokensForETH",
    stateMutability: "view",
    inputs: [{ name: "ethAmountWei", type: "uint256" }],
    outputs: [{ name: "tokensOut", type: "uint256" }],
  },
  {
    type: "function",
    name: "quoteTokensForERC20",
    stateMutability: "view",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amountIn", type: "uint256" }
    ],
    outputs: [{ name: "tokensOut", type: "uint256" }],
  },
  // Aggregate stats
  {
    type: "function",
    name: "totalTokensSold",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "totalEthRaisedWei",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "totalErc20Raised",
    stateMutability: "view",
    inputs: [{ name: "asset", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  // Write functions
  {
    type: "function",
    name: "buyWithETH",
    stateMutability: "payable",
    inputs: [
      { name: "recipient", type: "address" },
      { name: "minTokensOut", type: "uint256" }
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "buyWithERC20",
    stateMutability: "nonpayable",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amountIn", type: "uint256" },
      { name: "recipient", type: "address" },
      { name: "minTokensOut", type: "uint256" }
    ],
    outputs: [],
  }
] as const; 