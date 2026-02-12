"use client";

import { useState, useEffect } from "react";
import { History, ShieldCheck, CreditCard, Lock, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConnectWalletDrawer } from "../vault/_components/connect-wallet-drawer";
import { WalletCard } from "./_components/wallet-card";
import { ActionGrid } from "./_components/action-grid";
import { TokenList } from "./_components/token-list";
import { WalletStatus } from "./_components/wallet-status";
import { useWallet } from "./_hooks/use-wallet";
import { SetupWizard } from "./_components/setup/setup-wizard";
import { toast } from "sonner";
import { getPopularCoins } from "./actions";
import { TransactionHistory } from "./_components/transaction-history";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NETWORKS = [
  { id: "all", name: "All Networks" },
  { id: 1, name: "Ethereum" },
  { id: 56, name: "BNB Chain" },
  { id: 137, name: "Polygon" },
];

export default function LenixWalletPage() {
  const { walletState, walletData, unlockWallet, lockWallet, portfolio } = useWallet();
  const [unlockPassword, setUnlockPassword] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [popularCoins, setPopularCoins] = useState<any[]>([]); 
  const [selectedChain, setSelectedChain] = useState<string | number>("all");

  // Fetch popular coins if portfolio is empty (market data mode)
  useEffect(() => {
     if (walletState === "unlocked" && portfolio && portfolio.tokens.length === 0) {
         getPopularCoins().then(setPopularCoins).catch(console.error);
     }
  }, [walletState, portfolio]);

  const isLoadingData = walletState === "loading" || (walletState === "unlocked" && !portfolio);

  // If loading, show nothing or skeleton
  if (walletState === "loading") {
    return <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
    </div>;
  }

  // If no wallet, show setup wizard
  if (walletState === "no_wallet") {
    return (
      <div className="max-w-7xl mx-auto space-y-6 pb-20">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
               <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  Lenix WalletSetup
               </h1>
               <p className="text-zinc-400 text-sm">Create or import a wallet to get started.</p>
            </div>
         </div>
         <SetupWizard onComplete={() => window.location.reload()} />
      </div>
    );
  }

  // If locked, show unlock screen
  if (walletState === "locked") {
    const handleUnlock = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsUnlocking(true);
      try {
        await unlockWallet(unlockPassword);
        toast.success("Wallet unlocked");
      } catch (e) {
        toast.error("Incorrect password");
      } finally {
        setIsUnlocking(false);
      }
    };

    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-md space-y-8 bg-zinc-900/50 p-8 rounded-2xl border border-white/5 backdrop-blur-xl">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-full bg-yellow-400/10 mb-4">
              <Lock className="h-8 w-8 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Unlock Wallet</h2>
            <p className="text-zinc-400">Enter your password to access your wallet.</p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <Input
              type="password" 
              placeholder="Enter password"
              className="bg-black/50 border-zinc-800 text-white h-12 text-lg"
              value={unlockPassword}
              onChange={(e) => setUnlockPassword(e.target.value)}
              autoFocus
            />
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium bg-yellow-400 text-black hover:bg-yellow-500"
              disabled={!unlockPassword || isUnlocking}
            >
              {isUnlocking ? "Unlocking..." : "Unlock Wallet"}
              {!isUnlocking && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Filter tokens based on chain
  const visibleTokens = portfolio?.tokens 
      ? portfolio.tokens.filter(t => selectedChain === "all" || t.chainId === selectedChain)
      : [];
      
  // Determine what to show in list: User Assets or Popular Coins
  const displayTokens = visibleTokens.length > 0 ? visibleTokens : popularCoins;
  const isMarketData = visibleTokens.length === 0 && popularCoins.length > 0;

  // Filter popular coins by chain if in market mode
  const filteredDisplayTokens = isMarketData 
      ? displayTokens.filter(t => selectedChain === "all" || t.chainId === selectedChain)
      : displayTokens;

  const currentNetworkName = NETWORKS.find(n => n.id === selectedChain)?.name || "All Networks";

  // If unlocked, show dashboard
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Lenix Wallet
              <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium tracking-wide uppercase">
                 Active
              </span>
           </h1>
           <p className="text-zinc-400 text-sm">Manage your everyday crypto spending.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
           {/* Chain Selector */}
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 hover:text-white min-w-[140px] justify-between">
                   {currentNetworkName}
                   <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                {NETWORKS.map(net => (
                   <DropdownMenuItem 
                      key={net.id} 
                      onClick={() => setSelectedChain(net.id)}
                      className="text-zinc-300 focus:text-white focus:bg-zinc-800 cursor-pointer"
                   >
                      {net.name}
                   </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
           </DropdownMenu>

           <Button variant="outline" className="flex-1 sm:flex-none border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 hover:text-white">
              <History className="mr-2 h-4 w-4" />
              History
           </Button>
           <div className="flex-1 sm:flex-none">
             <ConnectWalletDrawer />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Main Column */}
         <div className="lg:col-span-2 space-y-6">
            <WalletCard walletData={walletData} lockWallet={lockWallet} balance={portfolio?.totalBalanceUsd} />
            <ActionGrid />
            <TokenList 
                tokens={filteredDisplayTokens} 
                isLoading={isLoadingData} 
                isMarketData={isMarketData} 
            />
         </div>

         {/* Sidebar Column */}
         <div className="space-y-6">
            <WalletStatus />
            
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 backdrop-blur-sm">
                <TransactionHistory transactions={portfolio?.transactions || []} isLoading={isLoadingData} />
            </div>

            {/* Promo / Upgrade Card */}
            <div className="relative overflow-hidden rounded-2xl border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 to-transparent p-6">
               <div className="absolute top-0 right-0 p-3 opacity-20">
                  <CreditCard className="h-24 w-24 text-yellow-400 rotate-12" />
               </div>
               <h3 className="text-lg font-bold text-yellow-400 mb-2 relative z-10">Get the Lenix Card</h3>
               <p className="text-sm text-yellow-100/80 mb-4 relative z-10">
                  Spend your crypto anywhere with zero fees.
               </p>
               <Button size="sm" className="bg-yellow-500 text-black hover:bg-yellow-600 w-full relative z-10 font-medium border-0">
                  Order Card
               </Button>
            </div>
         </div>
      </div>
    </div>
  );
}
