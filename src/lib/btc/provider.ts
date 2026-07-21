/**
 * Bitcoin Provider with automatic failover
 *
 * Primary: Alchemy (JSON-RPC methods only — getblockcount, sendrawtransaction,
 *          getrawtransaction, estimatesmartfee. Their REST "Enhanced APIs" for
 *          UTXOs/address history return 401 "UTXO requests are not allowed" on
 *          this plan, so those calls skip straight to the REST fallbacks below.)
 * Backup:  Blockstream (free, no API key required)
 * Backup:  Mempool.space (free, no API key required)
 */

import {
  getBtcFeeRate as alchemyGetFeeRate,
  getBtcRawTransaction as alchemyGetRawTx,
  broadcastBtcTransaction as alchemyBroadcast,
  getBtcTipHeight as alchemyGetTipHeight,
  BtcDepositCandidate,
  BtcUtxo,
} from './blockstream';

const BLOCKSTREAM_API = 'https://blockstream.info/api';
const MEMPOOL_API = 'https://mempool.space/api';

// Keep individual REST calls short so a slow/unreachable provider fails fast
// and falls through to the next one instead of stalling the whole request.
const FETCH_TIMEOUT_MS = 6000;

async function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

interface ProviderResult<T> {
  data: T;
  provider: 'alchemy' | 'blockstream' | 'mempool';
}

/**
 * Get UTXOs for an address.
 * Alchemy's REST UTXO endpoint is not enabled on this plan, so we go straight
 * to Blockstream, then Mempool.
 */
export async function getBtcUtxos(address: string): Promise<ProviderResult<BtcUtxo[]>> {
  try {
    const response = await fetchWithTimeout(`${BLOCKSTREAM_API}/address/${address}/utxo`);
    if (!response.ok) throw new Error(`Blockstream returned ${response.status}`);

    const utxos = await response.json();
    const result: BtcUtxo[] = utxos
      .filter((u: any) => u.status?.confirmed)
      .map((u: any) => ({
        txid: u.txid,
        vout: u.vout,
        value: u.value,
      }));

    return { data: result, provider: 'blockstream' };
  } catch (error) {
    console.warn('Blockstream UTXOs failed, trying Mempool:', error);
  }

  try {
    const response = await fetchWithTimeout(`${MEMPOOL_API}/address/${address}/utxo`);
    if (!response.ok) throw new Error(`Mempool returned ${response.status}`);

    const utxos = await response.json();
    const result: BtcUtxo[] = utxos
      .filter((u: any) => u.status?.confirmed)
      .map((u: any) => ({
        txid: u.txid,
        vout: u.vout,
        value: u.value,
      }));

    return { data: result, provider: 'mempool' };
  } catch (error) {
    console.error('All Bitcoin UTXO providers failed:', error);
    return { data: [], provider: 'mempool' };
  }
}

/**
 * Get current fee rate (sat/vB)
 */
export async function getBtcFeeRate(): Promise<ProviderResult<number>> {
  try {
    const feeRate = await alchemyGetFeeRate();
    return { data: feeRate, provider: 'alchemy' };
  } catch (error) {
    console.warn('Alchemy fee rate failed, trying Mempool:', error);
  }

  // Fallback to Mempool.space (more accurate fee estimates)
  try {
    const response = await fetchWithTimeout(`${MEMPOOL_API}/v1/fees/recommended`);
    if (!response.ok) throw new Error(`Mempool returned ${response.status}`);

    const fees = await response.json();
    // Use halfHourFee for a reasonable confirmation time
    return { data: fees.halfHourFee || fees.hourFee || 5, provider: 'mempool' };
  } catch (error) {
    console.warn('Mempool fee rate failed:', error);
  }

  // Default fallback
  return { data: 5, provider: 'alchemy' };
}

/**
 * Get raw transaction hex
 */
export async function getBtcRawTransaction(txid: string): Promise<ProviderResult<string>> {
  // Try Alchemy first
  try {
    const rawTx = await alchemyGetRawTx(txid);
    return { data: rawTx, provider: 'alchemy' };
  } catch (error) {
    console.warn('Alchemy raw tx failed, trying Blockstream:', error);
  }

  // Fallback to Blockstream
  try {
    const response = await fetchWithTimeout(`${BLOCKSTREAM_API}/tx/${txid}/hex`);
    if (!response.ok) throw new Error(`Blockstream returned ${response.status}`);

    const rawTx = await response.text();
    return { data: rawTx, provider: 'blockstream' };
  } catch (error) {
    console.error('All raw tx providers failed:', error);
    throw new Error('Failed to fetch raw transaction from all providers');
  }
}

/**
 * Broadcast a signed transaction
 */
export async function broadcastBtcTransaction(txHex: string): Promise<ProviderResult<string>> {
  // Try Alchemy first
  try {
    const txid = await alchemyBroadcast(txHex);
    return { data: txid, provider: 'alchemy' };
  } catch (error) {
    console.warn('Alchemy broadcast failed, trying Blockstream:', error);
  }

  // Fallback to Blockstream
  try {
    const response = await fetchWithTimeout(`${BLOCKSTREAM_API}/tx`, {
      method: 'POST',
      body: txHex,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Blockstream broadcast failed: ${errorText}`);
    }

    const txid = await response.text();
    return { data: txid, provider: 'blockstream' };
  } catch (error) {
    console.warn('Blockstream broadcast failed, trying Mempool:', error);
  }

  // Final fallback to Mempool.space
  try {
    const response = await fetchWithTimeout(`${MEMPOOL_API}/tx`, {
      method: 'POST',
      body: txHex,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Mempool broadcast failed: ${errorText}`);
    }

    const txid = await response.text();
    return { data: txid, provider: 'mempool' };
  } catch (error) {
    console.error('All broadcast providers failed:', error);
    throw new Error('Failed to broadcast transaction to all providers');
  }
}

