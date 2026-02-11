"use client";

import { useState } from "react";
import { Copy, Check, Share2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ReceiveAddressCard() {
  const [copied, setCopied] = useState(false);
  const address = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success("Address copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 md:p-8 max-w-md mx-auto shadow-xl text-center">
      <div className="mb-6">
         <h2 className="text-2xl font-bold text-white">Receive Assets</h2>
         <p className="text-zinc-500 text-sm mt-1">Scan QR code or copy address to deposit.</p>
      </div>

      {/* Asset/Network Selector */}
      <div className="mb-8">
         <Select defaultValue="eth">
            <SelectTrigger className="w-full bg-zinc-950/50 border-zinc-800 text-white">
               <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                     <AvatarImage src="https://assets.coingecko.com/coins/images/279/small/ethereum.png" />
                     <AvatarFallback>E</AvatarFallback>
                  </Avatar>
                  <SelectValue placeholder="Select Asset" />
               </div>
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
               <SelectItem value="eth">Ethereum (ERC-20)</SelectItem>
               <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
               <SelectItem value="sol">Solana (SOL)</SelectItem>
            </SelectContent>
         </Select>
         <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-orange-400 bg-orange-400/10 py-1.5 px-3 rounded-full border border-orange-400/20">
            <Info className="h-3 w-3" />
            <span>Only send ETH or ERC-20 tokens to this address.</span>
         </div>
      </div>

      {/* QR Code Placeholder */}
      <div className="relative mx-auto w-48 h-48 bg-white p-2 rounded-xl mb-6 shadow-inner ring-4 ring-white/5">
         <div className="w-full h-full bg-zinc-900 rounded-lg flex items-center justify-center overflow-hidden">
            {/* Using a grid pattern to mimic QR code visually */}
            <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=0x71C7656EC7ab88b098defB751B7401B5f6d8976F')] bg-contain bg-no-repeat bg-center mix-blend-multiply filter contrast-125" style={{imageRendering: "pixelated"}}></div>
            {/* Fallback pattern if image fails */}
            <div className="absolute inset-0 bg-white mix-blend-screen opacity-10 pointer-events-none" />
         </div>
         {/* Center Logo */}
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white p-1 rounded-full shadow-lg">
               <Avatar className="h-8 w-8">
                  <AvatarImage src="https://assets.coingecko.com/coins/images/279/small/ethereum.png" />
               </Avatar>
            </div>
         </div>
      </div>

      {/* Address Display */}
      <div className="group relative bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 mb-6 hover:border-zinc-700 transition-colors cursor-pointer" onClick={handleCopy}>
         <p className="text-xs text-zinc-500 mb-1">Wallet Address</p>
         <p className="font-mono text-sm text-zinc-300 break-all">{address}</p>
         <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="ghost" className="h-6 w-6 text-zinc-400">
               {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            </Button>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
         <Button variant="outline" className="w-full border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white" onClick={handleCopy}>
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
         </Button>
         <Button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black">
            <Share2 className="mr-2 h-4 w-4" />
            Share
         </Button>
      </div>
    </div>
  );
}
