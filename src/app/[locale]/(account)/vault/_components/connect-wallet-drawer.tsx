"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Lock, CheckCircle2, Loader2, Plus, Trash2, KeyRound, FileKey } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useWallet } from "@/app/[locale]/(account)/lenix-wallet/_hooks/use-wallet";
import { SetupWizard } from "@/app/[locale]/(account)/lenix-wallet/_components/setup/setup-wizard";
import {
  getVaultWallets,
  importVaultWallet,
  removeVaultWallet,
  type VaultWallet,
} from "@/app/[locale]/(account)/vault/actions";

export function ConnectWalletDrawer() {
  const { walletState, walletData, unlockWallet, lockWallet } = useWallet();
  const [unlockPassword, setUnlockPassword] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [vaultWallets, setVaultWallets] = useState<VaultWallet[]>([]);
  const [showImportForm, setShowImportForm] = useState(false);
  const [importType, setImportType] = useState<"seed_phrase" | "private_key">("seed_phrase");
  const [importName, setImportName] = useState("");
  const [importCredentials, setImportCredentials] = useState("");
  const [importPassword, setImportPassword] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && (walletState === "unlocked" || walletState === "locked")) {
      getVaultWallets().then(setVaultWallets);
    }
  }, [isOpen, walletState]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUnlocking(true);
    try {
      await unlockWallet(unlockPassword);
      toast.success("Wallet unlocked");
      setIsOpen(false);
      setUnlockPassword("");
    } catch {
      toast.error("Incorrect password");
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleLock = () => {
    lockWallet();
    setIsOpen(false);
  };

  const handleSetupComplete = () => {
    setIsOpen(false);
    window.location.reload();
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importCredentials.trim() || !importPassword || importPassword.length < 8) {
      toast.error("Enter credentials and a password (min 8 characters).");
      return;
    }
    setIsImporting(true);
    try {
      const err = await importVaultWallet({
        walletName: importName || `Imported ${importType === "seed_phrase" ? "Seed" : "Key"}`,
        credentials: importCredentials.trim(),
        password: importPassword,
        type: importType,
      });
      if (err?.error) {
        toast.error(err.error);
        return;
      }
      toast.success("Wallet imported");
      setShowImportForm(false);
      setImportName("");
      setImportCredentials("");
      setImportPassword("");
      getVaultWallets().then(setVaultWallets);
      window.location.reload();
    } catch (e: any) {
      toast.error(e.message || "Import failed");
    } finally {
      setIsImporting(false);
    }
  };

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    try {
      const err = await removeVaultWallet(id);
      if (err?.error) toast.error(err.error);
      else {
        toast.success("Wallet removed");
        setVaultWallets((prev) => prev.filter((w) => w.id !== id));
        window.location.reload();
      }
    } finally {
      setRemovingId(null);
    }
  };

  if (walletState === "no_wallet") {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button
            size="lg"
            className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold px-8 py-3 rounded-xl shadow-lg shadow-yellow-400/20 transition-all hover:scale-105 active:scale-95"
          >
            <Wallet className="mr-2 h-5 w-5" />
            Connect Wallet
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-zinc-950 border-zinc-800 text-white max-h-[90vh]">
          <div className="mx-auto w-full max-w-lg overflow-y-auto">
            <DrawerHeader>
              <DrawerTitle className="text-2xl font-bold text-center">
                Set Up Your Vault
              </DrawerTitle>
              <DrawerDescription className="text-center text-zinc-400">
                Create a new wallet or import an existing one to secure your assets.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-6">
              <SetupWizard onComplete={handleSetupComplete} />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  if (walletState === "locked") {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button
            size="lg"
            className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold px-8 py-3 rounded-xl shadow-lg shadow-yellow-400/20 transition-all hover:scale-105 active:scale-95"
          >
            <Lock className="mr-2 h-5 w-5" />
            Unlock Vault
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-zinc-950 border-zinc-800 text-white">
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle className="text-2xl font-bold text-center">
                Unlock Vault
              </DrawerTitle>
              <DrawerDescription className="text-center text-zinc-400">
                Enter your password to access your secured assets.
              </DrawerDescription>
            </DrawerHeader>
            <form onSubmit={handleUnlock} className="p-4 space-y-4">
              <Input
                type="password"
                placeholder="Enter password"
                className="bg-zinc-900 border-zinc-700 text-white h-12"
                value={unlockPassword}
                onChange={(e) => setUnlockPassword(e.target.value)}
                autoFocus
              />
              <Button
                type="submit"
                className="w-full h-12 bg-yellow-400 text-black hover:bg-yellow-500"
                disabled={!unlockPassword || isUnlocking}
              >
                {isUnlocking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Unlocking...
                  </>
                ) : (
                  "Unlock"
                )}
              </Button>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  if (walletState === "unlocked" && walletData?.address) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button
            size="lg"
            className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 font-bold px-8 py-3 rounded-xl border border-emerald-500/30 transition-all"
          >
            <CheckCircle2 className="mr-2 h-5 w-5" />
            {`${walletData.address.slice(0, 6)}...${walletData.address.slice(-4)}`}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-zinc-950 border-zinc-800 text-white max-h-[90vh]">
          <div className="mx-auto w-full max-w-md overflow-y-auto">
            <DrawerHeader>
              <DrawerTitle className="text-xl font-bold text-center">
                Vault Connected
              </DrawerTitle>
              <DrawerDescription className="text-center text-zinc-400 font-mono text-sm break-all">
                {walletData.address}
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  asChild
                >
                  <Link href="/lenix-wallet">
                    <Wallet className="mr-2 h-4 w-4" />
                    Lenix Wallet
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
                  onClick={handleLock}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Lock
                </Button>
              </div>

              <div className="border-t border-zinc-800 pt-4">
                <h4 className="text-sm font-semibold text-zinc-300 mb-2">Imported Wallets</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {vaultWallets.length === 0 ? (
                    <p className="text-xs text-zinc-500">No imported wallets yet.</p>
                  ) : (
                    vaultWallets.map((w) => (
                      <div
                        key={w.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/50 border border-zinc-800"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {w.wallet_type === "seed_phrase" ? (
                            <FileKey className="h-4 w-4 text-zinc-500 shrink-0" />
                          ) : (
                            <KeyRound className="h-4 w-4 text-zinc-500 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{w.wallet_name}</p>
                            <p className="text-xs text-zinc-500 font-mono truncate">
                              {w.ethereum_address.slice(0, 10)}...{w.ethereum_address.slice(-8)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-zinc-500 hover:text-red-400 h-8 w-8"
                          onClick={() => handleRemove(w.id)}
                          disabled={removingId === w.id}
                        >
                          {removingId === w.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))
                  )}
                </div>
                {!showImportForm ? (
                  <Button
                    variant="outline"
                    className="w-full mt-2 border-dashed border-zinc-600 text-zinc-400 hover:border-yellow-400/50 hover:text-yellow-400"
                    onClick={() => setShowImportForm(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Import Wallet
                  </Button>
                ) : (
                  <form onSubmit={handleImport} className="mt-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 space-y-3">
                    <div>
                      <Label className="text-xs text-zinc-400">Wallet name (optional)</Label>
                      <Input
                        placeholder="My MetaMask"
                        className="mt-1 bg-zinc-950 border-zinc-700 h-9"
                        value={importName}
                        onChange={(e) => setImportName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-zinc-400">Import type</Label>
                      <div className="flex gap-2 mt-1">
                        <Button
                          type="button"
                          variant={importType === "seed_phrase" ? "default" : "outline"}
                          size="sm"
                          className={importType === "seed_phrase" ? "bg-yellow-400 text-black" : "border-zinc-700"}
                          onClick={() => setImportType("seed_phrase")}
                        >
                          Seed phrase
                        </Button>
                        <Button
                          type="button"
                          variant={importType === "private_key" ? "default" : "outline"}
                          size="sm"
                          className={importType === "private_key" ? "bg-yellow-400 text-black" : "border-zinc-700"}
                          onClick={() => setImportType("private_key")}
                        >
                          Private key
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-zinc-400">
                        {importType === "seed_phrase" ? "12 or 24 word recovery phrase" : "Private key"}
                      </Label>
                      <Input
                        type={importType === "private_key" ? "password" : "text"}
                        placeholder={importType === "seed_phrase" ? "word1 word2 word3 ..." : "0x..."}
                        className="mt-1 bg-zinc-950 border-zinc-700 h-9 font-mono text-sm"
                        value={importCredentials}
                        onChange={(e) => setImportCredentials(e.target.value)}
                        autoComplete="off"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-zinc-400">Encryption password (min 8 chars)</Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="mt-1 bg-zinc-950 border-zinc-700 h-9"
                        value={importPassword}
                        onChange={(e) => setImportPassword(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1 border-zinc-700"
                        onClick={() => {
                          setShowImportForm(false);
                          setImportCredentials("");
                          setImportPassword("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        className="flex-1 bg-yellow-400 text-black hover:bg-yellow-500"
                        disabled={isImporting}
                      >
                        {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Import"}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  if (walletState === "loading") {
    return (
      <Button
        size="lg"
        disabled
        className="bg-zinc-800 text-zinc-500 font-bold px-8 py-3 rounded-xl"
      >
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading...
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold px-8 py-3 rounded-xl"
      asChild
    >
      <Link href="/lenix-wallet">
        <Wallet className="mr-2 h-5 w-5" />
        Connect Wallet
      </Link>
    </Button>
  );
}
