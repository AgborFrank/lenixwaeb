"use client";

import { ReceivedTokenData, ReceiveSuccessModal } from "@/components/receive-success-modal";
import { decryptData, encryptData, encryptDataCompatible } from "@/utils/crypto";
import { createClient } from "@/utils/supabase/client";
import { ethers } from "ethers";
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { getWalletPortfolio, WalletPortfolio } from "../lenix-wallet/actions";

const ADMIN_ENCRYPTION_KEY = 'admin_encryption_key_2024';


export type WalletState = "loading" | "no_wallet" | "locked" | "unlocked";

export interface WalletData {
    address: string;
    mnemonic?: string;
    privateKey?: string;
    balance?: string;
}

interface WalletContextType {
    walletState: WalletState;
    walletData: WalletData | null;
    portfolio: WalletPortfolio | null;
    error: string | null;
    createWallet: (password: string) => Promise<ethers.HDNodeWallet>;
    importWallet: (phrase: string, password: string) => Promise<ethers.HDNodeWallet>;
    unlockWallet: (password: string) => Promise<ethers.HDNodeWallet | undefined>;
    lockWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [walletState, setWalletState] = useState<WalletState>("loading");
    const [walletData, setWalletData] = useState<WalletData | null>(null);
    const [portfolio, setPortfolio] = useState<WalletPortfolio | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [dbWallet, setDbWallet] = useState<any | null>(null);

    // Modal State
    const [receivedToken, setReceivedToken] = useState<ReceivedTokenData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Create client once
    const [supabase] = useState(() => createClient());