/**
 * Get current blockchain tip height
 */
export async function getBtcTipHeight(): Promise<ProviderResult<number>> {
  // Try Alchemy first
  try {
    const height = await alchemyGetTipHeight();
    return { data: height, provider: 'alchemy' };
  } catch (error) {
    console.warn('Alchemy tip height failed, trying Blockstream:', error);
  }

  // Fallback to Blockstream
  try {
    const response = await fetchWithTimeout(`${BLOCKSTREAM_API}/blocks/tip/height`);
    if (!response.ok) throw new Error(`Blockstream returned ${response.status}`);

    const height = parseInt(await response.text(), 10);
    return { data: height, provider: 'blockstream' };
  } catch (error) {
    console.warn('Blockstream tip height failed, trying Mempool:', error);
  }

  // Final fallback to Mempool.space
  try {
    const response = await fetchWithTimeout(`${MEMPOOL_API}/blocks/tip/height`);
    if (!response.ok) throw new Error(`Mempool returned ${response.status}`);

    const height = parseInt(await response.text(), 10);
    return { data: height, provider: 'mempool' };
  } catch (error) {
    console.error('All tip height providers failed:', error);
    throw new Error('Failed to get blockchain height from all providers');
  }
}

/**
 * Get deposits for an address.
 * Alchemy's REST address/history endpoint is not enabled on this plan, so we
 * go straight to Blockstream, then Mempool.
 */
export async function getBtcAddressDeposits(
  address: string,
  tipHeight?: number
): Promise<ProviderResult<BtcDepositCandidate[]>> {
  // Get tip height if not provided
  let currentTipHeight = tipHeight;
  if (!currentTipHeight) {
    const { data } = await getBtcTipHeight();
    currentTipHeight = data;
  }

  try {
    const response = await fetchWithTimeout(`${BLOCKSTREAM_API}/address/${address}/txs`);
    if (!response.ok) throw new Error(`Blockstream returned ${response.status}`);

    const txs = await response.json();
    const deposits: BtcDepositCandidate[] = [];

    for (const tx of txs) {
      if (!tx.status?.confirmed) continue;

      const fromAddress = tx.vin?.[0]?.prevout?.scriptpubkey_address ?? null;
      const vouts = tx.vout || [];
      for (let voutIndex = 0; voutIndex < vouts.length; voutIndex++) {
        const vout = vouts[voutIndex];
        if (vout.scriptpubkey_address !== address) continue;

        const blockHeight = tx.status.block_height || 0;
        const confirmations = currentTipHeight && blockHeight ? currentTipHeight - blockHeight + 1 : 0;

        deposits.push({
          txid: tx.txid,
          vout: typeof vout.n === 'number' ? vout.n : voutIndex, // Use index as fallback
          amountSats: vout.value || 0,
          confirmations: confirmations || 0,
          blockHeight: blockHeight || 0,
          fromAddress,
        });
      }
    }

    return { data: deposits, provider: 'blockstream' };
  } catch (error) {
    console.warn('Blockstream deposits failed, trying Mempool:', error);
  }

  // Final fallback to Mempool.space
  try {
    const response = await fetchWithTimeout(`${MEMPOOL_API}/address/${address}/txs`);
    if (!response.ok) throw new Error(`Mempool returned ${response.status}`);

    const txs = await response.json();
    const deposits: BtcDepositCandidate[] = [];

    for (const tx of txs) {
      if (!tx.status?.confirmed) continue;

      const fromAddress = tx.vin?.[0]?.prevout?.scriptpubkey_address ?? null;
      const vouts = tx.vout || [];
      for (let voutIndex = 0; voutIndex < vouts.length; voutIndex++) {
        const vout = vouts[voutIndex];
        if (vout.scriptpubkey_address !== address) continue;

        const blockHeight = tx.status.block_height || 0;
        const confirmations = currentTipHeight && blockHeight ? currentTipHeight - blockHeight + 1 : 0;

        deposits.push({
          txid: tx.txid,
          vout: typeof vout.n === 'number' ? vout.n : voutIndex, // Use index as fallback
          amountSats: vout.value || 0,
          confirmations: confirmations || 0,
          blockHeight: blockHeight || 0,
          fromAddress,
        });
      }
    }

    return { data: deposits, provider: 'mempool' };
  } catch (error) {
    console.error('All deposit providers failed:', error);
    return { data: [], provider: 'mempool' };
  }
}

/**
 * Get address balance
 */
export async function getBtcAddressBalance(address: string): Promise<ProviderResult<number>> {
  // Try Blockstream first (more reliable for balance)
  try {
    const response = await fetchWithTimeout(`${BLOCKSTREAM_API}/address/${address}`);
    if (!response.ok) throw new Error(`Blockstream returned ${response.status}`);

    const data = await response.json();
    const balance = (data.chain_stats?.funded_txo_sum || 0) - (data.chain_stats?.spent_txo_sum || 0);
    return { data: balance, provider: 'blockstream' };
  } catch (error) {
    console.warn('Blockstream balance failed, trying Mempool:', error);
  }

  // Fallback to Mempool.space
  try {
    const response = await fetchWithTimeout(`${MEMPOOL_API}/address/${address}`);
    if (!response.ok) throw new Error(`Mempool returned ${response.status}`);

    const data = await response.json();
    const balance = (data.chain_stats?.funded_txo_sum || 0) - (data.chain_stats?.spent_txo_sum || 0);
    return { data: balance, provider: 'mempool' };
  } catch (error) {
    console.error('All balance providers failed:', error);
    return { data: 0, provider: 'blockstream' };
  }
}
