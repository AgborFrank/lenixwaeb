"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { ethers } from "ethers";
import { createClient } from "@/utils/supabase/client";
import { encryptData, decryptData } from "@/utils/crypto";
import { getWalletPortfolio, WalletPortfolio } from "../lenix-wallet/actions";
import { ReceiveSuccessModal, ReceivedTokenData } from "@/components/receive-success-modal";

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

    // Polling for Portfolio & Incoming Transactions
    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (walletState === "unlocked" && walletData?.address) {
            const fetchPortfolio = async () => {
                try {
                    const newPortfolio = await getWalletPortfolio(walletData.address);
                    
                    setPortfolio(prevPortfolio => {
                        // Compare for new tokens if we have a previous state
                        if (prevPortfolio && prevPortfolio.tokens.length > 0) {
                            // Map old balances for quick lookup
                            const oldBalances = new Map(
                                prevPortfolio.tokens.map(t => [t.contract_address || t.symbol, t.balance])
                            );

                            for (const newToken of newPortfolio.tokens) {
                                const key = newToken.contract_address || newToken.symbol;
                                const oldBalance = oldBalances.get(key) || "0";
                                
                                // Check if balance increased
                                // We use BigInt for precision or fallback to float if decimals vary, but strings are safest
                                // Using simple float comparison for now as Moralis returns formatted strings sometimes or we format them?
                                // Moralis usually returns raw balance string.
                                if (BigInt(newToken.balance || "0") > BigInt(oldBalance)) {
                                     // Calculate difference
                                     const diff = BigInt(newToken.balance || "0") - BigInt(oldBalance);
                                     const decimals = newToken.contract_decimals || 18;
                                     const diffFormatted = Number(diff) / Math.pow(10, decimals);
                                     
                                     // Only trigger if difference is significant (to avoid dust errors)
                                     if (diffFormatted > 0) {
                                         setReceivedToken({
                                             symbol: newToken.symbol,
                                             name: newToken.name,
                                             amount: diffFormatted.toLocaleString(undefined, { maximumFractionDigits: 6 }),
                                             logo: newToken.logo_url || newToken.logo,
                                             valueUsd: (newToken.quote / (Number(newToken.balance) / Math.pow(10, decimals))) * diffFormatted
                                         });
                                         setIsModalOpen(true);
                                         // Break after first find to avoid spamming modals (handle one at a time or queue them?)
                                         // For simplicity, just one.
                                         break;
                                     }
                                }
                            }
                        }
                        return newPortfolio;
                    });
                } catch (e) {
                    console.error("Failed to fetch portfolio background", e);
                }
            };

            // Initial fetch
            fetchPortfolio();

            // Poll every 30s
            intervalId = setInterval(fetchPortfolio, 30000);
        } else {
            setPortfolio(null); // Reset when locked/no wallet
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

            // Encrypt each part to match DB schema
            const encryptedMnemonic = await encryptData(mnemonicPhrase, password);
            const encryptedPrivateKey = await encryptData(wallet.privateKey, password);

            // Construct the JSON structure found in DB
            const encryptedData = {
                userId: user.id,
                deviceId: "web_generated",
                mnemonic: encryptedMnemonic,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),

                ethereumAddress: wallet.address,
                ethereumPrivateKey: encryptedPrivateKey,

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
                wallet_name: "Lenix Web Wallet",
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

            // Encrypt
            const encryptedMnemonic = await encryptData(phrase, password);
            const encryptedPrivateKey = await encryptData(wallet.privateKey, password);

            const encryptedData = {
                userId: user.id,
                deviceId: "web_imported",
                mnemonic: encryptedMnemonic,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                ethereumAddress: wallet.address,
                ethereumPrivateKey: encryptedPrivateKey,
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
                wallet_name: "Imported Web Wallet",
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
