"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dynamic from "next/dynamic";

// Dynamically import confetti to avoid SSR issues
const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

export interface ReceivedTokenData {
  symbol: string;
  name: string;
  amount: string;
  logo?: string;
  valueUsd?: number;
}

interface ReceiveSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ReceivedTokenData | null;
}

export function ReceiveSuccessModal({ isOpen, onClose, data }: ReceiveSuccessModalProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {isOpen && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />}
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-white p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/5 p-6 flex flex-col items-center justify-center pt-10 pb-8 relative">
           <button 
             onClick={onClose}
             className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors"
           >
             <X className="h-4 w-4 text-zinc-400" />
           </button>
           
           <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/20 ring-4 ring-green-500/20">
              <Check className="h-8 w-8 text-black font-bold" strokeWidth={3} />
           </div>
           
           <DialogTitle className="text-2xl font-bold text-center mb-1">Payment Received</DialogTitle>
           <DialogDescription className="text-zinc-400 text-center">
              You have successfully received assets.
           </DialogDescription>
        </div>

        <div className="p-6 space-y-6">
           {/* Amount Display */}
           <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                 <span className="text-4xl font-bold text-white tracking-tight">{data.amount}</span>
                 <span className="text-2xl font-medium text-zinc-400">{data.symbol}</span>
              </div>
              {data.valueUsd !== undefined && (
                 <p className="text-zinc-500 font-medium">≈ ${data.valueUsd.toFixed(2)} USD</p>
              )}
           </div>

           {/* Token Details Card */}
           <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
              <Avatar className="h-10 w-10 border border-zinc-800">
                 <AvatarImage src={data.logo} />
                 <AvatarFallback>{data.symbol?.[0] || "?"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                 <p className="font-semibold text-white truncate">{data.name}</p>
                 <p className="text-xs text-zinc-500">Asset</p>
              </div>
              <div className="text-right">
                 <p className="font-medium text-white text-sm">Confirmed</p>
                 <p className="text-xs text-emerald-400">Success</p>
              </div>
           </div>

           <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold h-11" onClick={onClose}>
              Done
           </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
