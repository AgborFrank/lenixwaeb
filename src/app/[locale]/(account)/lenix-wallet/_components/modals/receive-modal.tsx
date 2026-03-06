"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

export function ReceiveModal({ isOpen, onClose, address }: ReceiveModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success("Address copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Receive Assets</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          <div className="p-4 bg-white rounded-xl">
             <div className="w-48 h-48 bg-white flex items-center justify-center overflow-hidden relative">
                <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${address}&bgcolor=ffffff&color=000000&margin=0`}
                    alt="Wallet Address QR Code"
                    className="w-full h-full object-contain mix-blend-multiply"
                    style={{ imageRendering: "pixelated" }}
                />
             </div>
          </div>

          <div className="text-center space-y-1">
             <p className="text-zinc-400 text-sm">Your Wallet Address</p>
             <p className="text-xs text-zinc-500">Supports ETH, BSC, Polygon, Arbitrum, Optimism</p>
          </div>

          <div className="w-full relative">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 pr-12 font-mono text-sm text-center truncate select-all">
                {address}
            </div>
            <Button
                size="icon"
                variant="ghost" 
                className="absolute right-1 top-1 h-8 w-8 text-zinc-400 hover:text-white"
                onClick={handleCopy}
            >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="p-3 rounded-lg bg-yellow-400/10 border border-yellow-400/20 text-yellow-400/90 text-xs text-center w-full">
            Send only supported tokens to this address. Sending unsupported tokens may result in permanent loss.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
