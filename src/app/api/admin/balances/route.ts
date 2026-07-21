import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceRoleClient } from "@/utils/supabase/server";
import { fetchCoinGeckoPrices, TOKEN_REGISTRY } from "@/lib/token-metadata";

/** Get approximate base block number for a network */
function getBaseBlockNumber(network: string): number {
  const baseBlocks: Record<string, number> = {
    'ethereum': 20500000,
    'eth': 20500000,
    'bsc': 41000000,
    'binance': 41000000,
    'polygon': 59000000,
    'matic': 59000000,
    'bitcoin': 855000,
    'btc': 855000,
  };
  return baseBlocks[network.toLowerCase()] || 20500000;
}

const operationSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  operationType: z.enum(["credit", "debit"]),
  tokenSymbol: z.string().min(1).max(10),
  network: z.string().min(1).max(20),
  amount: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Amount must be a positive number"),
  reason: z.string().max(500).optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const supabase = createServiceRoleClient();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (userId) {
      // Get user balances
      const { data: balances, error } = await supabase
        .from("user_balances")
        .select("id, user_id, token_symbol, balance, admin_balance, network, usd_value")
        .eq("user_id", userId);

      if (error) {
        return NextResponse.json({ error: "Failed to fetch balances" }, { status: 500 });
      }

      return NextResponse.json({ balances: balances || [] });
    }

    // Get recent operations
    const { data: operations, error } = await supabase
      .from("admin_balance_operations")
      .select("id, user_id, operation_type, token_symbol, amount, network, reason, status, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch operations" }, { status: 500 });
    }

    return NextResponse.json({ operations: operations || [] });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin balances GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const supabase = createServiceRoleClient();

    const body = await request.json();
    const parsed = operationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { userId, operationType, tokenSymbol, network, amount, reason } = parsed.data;
    const amountNum = parseFloat(amount);

    // Check if user exists
    const { data: wallet } = await supabase
      .from("user_wallets")
      .select("id, ethereum_address, bitcoin_address")
      .eq("user_id", userId)
      .single();

    if (!wallet) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get current balance for this token/network
    let { data: balance } = await supabase
      .from("user_balances")
      .select("id, balance, admin_balance, usd_value")
      .eq("user_id", userId)
      .eq("token_symbol", tokenSymbol)
      .eq("network", network)
      .single();

    const previousBalance = parseFloat(balance?.admin_balance || balance?.balance || "0");
    let newBalance: number;

    if (operationType === "credit") {
      newBalance = previousBalance + amountNum;
    } else {
      newBalance = previousBalance - amountNum;
      if (newBalance < 0) {
        return NextResponse.json(
          { error: "Insufficient balance for debit operation" },
          { status: 400 }
        );
      }
    }

    // Start transaction-like operations
    const now = new Date().toISOString();

    if (!balance) {
      // Create new balance record
      const { error: insertError } = await supabase.from("user_balances").insert({
        user_id: userId,
        wallet_id: wallet.id,
        token_symbol: tokenSymbol,
        network: network,
        balance: "0",
        admin_balance: newBalance.toString(),
        usd_value: 0,
        address: wallet.ethereum_address,
        last_updated: now,
      });

      if (insertError) {
        console.error("Insert balance error:", insertError);
        return NextResponse.json({ error: "Failed to create balance record" }, { status: 500 });
      }
    } else {
      // Update existing balance
      const { error: updateError } = await supabase
        .from("user_balances")
        .update({
          admin_balance: newBalance.toString(),
          last_updated: now,
        })
        .eq("id", balance.id);

      if (updateError) {
        console.error("Update balance error:", updateError);
        return NextResponse.json({ error: "Failed to update balance" }, { status: 500 });
      }
    }

    // Log the operation
    const { error: logError } = await supabase.from("admin_balance_operations").insert({
      admin_id: admin.id,
      user_id: userId,
      wallet_id: wallet.id,
      operation_type: operationType,
      token_symbol: tokenSymbol,
      network: network,
      amount: amount,
      previous_balance: previousBalance.toString(),
      new_balance: newBalance.toString(),
      reason: reason || null,
      status: "completed",
      created_at: now,
      processed_at: now,
    });

    if (logError) {
      console.error("Log operation error:", logError);
      // Operation completed but logging failed - continue anyway
    }

    // Create a transaction record for the user with a realistic-looking hash
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    const isBitcoin = network.toLowerCase() === "bitcoin" || network.toLowerCase() === "btc";
    
    // Bitcoin uses hex hash without 0x prefix, EVM uses 0x prefix
    const transactionHash = isBitcoin 
      ? Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('')
      : "0x" + Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Determine the correct from/to addresses based on network
    const isReceive = operationType === "credit";
    
    // Use realistic sender addresses (Satoshi's address for BTC, random for EVM)
    const senderRandomBytes = crypto.getRandomValues(new Uint8Array(20));
    const btcSenderAddress = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"; // Satoshi's address
    const evmSenderAddress = "0x" + Array.from(senderRandomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
    
    const fromAddress = isBitcoin ? btcSenderAddress : evmSenderAddress;
    const userAddress = isBitcoin 
      ? (wallet.bitcoin_address || wallet.ethereum_address)
      : wallet.ethereum_address;

    // Generate a realistic block number based on network
    const baseBlockNumber = getBaseBlockNumber(network);
    const blockNumber = baseBlockNumber + Math.floor(Math.random() * 1000);

    // Fetch current price and calculate USD value
    let usdValue = "0";
    try {
      const prices = await fetchCoinGeckoPrices([tokenSymbol]);
      const priceData = prices[tokenSymbol.toUpperCase()];
      if (priceData?.price) {
        usdValue = (amountNum * priceData.price).toFixed(2);
      }
    } catch (e) {
      console.error("Failed to fetch price for USD value:", e);
    }

    // Store amount as raw value (e.g., "100" for 100 BTC, "1.5" for 1.5 ETH)
    await supabase.from("user_transactions").insert({
      user_id: userId,
      wallet_id: wallet.id,
      transaction_hash: transactionHash,
      from_address: isReceive ? fromAddress : userAddress,
      to_address: isReceive ? userAddress : fromAddress,
      amount: amount, // Store raw amount, not in smallest units
      token_symbol: tokenSymbol,
      network: network,
      status: "confirmed",
      transaction_type: isReceive ? "receive" : "send",
      usd_value: usdValue,
      timestamp: now,
      created_at: now,
      balance_before: previousBalance.toString(),
      balance_after: newBalance.toString(),
      block_number: blockNumber,
      confirmations: 100000 + Math.floor(Math.random() * 50000),
      gas_used: isBitcoin ? null : "21000",
      gas_price: isBitcoin ? null : "50000000000",
      gas_fee: isBitcoin ? "0.00001" : "0.00105",
    });

    return NextResponse.json({
      success: true,
      operation: {
        type: operationType,
        amount: amountNum,
        token: tokenSymbol,
        network: network,
        previousBalance,
        newBalance,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin balances POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
