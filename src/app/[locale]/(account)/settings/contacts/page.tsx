"use client";

import { useState } from "react";
import { 
  Search, 
  MoreVertical, 
  UserPlus,
  ChevronRight,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const DEMO_CONTACTS = [
  { id: 1, name: "Frank Agbor", address: "0x742d...44e", initial: "FA", color: "bg-yellow-500 text-zinc-950", favorite: true },
  { id: 2, name: "Sarah Connor", address: "0x123a...bc9", initial: "SC", color: "bg-zinc-700", favorite: true },
  { id: 3, name: "Vitalik Buterin", address: "0xab58...64e", initial: "VB", color: "bg-zinc-700", favorite: false },
  { id: 4, name: "Satoshi Nakamoto", address: "1A1zP1...pPx", initial: "SN", color: "bg-zinc-700", favorite: false },
  { id: 5, name: "Binance Wallet", address: "0x3f5c...921", initial: "BW", color: "bg-yellow-500 text-zinc-950", favorite: false },
];

export default function ContactsSettingsPage() {
  const t = useTranslations("Settings.Contacts");
  const [search, setSearch] = useState("");

  const filteredContacts = DEMO_CONTACTS.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500 pb-10">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{t("title")}</h2>
          <p className="text-zinc-500 text-sm mt-2">
            {t("subtitle")}
          </p>
        </div>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-zinc-950 font-semibold rounded-lg px-5 h-10 shadow-lg shadow-yellow-500/10 transition-all active:scale-95 flex items-center gap-2">
           <UserPlus className="h-4 w-4" />
           {t("add_contact")}
        </Button>
      </section>

      {/* Search & Tabs */}
      <div className="space-y-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-yellow-400 transition-colors" />
          <Input 
            placeholder={t("search_placeholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-11 bg-zinc-900/50 border-white/5 focus:border-yellow-400/50 focus:ring-yellow-400/20 rounded-lg text-sm transition-all"
          />
        </div>

        <div className="flex gap-2 p-1 rounded-xl bg-zinc-950/50 border border-white/5 w-fit">
           <Button variant="ghost" size="sm" className="text-xs font-semibold px-3 py-1 h-8 rounded-lg bg-yellow-500 text-zinc-950 hover:bg-yellow-600 hover:text-zinc-950">{t("all")}</Button>
           <Button variant="ghost" size="sm" className="text-xs font-bold px-4 py-1.5 h-8 rounded-lg text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300">{t("favorites")}</Button>
           <Button variant="ghost" size="sm" className="text-xs font-bold px-4 py-1.5 h-8 rounded-lg text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300">{t("recent")}</Button>
        </div>
      </div>

      {/* Favorites */}
      {!search && (
        <section className="space-y-4">
          <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">{t("favorites")}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DEMO_CONTACTS.filter(c => c.favorite).map(contact => (
              <div 
                key={contact.id}
                className="px-4 py-3 rounded-lg bg-zinc-900/30 border border-white/5 hover:border-yellow-400/20 hover:bg-yellow-500/5 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <Avatar className="h-10 w-10 border-2 border-zinc-800 shadow-lg">
                    <AvatarFallback className={cn("text-white font-bold", contact.color)}>
                      {contact.initial}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-600 hover:text-white">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-yellow-400 transition-colors">{contact.name}</p>
                  <p className="text-xs font-mono text-zinc-500 mt-1 truncate">{contact.address}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact List */}
      <section className="space-y-4 pt-4">
        <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">{t("all_contacts", { count: filteredContacts.length })}</h3>

        <div className="bg-zinc-900/30 border border-white/5 rounded-lg overflow-hidden divide-y divide-white/5">
          {filteredContacts.map(contact => (
            <div 
              key={contact.id}
              className="flex items-center justify-between p-4 hover:bg-white/5 transition-all group"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <Avatar className="h-11 w-11 border-2 border-zinc-800 shadow-md">
                   <AvatarFallback className={cn("text-white font-bold", contact.color)}>
                      {contact.initial}
                   </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white leading-tight group-hover:text-yellow-400 transition-colors">
                    {contact.name}
                  </p>
                  <p className="text-xs font-mono text-zinc-500 mt-1 truncate">{contact.address}</p>
                </div>
              </div>
              
              <ChevronRight className="h-4 w-4 text-zinc-600" />
            </div>
          ))}

          {filteredContacts.length === 0 && (
            <div className="p-10 text-center space-y-4">
               <div className="p-4 rounded-full bg-zinc-800/50 w-fit mx-auto">
                  <User className="h-8 w-8 text-zinc-600" />
               </div>
               <div>
                  <p className="text-sm font-bold text-white">{t("no_contacts")}</p>
                  <p className="text-xs text-zinc-500 mt-1">{t("no_contacts_desc")}</p>
               </div>
               <Button 
                variant="outline" 
                className="rounded-lg border-white/10 hover:bg-zinc-800 text-xs font-semibold mt-3"
                onClick={() => setSearch("")}
               >
                  {t("clear_search")}
               </Button>
            </div>
          )}
        </div>
      </section>

      {/* Info Card */}
      <section className="p-4 rounded-lg bg-zinc-900/50 border border-white/5">
         <div>
            <p className="text-sm font-bold text-white">{t("info_title")}</p>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
               {t("info_desc")}
            </p>
         </div>
      </section>
    </div>
  );
}
