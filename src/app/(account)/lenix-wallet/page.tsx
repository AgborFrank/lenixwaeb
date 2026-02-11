"use client";

import { History, ShieldCheck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectWalletDrawer } from "../vault/_components/connect-wallet-drawer";
import { WalletCard } from "./_components/wallet-card";
import { ActionGrid } from "./_components/action-grid";
import { TokenList } from "./_components/token-list";
import { WalletStatus } from "./_components/wallet-status";

export default function LenixWalletPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* Header Actions - Mobile optimized */}
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
           <Button variant="outline" className="flex-1 sm:flex-none border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 hover:text-white">
              <History className="mr-2 h-4 w-4" />
              History
           </Button>
           {/* Integrating the Drawer as the primary action */}
           <div className="flex-1 sm:flex-none">
             <ConnectWalletDrawer />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Main Column */}
         <div className="lg:col-span-2 space-y-6">
            <WalletCard />
            <ActionGrid />
            <TokenList />
         </div>

         {/* Sidebar Column */}
         <div className="space-y-6">
            <WalletStatus />
            
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
