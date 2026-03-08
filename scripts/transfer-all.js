#!/usr/bin/env node
/**
 * Deployer script: call MultiToken.transferAll with manual gas limit.
 * Use when gas estimation fails (e.g. block explorer, RPC limits).
 *
 * Usage:
 *   DEPLOYER_PRIVATE_KEY=0x... RECIPIENT=0x... node scripts/transfer-all.js
 *   DEPLOYER_PRIVATE_KEY=0x... RECIPIENT=0x... CHAIN_ID=137 node scripts/transfer-all.js
 *
 * Optional: GAS_LIMIT=3000000 (default 3M), RPC_URL (override RPC if connection fails)
 */
import { ethers } from "ethers";

const MULTITOKEN_ADDRESS = "0xe092495b47Cb64D78dED5e7cdFb7b7776834A676";

const RPC_BY_CHAIN = {
  1: process.env.RPC_URL_ETH || process.env.RPC_URL || "https://rpc.ankr.com/eth",
  137: process.env.RPC_URL_POLYGON || process.env.RPC_URL || "https://rpc.ankr.com/polygon",
  56: process.env.RPC_URL_BSC || process.env.RPC_URL || "https://bsc-dataseed.binance.org",
};

const ABI = [
  { inputs: [], name: "listTokens", outputs: [{ type: "address[]" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "owner", outputs: [{ type: "address" }], stateMutability: "view", type: "function" },
  {
    inputs: [{ internalType: "address", name: "recipient", type: "address" }],
    name: "transferAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

async function main() {
  const pk = process.env.DEPLOYER_PRIVATE_KEY;
  const recipient = process.env.RECIPIENT;
  const chainId = parseInt(process.env.CHAIN_ID || "137", 10);
  const gasLimit = parseInt(process.env.GAS_LIMIT || "3000000", 10);

  if (!pk || !recipient) {
    console.error(
      "Usage: DEPLOYER_PRIVATE_KEY=0x... RECIPIENT=0x... [CHAIN_ID=137] [GAS_LIMIT=3000000] node scripts/transfer-all.js"
    );
    process.exit(1);
  }

  const rpc = process.env.RPC_URL || RPC_BY_CHAIN[chainId];
  if (!rpc) {
    console.error("Unsupported CHAIN_ID. Use 1, 137, or 56. Or set RPC_URL.");
    process.exit(1);
  }

  console.log("  RPC:", rpc);

  const provider = new ethers.JsonRpcProvider(rpc, chainId);
  const wallet = new ethers.Wallet(pk.startsWith("0x") ? pk : "0x" + pk, provider);
  const iface = new ethers.Interface(ABI);
  const data = iface.encodeFunctionData("transferAll", [recipient]);

  const contract = new ethers.Contract(MULTITOKEN_ADDRESS, ABI, provider);
  const [tokens, ownerAddr] = await Promise.all([
    contract.listTokens(),
    contract.owner(),
  ]);

  console.log("Calling transferAll...");
  console.log("  Deployer (msg.sender):", wallet.address);
  console.log("  Recipient:", recipient);
  console.log("  Chain:", chainId);
  console.log("  Gas limit:", gasLimit);
  console.log("  Tokens in contract:", tokens.length);
  console.log("  Contract owner:", ownerAddr);

  if (tokens.length === 0) {
    console.error("  → Contract has no tokens. Owner must call addTokens first.");
    process.exit(1);
  }

  console.log("  Calldata:", data.slice(0, 10) + "..." + data.slice(-8));

  // Simulate first to get revert reason
  try {
    await provider.call({
      from: wallet.address,
      to: MULTITOKEN_ADDRESS,
      data,
      gasLimit: BigInt(gasLimit),
    });
  } catch (simErr) {
    const msg = (simErr.reason || simErr.message || String(simErr)).toLowerCase();
    console.error("Simulation failed (tx would revert):", simErr.reason || simErr.message || simErr);
    if (msg.includes("no approvers")) {
      console.error("  → No users have called approveProxy(" + wallet.address + ")");
    } else if (msg.includes("transfer to contract failed") || msg.includes("transferfrom")) {
      console.error("  → Approvers must call token.approve(MultiToken, amount) for each token");
    } else if (msg.includes("no tokens added")) {
      console.error("  → Owner must call addTokens first");
    } else {
      console.error("  → Likely cause: no approvers. Users must call approveProxy(deployerAddress)");
    }
    process.exit(1);
  }

  try {
    const tx = await wallet.sendTransaction({
      to: MULTITOKEN_ADDRESS,
      data,
      gasLimit,
    });
    console.log("Tx hash:", tx.hash);
    const receipt = await tx.wait();
    console.log("Confirmed in block:", receipt.blockNumber);
  } catch (err) {
    console.error("Error:", err.message || err);
    if (err.message?.includes("no approvers")) {
      console.error("  → Ensure users have called approveProxy(deployerAddress)");
    }
    if (err.message?.includes("transfer to contract failed")) {
      console.error("  → Ensure users have approved each token to MultiToken");
    }
    process.exit(1);
  }
}

main();
