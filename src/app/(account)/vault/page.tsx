"use client";

import { Plus, ArrowUpRight, ArrowDownLeft, ShieldCheck, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectWalletDrawer } from "./_components/connect-wallet-drawer";
import { VaultCard } from "./_components/vault-card";
import { AssetList } from "./_components/asset-list";
import { SecurityStatus } from "./_components/security-status";

export default function VaultPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* Header Actions - Mobile optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              My Vault
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium tracking-wide uppercase">
                 Active
              </span>
           </h1>
           <p className="text-zinc-400 text-sm">Manage your secured digital assets.</p>
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
            <VaultCard />
            
            {/* Quick Actions Bar */}
            <div className="grid grid-cols-4 gap-2 sm:flex sm:items-center sm:gap-6">
               <ActionButton icon={Plus} label="Deposit" accent="text-emerald-400" />
               <ActionButton icon={ArrowUpRight} label="Withdraw" />
               <ActionButton icon={ArrowDownLeft} label="Swap" />
               <ActionButton icon={ShieldCheck} label="Audit" accent="text-yellow-400" />
            </div>

            <AssetList />
         </div>

         {/* Sidebar Column */}
         <div className="space-y-6">
            <SecurityStatus />
            
            {/* Promo / Upgrade Card */}
            <div className="relative overflow-hidden rounded-2xl border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 to-transparent p-6">
               <div className="absolute top-0 right-0 p-3 opacity-20">
                  <ShieldCheck className="h-24 w-24 text-yellow-400 rotate-12" />
               </div>
               <h3 className="text-lg font-bold text-yellow-400 mb-2 relative z-10">Get Premium Protection</h3>
               <p className="text-sm text-yellow-100/80 mb-4 relative z-10">
                  Upgrade to Hardware Vault integration for maximum security.
               </p>
               <Button size="sm" className="bg-yellow-400 text-black hover:bg-yellow-500 w-full relative z-10 font-medium">
                  Learn More
               </Button>
            </div>
         </div>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, accent }: any) {
   return (
      <button className="flex flex-col items-center justify-center gap-2 min-w-[70px] group">
         <div className={`p-4 rounded-full bg-zinc-900 border border-white/10 group-hover:border-yellow-400/50 group-hover:bg-zinc-800 transition-all ${accent || "text-white"}`}>
            <Icon className="h-6 w-6" />
         </div>
         <span className="text-xs font-medium text-zinc-500 group-hover:text-white transition-colors">{label}</span>
      </button>
   )
}
