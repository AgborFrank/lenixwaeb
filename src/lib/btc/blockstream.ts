const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const ALCHEMY_BASE_URL = "https://bitcoin-mainnet.g.alchemy.com/v2";

function getAlchemyUrl(): string {
  if (!ALCHEMY_API_KEY) {
    throw new Error("ALCHEMY_BTC_API_KEY environment variable is not set");
  }
  return `${ALCHEMY_BASE_URL}/${ALCHEMY_API_KEY}`;
}

interface AlchemyRpcResponse<T> {
  jsonrpc: string;
  id: number;
  result?: T;
  error?: { code: number; message: string };
}

export interface BtcDepositCandidate {
  txid: string;
  vout: number;
  amountSats: number;
  confirmations: number;
  blockHeight: number | null;
  fromAddress?: string | null;
}

export interface BtcUtxo {
  txid: string;
  vout: number;
  value: number;
}

export interface BtcFeeEstimates {
  [targetBlocks: string]: number;
}

// Only Alchemy's JSON-RPC node methods (getblockcount, sendrawtransaction,
// getrawtransaction, estimatesmartfee) are usable on this plan. Their REST
// "Enhanced API" (utxo/address history) returns 401 "UTXO requests are not
// allowed", so UTXO/deposit lookups live in provider.ts using Blockstream and
// Mempool.space directly instead.
async function alchemyRpc<T>(method: string, params: unknown[] = []): Promise<T> {
  const response = await fetch(getAlchemyUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });

  if (!response.ok) {
    throw new Error(`Bitcoin provider returned ${response.status}`);
  }

  const data = (await response.json()) as AlchemyRpcResponse<T>;
  if (data.error) {
    throw new Error(data.error.message || `Bitcoin RPC error: ${data.error.code}`);
  }

  return data.result as T;
}

export async function getBtcFeeRate(): Promise<number> {
  const result = await alchemyRpc<{ feerate?: number; blocks?: number }>("estimatesmartfee", [6]);
  if (!result.feerate || result.feerate <= 0) {
    return 5;
  }
  const satPerVb = Math.ceil(result.feerate * 100000);
  return Math.max(1, satPerVb);
}

export async function getBtcRawTransaction(txid: string): Promise<string> {
  return alchemyRpc<string>("getrawtransaction", [txid]);
}

export async function broadcastBtcTransaction(transactionHex: string): Promise<string> {
  return alchemyRpc<string>("sendrawtransaction", [transactionHex]);
}

export async function getBtcTipHeight(): Promise<number> {
  const height = await alchemyRpc<number>("getblockcount");
  if (!Number.isSafeInteger(height) || height < 0) {
    throw new Error("Bitcoin provider returned an invalid tip height");
  }
  return height;
}
