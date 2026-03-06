"use client";

import { useState } from "react";
import { Wallet, Gift, CheckCircle, Loader2 } from "lucide-react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";

export default function AirdropOngoing() {
    const { open } = useAppKit();
    const { address, isConnected } = useAppKitAccount();
    const [claimStatus, setClaimStatus] = useState<"idle" | "claiming" | "claimed">("idle");

    const handleClaim = () => {
        setClaimStatus("claiming");
        // Simulate claim delay
        setTimeout(() => {
            setClaimStatus("claimed");
        }, 2000);
    };

    return (
        <section className="py-20 px-4 bg-black relative" id="claim-section">
            <div className="max-w-4xl mx-auto relative z-10">
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-[40px] border border-white/10 p-1 md:p-2 shadow-[0_0_50px_-20px_rgba(250,204,21,0.3)]">
                    <div className="bg-black/50 rounded-[32px] p-8 md:p-12 border border-white/5 backdrop-blur-xl relative overflow-hidden">
                        
                        {/* Glow effects inside card */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-[80px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-[80px] pointer-events-none" />

                        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                            
                            <div className="text-center md:text-left space-y-4 flex-1">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider mb-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Live Event
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-white">
                                    Flash <span className="text-yellow-400">Giveaway</span>
                                </h2>
                                <p className="text-gray-400 text-lg">
                                    Connect your wallet now to check eligibility and instantly claim your USDT reward. Limited time offer for early adopters.
                                </p>
                                
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                                     <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                                         <div className="text-xs text-gray-500 uppercase tracking-wide">Reward</div>
                                         <div className="text-xl font-bold text-white">50 USDT</div>
                                     </div>
                                     <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                                         <div className="text-xs text-gray-500 uppercase tracking-wide">Network</div>
                                         <div className="text-xl font-bold text-white">TRC-20</div>
                                     </div>
                                     <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                                         <div className="text-xs text-gray-500 uppercase tracking-wide">Remaining</div>
                                         <div className="text-xl font-bold text-yellow-400">14%</div>
                                     </div>
                                </div>
                            </div>

                            <div className="w-full md:w-auto min-w-[300px]">
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                                    {!isConnected && (
                                        <div className="space-y-6 text-center">
                                            <div className="w-20 h-20 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-400/20">
                                                <Wallet className="w-10 h-10 text-yellow-400" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white">Connect to Claim</h3>
                                            <button 
                                                onClick={() => open()}
                                                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-yellow-400/20 flex items-center justify-center gap-2"
                                            >
                                                Connect Wallet
                                            </button>
                                            <p className="text-xs text-gray-500">Supported: MetaMask, TrustWallet, Phantom</p>
                                        </div>
                                    )}

                                    {isConnected && claimStatus === "idle" && (
                                        <div className="space-y-6 text-center">
                                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                                                <CheckCircle className="w-10 h-10 text-green-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1">Wallet Connected</h3>
                                                <p className="text-sm text-gray-400 font-mono">
                                                    {address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : ""}
                                                </p>
                                            </div>
                                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                                                <p className="text-green-400 text-sm font-bold">You are eligible!</p>
                                            </div>
                                            <button 
                                                onClick={handleClaim}
                                                className="w-full bg-white text-black hover:bg-gray-200 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                                            >
                                                Claim 50 USDT
                                            </button>
                                        </div>
                                    )}

                                     {isConnected && claimStatus === "claiming" && (
                                        <div className="space-y-6 text-center py-8">
                                            <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mx-auto" />
                                            <div className="text-white font-medium">Processing Transaction...</div>
                                            <p className="text-xs text-gray-500">Please confirm inside your wallet</p>
                                        </div>
                                    )}

                                    {isConnected && claimStatus === "claimed" && (
                                        <div className="space-y-6 text-center">
                                            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(250,204,21,0.4)] animate-bounce">
                                                <Gift className="w-10 h-10 text-black" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-white mb-2">Success!</h3>
                                                <p className="text-gray-400">50 USDT has been sent to your wallet.</p>
                                            </div>
                                            <button 
                                                onClick={() => open()}
                                                className="text-sm text-yellow-400 hover:text-yellow-300 font-medium underline"
                                            >
                                                Disconnect / Switch Wallet
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
