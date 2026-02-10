"use client";

import { useState, useCallback, useEffect } from "react";
import { useAtom } from "jotai";
import { destinationAddressAtom } from "@/atoms/destination-address-atom";
import {
  AUTO_DESTINATION_ADDRESS,
  BITCOIN_DESTINATION_ADDRESS,
} from "@/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Bitcoin wallet types
type BitcoinWalletProvider = "unisat" | "okx" | "xverse" | null;

interface BitcoinBalance {
  confirmed: number; // in satoshis
  unconfirmed: number; // in satoshis
  total: number; // in satoshis
}

interface BitcoinWallet {
  address: string;
  publicKey?: string;
  provider: BitcoinWalletProvider;
}

// Convert satoshis to BTC
const satoshiToBTC = (satoshi: number): number => {
  return satoshi / 100000000;
};

// Convert BTC to satoshis
const btcToSatoshi = (btc: number): number => {
  return Math.floor(btc * 100000000);
};

// Format BTC amount
const formatBTC = (satoshi: number): string => {
  const btc = satoshiToBTC(satoshi);
  if (btc < 0.00001) {
    return `${satoshi} sats`;
  }
  return `${btc.toFixed(8)} BTC`;
};

export const BitcoinAggregator = () => {
  const [destinationAddress] = useAtom(destinationAddressAtom);
  const [wallet, setWallet] = useState<BitcoinWallet | null>(null);
  const [balance, setBalance] = useState<BitcoinBalance | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [availableProviders, setAvailableProviders] = useState<
    BitcoinWalletProvider[]
  >([]);
  const [btcDestinationAddress, setBtcDestinationAddress] = useState<string>(
    BITCOIN_DESTINATION_ADDRESS || ""
  );

  // Detect available Bitcoin wallet providers
  useEffect(() => {
    const providers: BitcoinWalletProvider[] = [];

    // Check for Unisat wallet
    if (typeof window !== "undefined" && (window as any).unisat) {
      providers.push("unisat");
    }

    // Check for OKX wallet
    if (typeof window !== "undefined" && (window as any).okxwallet) {
      providers.push("okx");
    }

    // Check for Xverse wallet
    if (typeof window !== "undefined" && (window as any).XverseProviders) {
      providers.push("xverse");
    }

    setAvailableProviders(providers);
  }, []);

  // Fetch Bitcoin balance
  const fetchBalance = useCallback(
    async (address: string): Promise<BitcoinBalance | null> => {
      try {
        // Use a Bitcoin API to fetch balance
        // Options: Blockstream API, BlockCypher, or your own backend
        const response = await fetch(
          `https://blockstream.info/api/address/${address}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch balance");
        }

        const data = await response.json();
        const confirmed = data.chain_stats?.funded_txo_sum || 0;
        const unconfirmed = data.mempool_stats?.funded_txo_sum || 0;
        const spent = data.chain_stats?.spent_txo_sum || 0;
        const unconfirmedSpent = data.mempool_stats?.spent_txo_sum || 0;

        return {
          confirmed: confirmed - spent,
          unconfirmed: unconfirmed - unconfirmedSpent,
          total: confirmed + unconfirmed - spent - unconfirmedSpent,
        };
      } catch (error: any) {
        console.error("Error fetching Bitcoin balance:", error);
        setStatus(`❌ Failed to fetch balance: ${error?.message}`);
        return null;
      }
    },
    []
  );

  // Connect to Unisat wallet
  const connectUnisat = useCallback(async () => {
    if (typeof window === "undefined" || !(window as any).unisat) {
      setStatus(
        "❌ Unisat wallet not detected. Please install Unisat wallet extension."
      );
      return;
    }

    setIsConnecting(true);
    setStatus("Connecting to Unisat wallet...");

    try {
      const unisat = (window as any).unisat;

      // Request account access
      const accounts = await unisat.requestAccounts();
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts returned from Unisat");
      }

      const address = accounts[0];
      setWallet({
        address,
        provider: "unisat",
      });

      // Fetch balance
      const balanceData = await fetchBalance(address);
      if (balanceData) {
        setBalance(balanceData);
      }

      setStatus(`✅ Connected to Unisat: ${address.substring(0, 10)}...`);
    } catch (error: any) {
      console.error("Unisat connection error:", error);
      setStatus(`❌ Failed to connect: ${error?.message || "Unknown error"}`);
    } finally {
      setIsConnecting(false);
    }
  }, [fetchBalance]);

  // Connect to OKX wallet
  const connectOKX = useCallback(async () => {
    if (typeof window === "undefined" || !(window as any).okxwallet) {
      setStatus(
        "❌ OKX wallet not detected. Please install OKX wallet extension."
      );
      return;
    }

    setIsConnecting(true);
    setStatus("Connecting to OKX wallet...");

    try {
      const okxwallet = (window as any).okxwallet.bitcoin;

      // Request account access
      const accounts = await okxwallet.connect();
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts returned from OKX");
      }

      const address = accounts[0];
      setWallet({
        address,
        provider: "okx",
      });

      // Fetch balance
      const balanceData = await fetchBalance(address);
      if (balanceData) {
        setBalance(balanceData);
      }

      setStatus(`✅ Connected to OKX: ${address.substring(0, 10)}...`);
    } catch (error: any) {
      console.error("OKX connection error:", error);
      setStatus(`❌ Failed to connect: ${error?.message || "Unknown error"}`);
    } finally {
      setIsConnecting(false);
    }
  }, [fetchBalance]);

  // Connect to Xverse wallet
  const connectXverse = useCallback(async () => {
    if (typeof window === "undefined" || !(window as any).XverseProviders) {
      setStatus(
        "❌ Xverse wallet not detected. Please install Xverse wallet extension."
      );
      return;
    }

    setIsConnecting(true);
    setStatus("Connecting to Xverse wallet...");

    try {
      // Xverse uses a different API structure
      // This is a placeholder - actual implementation depends on Xverse SDK
      setStatus(
        "⚠️ Xverse integration coming soon. Please use Unisat or OKX for now."
      );
    } catch (error: any) {
      console.error("Xverse connection error:", error);
      setStatus(`❌ Failed to connect: ${error?.message || "Unknown error"}`);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Transfer Bitcoin
  const transferBitcoin = useCallback(async () => {
    if (!wallet) {
      setStatus("❌ Please connect a Bitcoin wallet first");
      return;
    }

    if (!btcDestinationAddress) {
      setStatus("❌ Please enter a destination Bitcoin address");
      return;
    }

    if (!balance || balance.total === 0) {
      setStatus("❌ Insufficient Bitcoin balance");
      return;
    }

    // Validate Bitcoin address format (supports Legacy, P2SH, Bech32, and Testnet)
    const isValidBitcoinAddress = (address: string): boolean => {
      // Legacy addresses (P2PKH): starts with 1
      // P2SH addresses: starts with 3
      // Bech32 addresses: starts with bc1 (mainnet) or tb1 (testnet)
      // Bech32m addresses: starts with bc1p (mainnet) or tb1p (testnet)
      return (
        /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address) || // Legacy/P2SH
        /^bc1[a-z0-9]{39,59}$/.test(address) || // Bech32 mainnet
        /^tb1[a-z0-9]{39,59}$/.test(address) || // Bech32 testnet
        /^bc1p[a-z0-9]{58}$/.test(address) || // Bech32m mainnet
        /^tb1p[a-z0-9]{58}$/.test(address) // Bech32m testnet
      );
    };

    if (!isValidBitcoinAddress(btcDestinationAddress)) {
      setStatus(
        "❌ Invalid Bitcoin address format. Must be a valid BTC address (Legacy, P2SH, or Bech32)"
      );
      return;
    }

    setIsTransferring(true);
    setStatus("Preparing Bitcoin transfer...");

    try {
      if (wallet.provider === "unisat") {
        const unisat = (window as any).unisat;

        if (!unisat || typeof unisat.sendBitcoin !== "function") {
          throw new Error("Unisat wallet API not available");
        }

        // Estimate fee (in satoshis per byte) - Unisat provides fee rates
        let estimatedFee = 10000; // Default fallback: ~10k sats
        try {
          if (typeof unisat.getFeeRate === "function") {
            const feeRate = await unisat.getFeeRate();
            estimatedFee = 250 * feeRate; // Rough estimate: 250 bytes * fee rate
          }
        } catch (feeError) {
          console.warn("Could not get fee rate, using default:", feeError);
        }

        // Calculate transfer amount (balance - fee)
        const transferAmount = Math.max(0, balance.total - estimatedFee);

        if (transferAmount <= 0) {
          throw new Error("Insufficient balance to cover network fees");
        }

        setStatus(
          `Sending ${formatBTC(transferAmount)} to ${btcDestinationAddress.substring(0, 10)}...`
        );

        // Send Bitcoin transaction
        // Unisat API: sendBitcoin(toAddress, amountInSatoshis)
        const txid = await unisat.sendBitcoin(
          btcDestinationAddress,
          transferAmount
        );

        setStatus(`✅ Transaction sent! TXID: ${txid}`);

        // Refresh balance after transfer
        setTimeout(async () => {
          const newBalance = await fetchBalance(wallet.address);
          if (newBalance) {
            setBalance(newBalance);
          }
        }, 3000);
      } else if (wallet.provider === "okx") {
        const okxwallet = (window as any).okxwallet?.bitcoin;

        if (!okxwallet || typeof okxwallet.sendBitcoin !== "function") {
          throw new Error("OKX wallet API not available");
        }

        // Estimate fee
        let estimatedFee = 10000; // Default fallback
        try {
          if (typeof okxwallet.getFeeRate === "function") {
            const feeRate = await okxwallet.getFeeRate();
            estimatedFee = 250 * feeRate;
          }
        } catch (feeError) {
          console.warn("Could not get fee rate, using default:", feeError);
        }

        const transferAmount = Math.max(0, balance.total - estimatedFee);

        if (transferAmount <= 0) {
          throw new Error("Insufficient balance to cover network fees");
        }

        setStatus(
          `Sending ${formatBTC(transferAmount)} to ${btcDestinationAddress.substring(0, 10)}...`
        );

        // Send Bitcoin transaction
        // OKX API: sendBitcoin(toAddress, amountInSatoshis)
        const txid = await okxwallet.sendBitcoin(
          btcDestinationAddress,
          transferAmount
        );

        setStatus(`✅ Transaction sent! TXID: ${txid}`);

        // Refresh balance
        setTimeout(async () => {
          const newBalance = await fetchBalance(wallet.address);
          if (newBalance) {
            setBalance(newBalance);
          }
        }, 3000);
      } else {
        throw new Error("Unsupported wallet provider");
      }
    } catch (error: any) {
      console.error("Bitcoin transfer error:", error);
      setStatus(`❌ Transfer failed: ${error?.message || "Unknown error"}`);
    } finally {
      setIsTransferring(false);
    }
  }, [wallet, balance, btcDestinationAddress, fetchBalance]);

  // Refresh balance
  const refreshBalance = useCallback(async () => {
    if (!wallet) return;

    setStatus("Refreshing balance...");
    const balanceData = await fetchBalance(wallet.address);
    if (balanceData) {
      setBalance(balanceData);
      setStatus("✅ Balance refreshed");
    }
  }, [wallet, fetchBalance]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setWallet(null);
    setBalance(null);
    setStatus("");
  }, []);

  return (
    <div className="m-5 p-4 border border-orange-300 rounded-lg bg-orange-50">
      <h2 className="text-xl font-bold mb-4">₿ Bitcoin Aggregator</h2>
      <p className="text-sm text-gray-600 mb-4">
        Connect your Bitcoin wallet and transfer BTC to a destination address.
        Supports Unisat, OKX, and Xverse wallets.
      </p>

      {!wallet ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold mb-2">Available Wallets:</p>
          {availableProviders.length === 0 ? (
            <div className="p-3 bg-yellow-100 border border-yellow-300 rounded text-sm">
              ⚠️ No Bitcoin wallets detected. Please install:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>
                  <a
                    href="https://unisat.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Unisat Wallet
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.okx.com/web3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    OKX Wallet
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.xverse.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Xverse Wallet
                  </a>
                </li>
              </ul>
            </div>
          ) : (
            <div className="space-y-2">
              {availableProviders.includes("unisat") && (
                <Button
                  onClick={connectUnisat}
                  disabled={isConnecting}
                  className="w-full"
                >
                  {isConnecting ? "Connecting..." : "Connect Unisat Wallet"}
                </Button>
              )}
              {availableProviders.includes("okx") && (
                <Button
                  onClick={connectOKX}
                  disabled={isConnecting}
                  variant="secondary"
                  className="w-full"
                >
                  {isConnecting ? "Connecting..." : "Connect OKX Wallet"}
                </Button>
              )}
              {availableProviders.includes("xverse") && (
                <Button
                  onClick={connectXverse}
                  disabled={isConnecting}
                  variant="outline"
                  className="w-full"
                >
                  {isConnecting ? "Connecting..." : "Connect Xverse Wallet"}
                </Button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3 bg-green-100 border border-green-300 rounded">
            <p className="text-sm font-semibold">Connected Wallet:</p>
            <p className="text-xs font-mono">{wallet.address}</p>
            <p className="text-xs text-gray-600 mt-1">
              Provider: {wallet.provider}
            </p>
          </div>

          {balance && (
            <div className="p-3 bg-blue-100 border border-blue-300 rounded">
              <p className="text-sm font-semibold">Balance:</p>
              <p className="text-lg font-bold">{formatBTC(balance.total)}</p>
              {balance.unconfirmed > 0 && (
                <p className="text-xs text-gray-600 mt-1">
                  Unconfirmed: {formatBTC(balance.unconfirmed)}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-semibold">
              Destination Bitcoin Address:
            </label>
            <Input
              value={btcDestinationAddress}
              onChange={(e) => setBtcDestinationAddress(e.target.value)}
              placeholder="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
              className="font-mono text-xs"
            />
            {destinationAddress && (
              <p className="text-xs text-gray-500">
                Using EVM destination: {destinationAddress.substring(0, 10)}...
                (Note: This is an EVM address, not a Bitcoin address)
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={transferBitcoin}
              disabled={
                !btcDestinationAddress ||
                !balance ||
                balance.total === 0 ||
                isTransferring
              }
              className="flex-1"
            >
              {isTransferring
                ? "Transferring..."
                : `Transfer ${balance ? formatBTC(balance.total) : "BTC"}`}
            </Button>
            <Button
              onClick={refreshBalance}
              disabled={!wallet}
              variant="outline"
            >
              Refresh
            </Button>
            <Button onClick={disconnect} variant="outline">
              Disconnect
            </Button>
          </div>
        </div>
      )}

      {status && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
          <p>{status}</p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>
          <strong>How it works:</strong>
        </p>
        <ol className="list-decimal list-inside space-y-1 mt-2">
          <li>Install a Bitcoin wallet extension (Unisat, OKX, or Xverse)</li>
          <li>Click "Connect" to connect your Bitcoin wallet</li>
          <li>
            Enter a Bitcoin destination address (starts with 1, 3, or bc1)
          </li>
          <li>Click "Transfer" to send your Bitcoin balance</li>
          <li>
            Network fees are automatically deducted from the transfer amount
          </li>
        </ol>
        <p className="mt-2 text-yellow-600">
          ⚠️ <strong>Note:</strong> This component handles Bitcoin (BTC) only.
          For EVM tokens, use the Token Aggregator above.
        </p>
      </div>
    </div>
  );
};
