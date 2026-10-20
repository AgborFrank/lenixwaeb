"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Check,
  Copy,
  Eye,
  EyeOff,
  Key,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { adminGlass } from "@/lib/admin-glass";
import {
  SettingsLoading,
  SettingsNotice,
  SettingsPageHeader,
  SettingsRow,
  SettingsRowList,
  SettingsSection,
} from "../_components/settings-ui";

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
      const res = await fetch(
        `/api/admin/settings?key=${encodeURIComponent("api_config")}`,
      );
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
      toast.error("Enter a key name");
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
      toast.success("API key created");
    } catch {
      toast.error("Failed to create API key");
    } finally {
      setIsCreatingKey(false);
    }
  }

  async function handleDeleteKey(id: string) {
    if (!confirm("Delete this API key? Integrations using it will stop working.")) return;

    const updatedKeys = apiKeys.filter((k) => k.id !== id);
    await saveConfig(updatedKeys, webhooks);
    setApiKeys(updatedKeys);
    toast.success("API key deleted");
  }

  async function handleRegenerateKey(id: string) {
    if (!confirm("Regenerate this key? The previous value stops working immediately.")) return;

    const updatedKeys = apiKeys.map((k) =>
      k.id === id ? { ...k, key: `lnx_${generateRandomKey(32)}` } : k,
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
    toast.success("Copied");
    setTimeout(() => setCopied(null), 2000);
  }

  function maskKey(key: string): string {
    if (key.length <= 8) return key;
    return `${key.slice(0, 8)}${"•".repeat(20)}${key.slice(-4)}`;
  }

  if (isLoading) return <SettingsLoading />;

  return (
    <>
      <SettingsPageHeader
        title="API"
        description="Keys stored in admin settings for programmatic access. Treat them like production secrets."
      />

      <SettingsSection
        title="API keys"
        description="Create named keys for scripts or integrations."
        action={
          <button
            type="button"
            onClick={() => setShowCreateKey(true)}
            className={adminGlass.buttonPrimary}
          >
            <Plus className="h-3.5 w-3.5" />
            Create
          </button>
        }
        bodyClassName="p-0"
      >
        {showCreateKey ? (
          <div className="border-b border-white/[0.06] bg-white/[0.02] p-4 sm:p-5">
            <label className={adminGlass.fieldLabel}>Name</label>
            <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Production read-only"
                className={`${adminGlass.input} sm:flex-1`}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCreateKey}
                  disabled={isCreatingKey}
                  className={adminGlass.buttonPrimary}
                >
                  {isCreatingKey ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Create"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateKey(false)}
                  className={adminGlass.buttonSecondary}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {apiKeys.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-zinc-500 sm:px-5">
            No API keys yet.
          </p>
        ) : (
          <ul className="divide-y divide-white/[0.06]">
            {apiKeys.map((apiKey) => (
              <li key={apiKey.id} className="space-y-3 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-white">{apiKey.name}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      Created {new Date(apiKey.created_at).toLocaleDateString()}
                      {apiKey.last_used
                        ? ` · Last used ${new Date(apiKey.last_used).toLocaleDateString()}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => handleRegenerateKey(apiKey.id)}
                      className={adminGlass.buttonGhost}
                      title="Regenerate"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteKey(apiKey.id)}
                      className={`${adminGlass.buttonGhost} hover:text-red-400`}
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div
                  className="flex items-center gap-2 rounded-md border border-white/[0.08] bg-black/40 px-3 py-2"
                >
                  <Key className="h-3.5 w-3.5 shrink-0 text-zinc-600" aria-hidden />
                  <code className="min-w-0 flex-1 truncate font-mono text-xs text-zinc-300">
                    {showKey === apiKey.id ? apiKey.key : maskKey(apiKey.key)}
                  </code>
                  <button
                    type="button"
                    onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                    className={adminGlass.buttonGhost}
                    aria-label={showKey === apiKey.id ? "Hide key" : "Show key"}
                  >
                    {showKey === apiKey.id ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                    className={adminGlass.buttonGhost}
                    aria-label="Copy key"
                  >
                    {copied === apiKey.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400/90" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SettingsSection>

      <SettingsSection title="Webhooks" bodyClassName="p-0">
        <SettingsRowList>
          <SettingsRow
            label="Outbound webhooks"
            hint="Event delivery to your HTTPS endpoints."
          >
            <span className={adminGlass.badgeMuted}>Not available</span>
          </SettingsRow>
        </SettingsRowList>
      </SettingsSection>

      <SettingsNotice title="Secret handling">
        Do not commit keys to git or paste them in tickets. Regenerate immediately if a key is
        exposed.
      </SettingsNotice>
    </>
  );
}
