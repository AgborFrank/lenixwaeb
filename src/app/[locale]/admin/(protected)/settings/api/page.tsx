"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Key,
  Copy,
  Check,
  RefreshCw,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Globe,
  AlertTriangle,
} from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used: string | null;
  permissions: string[];
}

interface Webhook {
  id: string;
  url: string;
  events: string[];
  is_active: boolean;
  created_at: string;
}

export default function ApiSettingsPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [showCreateKey, setShowCreateKey] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/settings?key=api_config");
      const result = await res.json();
      if (res.ok && result.data) {
        setApiKeys(result.data.api_keys || []);
        setWebhooks(result.data.webhooks || []);
      }
    } catch {
      toast.error("Failed to load API settings");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateKey() {
    if (!newKeyName.trim()) {
      toast.error("Please enter a key name");
      return;
    }

    setIsCreatingKey(true);
    try {
      const newKey: ApiKey = {
        id: crypto.randomUUID(),
        name: newKeyName,
        key: `lnx_${generateRandomKey(32)}`,
        created_at: new Date().toISOString(),
        last_used: null,
        permissions: ["read"],
      };

      const updatedKeys = [...apiKeys, newKey];
      await saveConfig(updatedKeys, webhooks);
      setApiKeys(updatedKeys);
      setNewKeyName("");
      setShowCreateKey(false);
      toast.success("API key created successfully");
    } catch {
      toast.error("Failed to create API key");
    } finally {
      setIsCreatingKey(false);
    }
  }

  async function handleDeleteKey(id: string) {
    if (!confirm("Are you sure you want to delete this API key?")) return;

    const updatedKeys = apiKeys.filter((k) => k.id !== id);
    await saveConfig(updatedKeys, webhooks);
    setApiKeys(updatedKeys);
    toast.success("API key deleted");
  }

  async function handleRegenerateKey(id: string) {
    if (!confirm("Are you sure? The old key will stop working immediately.")) return;

    const updatedKeys = apiKeys.map((k) =>
      k.id === id ? { ...k, key: `lnx_${generateRandomKey(32)}` } : k
    );
    await saveConfig(updatedKeys, webhooks);
    setApiKeys(updatedKeys);
    toast.success("API key regenerated");
  }

  async function saveConfig(keys: ApiKey[], hooks: Webhook[]) {
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: "api_config",
        value: { api_keys: keys, webhooks: hooks },
      }),
    });
    if (!res.ok) throw new Error("Failed to save");
  }

  function generateRandomKey(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(null), 2000);
  }

  function maskKey(key: string): string {
    if (key.length <= 8) return key;
    return `${key.slice(0, 8)}${"•".repeat(24)}${key.slice(-4)}`;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white">API Settings</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Manage API keys and webhook integrations
        </p>
      </div>

      {/* API Keys */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div>
            <h3 className="flex items-center gap-2 font-medium text-white">
              <Key className="h-4 w-4 text-yellow-400" />
              API Keys
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Manage keys for programmatic access
            </p>
          </div>
          <button
            onClick={() => setShowCreateKey(true)}
            className="flex items-center gap-2 rounded-lg bg-yellow-400 px-3 py-2 text-sm font-medium text-black hover:bg-yellow-300"
          >
            <Plus className="h-4 w-4" />
            Create Key
          </button>
        </div>

        {showCreateKey && (
          <div className="border-b border-zinc-800 bg-zinc-800/30 p-5">
            <label className="mb-1.5 block text-sm font-medium text-zinc-400">
              Key Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Production API"
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-yellow-400/50 focus:outline-none"
              />
              <button
                onClick={handleCreateKey}
                disabled={isCreatingKey}
                className="rounded-lg bg-yellow-400 px-4 py-2.5 text-sm font-medium text-black hover:bg-yellow-300 disabled:opacity-50"
              >
                {isCreatingKey ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
              </button>
              <button
                onClick={() => setShowCreateKey(false)}
                className="rounded-lg bg-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="divide-y divide-zinc-800">
          {apiKeys.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <Key className="mx-auto h-8 w-8 text-zinc-600" />
              <p className="mt-2 text-sm text-zinc-500">No API keys created yet</p>
            </div>
          ) : (
            apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-white">{apiKey.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Created {new Date(apiKey.created_at).toLocaleDateString()}
                      {apiKey.last_used &&
                        ` · Last used ${new Date(apiKey.last_used).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRegenerateKey(apiKey.id)}
                      className="rounded p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-white"
                      title="Regenerate key"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteKey(apiKey.id)}
                      className="rounded p-1.5 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                      title="Delete key"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2">
                  <code className="flex-1 text-sm text-zinc-300">
                    {showKey === apiKey.id ? apiKey.key : maskKey(apiKey.key)}
                  </code>
                  <button
                    onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                    className="text-zinc-500 hover:text-white"
                  >
                    {showKey === apiKey.id ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                    className="text-zinc-500 hover:text-white"
                  >
                    {copied === apiKey.id ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Webhooks */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div>
            <h3 className="flex items-center gap-2 font-medium text-white">
              <Globe className="h-4 w-4 text-yellow-400" />
              Webhooks
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Configure webhook endpoints for event notifications
            </p>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-white">Webhook Configuration</p>
              <p className="text-xs text-zinc-500">
                Set up endpoints to receive real-time event data
              </p>
            </div>
            <span className="rounded-full bg-zinc-700 px-3 py-1 text-xs font-medium text-zinc-400">
              Coming Soon
            </span>
          </div>
        </div>
      </section>

      {/* Security Notice */}
      <section className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />
          <div>
            <p className="font-medium text-yellow-400">Security Notice</p>
            <p className="mt-1 text-sm text-zinc-400">
              Keep your API keys secure. Never share them publicly or commit them to
              version control. If a key is compromised, regenerate it immediately.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
