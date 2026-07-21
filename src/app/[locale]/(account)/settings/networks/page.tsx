"use client";

import { useState } from "react";
import { 
  Plus, 
  ChevronRight, 
  Search,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

const NETWORKS = [
  { id: 1, name: "Ethereum Mainnet", chainId: "1", symbol: "ETH", status: "Connected", primary: true, icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
  { id: 2, name: "BNB Smart Chain", chainId: "56", symbol: "BNB", status: "Connected", primary: false, icon: "https://cryptologos.cc/logos/bnb-bnb-logo.png" },
  { id: 3, name: "Polygon Mainnet", chainId: "137", symbol: "MATIC", status: "Connected", primary: false, icon: "https://cryptologos.cc/logos/polygon-matic-logo.png" },
  { id: 4, name: "Arbitrum One", chainId: "42161", symbol: "ETH", status: "Connected", primary: false, icon: "https://cryptologos.cc/logos/arbitrum-arb-logo.png" },
  { id: 5, name: "Optimism", chainId: "10", symbol: "ETH", status: "Connected", primary: false, icon: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png" },
  { id: 6, name: "Avalanche C-Chain", chainId: "43114", symbol: "AVAX", status: "Connected", primary: false, icon: "https://cryptologos.cc/logos/avalanche-avax-logo.png" },
];

export default function NetworksSettingsPage() {
  const t = useTranslations("Settings.Networks");
  const [search, setSearch] = useState("");

  const filteredNetworks = NETWORKS.filter(n => 
    n.name.toLowerCase().includes(search.toLowerCase()) || 
    n.symbol.toLowerCase().includes(search.toLowerCase()) ||
    n.chainId.includes(search)
  );

  return (
    <div className="max-w-3xl mx-auto space-y-7 animate-in fade-in-50 slide-in-from-bottom-2 duration-500 pb-10">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{t("title")}</h2>
          <p className="text-zinc-500 text-sm mt-2">
            {t("subtitle")}
          </p>
        </div>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-zinc-950 font-semibold rounded-lg px-5 h-10 shadow-lg shadow-yellow-500/10 transition-colors flex items-center gap-2">
           <Plus className="h-4 w-4" />
           {t("add_network")}
        </Button>
      </section>

      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-yellow-400 transition-colors" />
        <Input 
          placeholder={t("search_placeholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 h-11 bg-zinc-900/50 border-white/5 focus:border-yellow-400/50 focus:ring-yellow-400/20 rounded-lg text-sm transition-all"
        />
      </div>

      {/* Network List */}
      <section className="space-y-4 pt-4">
        <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">{t("active_networks", { count: filteredNetworks.length })}</h3>

        <div className="bg-zinc-900/30 border border-white/5 rounded-lg overflow-hidden divide-y divide-white/5">
          {filteredNetworks.map(network => (
            <div 
              key={network.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="h-10 w-12 rounded-lg bg-zinc-800 flex items-center justify-center border border-white/5 overflow-hidden shadow-inner group-hover:border-yellow-400/20 transition-all">
                   <img 
                    src={network.icon} 
                    alt={network.name} 
                    className="h-7 w-7 object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${network.symbol}&background=18181b&color=eab308`;
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white leading-tight">
                      {network.name}
                    </p>
                    {network.primary && (
                      <span className="text-[9px] font-black uppercase tracking-tighter bg-yellow-500/10 text-yellow-400 border border-yellow-400/20 px-1.5 py-0.5 rounded leading-none">{t("primary")}</span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
                    Chain ID: {network.chainId} • Symbol: {network.symbol}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                 <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">{t("online")}</span>
                 </div>
                 <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-600 hover:text-white">
                    <ChevronRight className="h-5 w-5" />
                 </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experimental Networks */}
      {!search && (
        <section className="space-y-4">
          <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">{t("experimental_title")}</h3>
          
          <div className="px-4 py-3 rounded-lg bg-zinc-950/30 border border-dashed border-white/10 text-center space-y-4">
             <div>
                <p className="text-sm font-bold text-white">{t("testnets_hidden")}</p>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
                   {t("testnets_desc")}
                </p>
             </div>
             <Button variant="outline" className="rounded-lg border-white/10 hover:bg-zinc-800 text-xs font-bold px-6 h-9 transition-all">
                {t("enable_dev_mode")}
             </Button>
          </div>
        </section>
      )}

      {/* Warning Card */}
      <section className="p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
         <div>
            <p className="text-sm font-bold text-white">{t("security_title")}</p>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
               {t("security_desc")}
            </p>
            <button className="text-xs text-yellow-400 font-bold hover:underline mt-2 flex items-center gap-1">
               {t("learn_more_rpc")} <ExternalLink className="h-3 w-3" />
            </button>
         </div>
      </section>
    </div>
  );
}
