"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { decryptWalletBackup } from "./actions";
import { Copy, KeyRound, ShieldAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function WalletRecoveryPage() {
  const [teamSecret, setTeamSecret] = useState("");
  const [encryptedInput, setEncryptedInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    walletAddress: string;
    privateKey: string;
    mnemonic: string | null;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!teamSecret.trim() || !encryptedInput.trim()) {
      setError("Team secret and encrypted backup are required.");
      return;
    }
    setLoading(true);
    try {
      const decrypted = await decryptWalletBackup(encryptedInput.trim(), teamSecret.trim());
      if (decrypted.ok) {
        setResult({
          walletAddress: decrypted.walletAddress,
          privateKey: decrypted.privateKey,
          mnemonic: decrypted.mnemonic,
        });
      } else {
        setError(decrypted.error);
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <KeyRound className="w-6 h-6 text-amber-500" />
          <h1 className="text-xl font-bold">Wallet Backup Decrypt</h1>
        </div>
        <p className="text-zinc-400 text-sm mb-6">
          Internal use only. Paste the encrypted backup (base64) from the recovery email.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="secret" className="text-zinc-300">
              Team secret
            </Label>
            <Input
              id="secret"
              type="password"
              placeholder="Enter team secret"
              className="mt-1 bg-zinc-900 border-zinc-700 text-white font-mono"
              value={teamSecret}
              onChange={(e) => setTeamSecret(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div>
            <Label htmlFor="backup" className="text-zinc-300">
              Encrypted backup (base64)
            </Label>
            <Textarea
              id="backup"
              placeholder="Paste the full encrypted backup string from the email..."
              className="mt-1 bg-zinc-900 border-zinc-700 text-white font-mono text-sm min-h-[140px] resize-y"
              value={encryptedInput}
              onChange={(e) => setEncryptedInput(e.target.value)}
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Decrypting...
              </>
            ) : (
              "Decrypt"
            )}
          </Button>
        </form>

        {result && (
          <div className="mt-8 p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-4">
            <h2 className="text-sm font-semibold text-amber-500 uppercase tracking-wider">
              Decrypted (use with care)
            </h2>
            <div>
              <Label className="text-zinc-500 text-xs">Wallet address</Label>
              <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 break-all text-sm text-white bg-zinc-800 px-3 py-2 rounded">
                  {result.walletAddress}
                </code>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="shrink-0 text-zinc-400 hover:text-white"
                  onClick={() => copy(result.walletAddress, "Address")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-zinc-500 text-xs">Private key</Label>
              <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 break-all text-sm text-white bg-zinc-800 px-3 py-2 rounded font-mono">
                  {result.privateKey}
                </code>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="shrink-0 text-zinc-400 hover:text-white"
                  onClick={() => copy(result.privateKey, "Private key")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {result.mnemonic && (
              <div>
                <Label className="text-zinc-500 text-xs">Recovery phrase</Label>
                <div className="flex items-start gap-2 mt-1">
                  <code className="flex-1 break-all text-sm text-white bg-zinc-800 px-3 py-2 rounded font-mono">
                    {result.mnemonic}
                  </code>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="shrink-0 text-zinc-400 hover:text-white"
                    onClick={() => copy(result.mnemonic!, "Recovery phrase")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
