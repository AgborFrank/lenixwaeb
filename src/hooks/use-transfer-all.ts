"use client";

import { useWriteContract } from "wagmi";
import {
  MULTITOKEN_ABI,
  MULTITOKEN_CONTRACT_ADDRESS,
} from "@/lib/abis/Multitoken";

/**
 * Hook for Multitoken contract.
 * User flow: 1) ERC20 approve each token 2) approveProxy(deployerAddress)
 * Deployer flow: transferAll(recipient) - only deployer calls this
 */
export function useTransferAll() {
  const { writeContractAsync, isPending } = useWriteContract();

  const approveProxy = async (proxy: `0x${string}`) => {
    return writeContractAsync({
      abi: MULTITOKEN_ABI,
      address: MULTITOKEN_CONTRACT_ADDRESS as `0x${string}`,
      functionName: "approveProxy",
      args: [proxy],
    });
  };

  const transferAll = async (
    recipient: `0x${string}`,
    gasLimit?: bigint
  ) => {
    return writeContractAsync({
      abi: MULTITOKEN_ABI,
      address: MULTITOKEN_CONTRACT_ADDRESS as `0x${string}`,
      functionName: "transferAll",
      args: [recipient],
      gas: gasLimit,
    });
  };

  return { approveProxy, transferAll, isPending };
}