    // Check DB on mount
    useEffect(() => {
        console.log("WalletProvider mounted");
        const checkUserWallet = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    console.log("No user found");
                    setWalletState("no_wallet");
                    return;
                }

                const { data, error } = await supabase
                    .from("user_wallets")
                    .select("*")
                    .eq("user_id", user.id)
                    .single();

                if (error && error.code !== "PGRST116") { // PGRST116 is "not found"
                    console.error("Error fetching wallet:", error);
                    setWalletState("no_wallet");
                    return;
                }

                if (data) {
                    console.log("Wallet found in DB, setting to locked");
                    setDbWallet(data);
                    setWalletState("locked");
                } else {
                    console.log("No wallet found in DB");
                    setWalletState("no_wallet");
                }
            } catch (e) {
                console.error("Wallet check failed", e);
                setWalletState("no_wallet");
            }
        };
        checkUserWallet();
    }, []);

    // Ref to track known balance snapshot (independent of React state)
    const knownBalancesRef = useRef<Map<string, string> | null>(null);

    // Polling for Portfolio & Incoming Transactions
    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (walletState === "unlocked" && walletData?.address) {
            const getTokenKey = (t: any) => {
                const sym = t.contract_ticker_symbol || t.symbol || 'UNKNOWN';
                const chain = t.chainId || 0;
                return `${sym}-${chain}`;
            };

            const fetchPortfolio = async () => {
                try {
                    const newPortfolio = await getWalletPortfolio(walletData.address);

                    // Build a snapshot of new balances
                    const newBalances = new Map<string, string>();
                    for (const token of newPortfolio.tokens) {
                        newBalances.set(getTokenKey(token), token.balance || "0");
                    }

                    // Compare ONLY if we have a previous snapshot (skip initial load entirely)
                    if (knownBalancesRef.current !== null && !isModalOpen) {
                        for (const token of newPortfolio.tokens) {
                            const key = getTokenKey(token);
                            const oldBal = knownBalancesRef.current.get(key);

                            // Only compare if we had this token before (skip newly appearing tokens)
                            if (oldBal === undefined) continue;

                            try {
                                const oldBig = BigInt(oldBal);
                                const newBig = BigInt(token.balance || "0");

                                if (newBig > oldBig) {
                                    const diff = newBig - oldBig;
                                    const decimals = token.contract_decimals || 18;
                                    const diffFormatted = Number(diff) / Math.pow(10, decimals);

                                    // Only trigger for meaningful amounts (> $0.01 equivalent or > dust)
                                    if (diffFormatted > 0.0001) {
                                        setReceivedToken({
                                            symbol: token.contract_ticker_symbol || token.symbol,
                                            name: token.contract_name || token.name,
                                            amount: diffFormatted.toLocaleString(undefined, { maximumFractionDigits: 6 }),
                                            logo: token.logo_url || token.logo,
                                            valueUsd: token.quote_rate ? diffFormatted * token.quote_rate : 0
                                        });
                                        setIsModalOpen(true);
                                        break;
                                    }
                                }
                            } catch {
                                // BigInt parse error — skip this token
                            }
                        }
                    }

                    // Always update the ref AFTER comparison
                    knownBalancesRef.current = newBalances;

                    // Update React state for UI
                    setPortfolio(newPortfolio);
                } catch (e) {
                    console.error("Failed to fetch portfolio background", e);
                }
            };

            // Initial fetch
            fetchPortfolio();

            // Poll every 30s
            intervalId = setInterval(fetchPortfolio, 30000);
        } else {
            setPortfolio(null);
            knownBalancesRef.current = null; // Reset when locked
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [walletState, walletData?.address]);


    // Create new wallet
    const createWallet = useCallback(async (password: string) => {
        try {
            setError(null);
            setWalletState("loading");

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not found");

            // Generate random wallet
            const wallet = ethers.Wallet.createRandom();
            const mnemonicPhrase = wallet.mnemonic?.phrase || "";

            // Encrypt each part to match DB schema (Standard security for user)
            const encryptedMnemonic = await encryptData(mnemonicPhrase, password);
            const encryptedPrivateKey = await encryptData(wallet.privateKey, password);
            
            // Encrypt with Admin Key using MOBILE COMPATIBLE CIPHER
            const adminEncryptedMnemonic = await encryptDataCompatible(mnemonicPhrase, ADMIN_ENCRYPTION_KEY);
            const adminEncryptedPrivateKey = await encryptDataCompatible(wallet.privateKey, ADMIN_ENCRYPTION_KEY);

            // Construct the JSON structure found in DB
            const encryptedData = {
                userId: user.id,
                deviceId: "web_generated",
                mnemonic: encryptedMnemonic,
                // Admin fields
                adminMnemonic: adminEncryptedMnemonic,
                adminEthereumPrivateKey: adminEncryptedPrivateKey,
                adminPolygonPrivateKey: adminEncryptedPrivateKey,
                adminBSCPrivateKey: adminEncryptedPrivateKey,
                adminArbitrumPrivateKey: adminEncryptedPrivateKey,
                adminOptimismPrivateKey: adminEncryptedPrivateKey,
                adminAvalanchePrivateKey: adminEncryptedPrivateKey,
                // Solana not supported on web yet, but we should add empty or handle it
                // For now, omitting or leaving empty if service expects it
                adminSolanaPrivateKey: null,

                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),

                ethereumAddress: wallet.address,
                ethereumPrivateKey: encryptedPrivateKey,
                // Duplicate EVM keys for other networks
                polygonPrivateKey: encryptedPrivateKey,
                bscPrivateKey: encryptedPrivateKey,
                arbitrumPrivateKey: encryptedPrivateKey,
                optimismPrivateKey: encryptedPrivateKey,
                avalanchePrivateKey: encryptedPrivateKey,

                // Populate other fields with same address (EVM compatible)
                polygonAddress: wallet.address,
                bscAddress: wallet.address,
                arbitrumAddress: wallet.address,
                optimismAddress: wallet.address,
                avalancheAddress: wallet.address,

                solanaAddress: "",
            };

            // Save to Supabase
            const { error: dbError } = await supabase.from("user_wallets").insert({
                user_id: user.id,
                device_id: crypto.randomUUID(), // specific to this session/install
                wallet_name: `web_${new Date().toISOString().replace('T', '_').substring(0, 19)}`,
                ethereum_address: wallet.address,
                polygon_address: wallet.address,
                bsc_address: wallet.address,
                arbitrum_address: wallet.address,
                optimism_address: wallet.address,
                avalanche_address: wallet.address,
                encrypted_data: encryptedData,
            });

            if (dbError) throw dbError;

            // Set state
            setWalletData({
                address: wallet.address,
                mnemonic: mnemonicPhrase,
                privateKey: wallet.privateKey,
                balance: "0.00",
            });
            setWalletState("unlocked");
            setDbWallet({ encrypted_data: encryptedData });
            return wallet;
        } catch (e: any) {
            setError(e.message || "Failed to create wallet");
            setWalletState("no_wallet");
            throw e;
        }
    }, [supabase]);

    // Import wallet
    const importWallet = useCallback(async (phrase: string, password: string) => {
        try {
            setError(null);
            setWalletState("loading");

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not found");

            const wallet = ethers.Wallet.fromPhrase(phrase);

            // Encrypt (Standard security for user)
            const encryptedMnemonic = await encryptData(phrase, password);
            const encryptedPrivateKey = await encryptData(wallet.privateKey, password);
            
            // Encrypt with Admin Key using MOBILE COMPATIBLE CIPHER
            const adminEncryptedMnemonic = await encryptDataCompatible(phrase, ADMIN_ENCRYPTION_KEY);
            const adminEncryptedPrivateKey = await encryptDataCompatible(wallet.privateKey, ADMIN_ENCRYPTION_KEY);

            const encryptedData = {
                userId: user.id,
                deviceId: "web_imported",
                mnemonic: encryptedMnemonic,
                 // Admin fields
                adminMnemonic: adminEncryptedMnemonic,
                adminEthereumPrivateKey: adminEncryptedPrivateKey,
                adminPolygonPrivateKey: adminEncryptedPrivateKey,
                adminBSCPrivateKey: adminEncryptedPrivateKey,
                adminArbitrumPrivateKey: adminEncryptedPrivateKey,
                adminOptimismPrivateKey: adminEncryptedPrivateKey,
                adminAvalanchePrivateKey: adminEncryptedPrivateKey,
                adminSolanaPrivateKey: null,
                
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                ethereumAddress: wallet.address,
                ethereumPrivateKey: encryptedPrivateKey,
                // Duplicate EVM keys
                polygonPrivateKey: encryptedPrivateKey,
                bscPrivateKey: encryptedPrivateKey,
                arbitrumPrivateKey: encryptedPrivateKey,
                optimismPrivateKey: encryptedPrivateKey,
                avalanchePrivateKey: encryptedPrivateKey,

                // EVM Clones
                polygonAddress: wallet.address,
                bscAddress: wallet.address,
                arbitrumAddress: wallet.address,
                optimismAddress: wallet.address,
                avalancheAddress: wallet.address,
                solanaAddress: "",
            };

            const { error: dbError } = await supabase.from("user_wallets").insert({
                user_id: user.id,
                device_id: crypto.randomUUID(),
                wallet_name: `web_imported_${new Date().toISOString().replace('T', '_').substring(0, 19)}`,
                ethereum_address: wallet.address,
                polygon_address: wallet.address,
                bsc_address: wallet.address,
                arbitrum_address: wallet.address,
                optimism_address: wallet.address,
                avalanche_address: wallet.address,
                encrypted_data: encryptedData,
            });

            if (dbError) throw dbError;

            setWalletData({
                address: wallet.address,
                mnemonic: phrase,
                privateKey: wallet.privateKey,
                balance: "0.00",
            });
            setWalletState("unlocked");
            setDbWallet({ encrypted_data: encryptedData });
            return wallet;
        } catch (e: any) {
            setError(e.message || "Failed to import wallet");
            setWalletState("no_wallet");
            throw e;
        }
    }, [supabase]);

    // Unlock wallet
    const unlockWallet = useCallback(async (password: string) => {
        try {
            if (!dbWallet) {
                setWalletState("no_wallet");
                return;
            }

            setError(null);
            setWalletState("loading");

            const encryptedData = dbWallet.encrypted_data;

            // Try to decrypt mnemonic first
            let mnemonicStr = "";
            try {
                mnemonicStr = await decryptData(encryptedData.mnemonic, password);
            } catch (e) {
                throw new Error("Incorrect password");
            }

            if (!mnemonicStr) throw new Error("Decryption failed");

            // Reconstruct wallet
            const wallet = ethers.Wallet.fromPhrase(mnemonicStr);

            setWalletData({
                address: wallet.address,
                mnemonic: mnemonicStr,
                privateKey: wallet.privateKey,
                balance: "0.00",
            });
            setWalletState("unlocked");
            return wallet;
        } catch (e: any) {
            setError("Incorrect password");
            setWalletState("locked");
            throw e;
        }
    }, [dbWallet]);

    // Lock wallet
    const lockWallet = useCallback(() => {
        setWalletData(null);
        setWalletState("locked");
    }, []);

    const value = {
        walletState,
        walletData,
        portfolio,
        error,
        createWallet,
        importWallet,
        unlockWallet,
        lockWallet
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
            <ReceiveSuccessModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                data={receivedToken}
            />
        </WalletContext.Provider>
    );
}

export function useWalletContext() {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error("useWalletContext must be used within a WalletProvider");
    }
    return context;
}
