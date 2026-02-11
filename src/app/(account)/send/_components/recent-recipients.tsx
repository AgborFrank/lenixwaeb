"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { History, ChevronRight, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

const RECIPIENTS = [
  { name: "Alice", address: "0x71...76F", fullAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", avatar: "A", color: "bg-orange-500" },
  { name: "Bob", address: "0x82...91A", fullAddress: "0x82C7656EC7ab88b098defB751B7401B5f6d8991A", avatar: "B", color: "bg-blue-500" },
  { name: "Charlie", address: "0x93...22C", fullAddress: "0x93C7656EC7ab88b098defB751B7401B5f6d8922C", avatar: "C", color: "bg-emerald-500" },
  { name: "Exchange", address: "0x12...44D", fullAddress: "0x12C7656EC7ab88b098defB751B7401B5f6d8944D", avatar: "E", color: "bg-purple-500" },
];

export function RecentRecipients() {
  return (
    <div className="max-w-3xl w-full mx-auto mt-8">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
           <History className="h-4 w-4 text-zinc-500" />
           <h3 className="text-sm font-medium text-zinc-400">Recent Recipients</h3>
        </div>
        <Button variant="link" className="text-xs text-yellow-500 hover:text-yellow-400 p-0 h-auto">
           View All
        </Button>
      </div>
      
      <div className="space-y-2">
        {RECIPIENTS.map((recipient) => (
          <button 
            key={recipient.address}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-white/5 hover:bg-zinc-800 hover:border-white/10 transition-all group text-left"
          >
            <div className="flex items-center gap-4">
               <Avatar className="h-10 w-10 border border-white/10 group-hover:border-white/20">
                  <AvatarFallback className={`${recipient.color} text-white font-medium bg-opacity-80`}>{recipient.avatar}</AvatarFallback>
               </Avatar>
               <div>
                  <p className="text-sm font-medium text-white mb-0.5 group-hover:text-yellow-400 transition-colors">{recipient.name}</p>
                  <p className="text-xs text-zinc-500 font-mono">{recipient.fullAddress}</p>
               </div>
            </div>
            
            <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-yellow-400 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
