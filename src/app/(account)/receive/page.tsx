"use client";

import { ArrowDownToLine } from "lucide-react";
import { ReceiveAddressCard } from "./_components/receive-address-card";

export default function ReceivePage() {
  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-8">
      
      {/* Page Header */}
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
             <ArrowDownToLine className="h-6 w-6" />
          </div>
          Receive Assets
        </h1>
        <p className="text-zinc-400 text-sm mt-1 ml-1">
          Get your unique address to receive payments.
        </p>
      </div>

      {/* Content */}
      <div className="flex justify-center pt-8">
        <ReceiveAddressCard />
      </div>

      <div className="text-center max-w-md mx-auto">
         <p className="text-xs text-zinc-500">
            For security, please verify the network matches exactly before depositing. 
            Sent assets cannot be recovered if the wrong network is used.
         </p>
      </div>
    </div>
  );
}
