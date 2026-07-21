"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Save, RotateCcw } from "lucide-react";

interface SystemConfig {
  loan_interest_rate: number;
  loan_min_amount: number;
  loan_max_amount: number;
  loan_min_duration: number;
  loan_max_duration: number;
  collateral_ratio: number;
  withdrawal_fee_percent: number;
  min_withdrawal: number;
  max_withdrawal: number;
  maintenance_mode: boolean;
  support_email: string;
}

const defaultConfig: SystemConfig = {
  loan_interest_rate: 12,
  loan_min_amount: 100,
  loan_max_amount: 100000,
  loan_min_duration: 7,
  loan_max_duration: 365,
  collateral_ratio: 150,
  withdrawal_fee_percent: 0.5,
  min_withdrawal: 10,
  max_withdrawal: 50000,
  maintenance_mode: false,
  support_email: "support@lenixprotocol.com",
};

export default function GeneralSettingsPage() {
  const [config, setConfig] = useState<SystemConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/settings?key=system_config");
      const result = await res.json();
      if (res.ok && result.data) {
        setConfig({ ...defaultConfig, ...result.data });
      }
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "system_config", value: config }),
      });
      if (res.ok) {
        toast.success("Settings saved successfully");
      } else {
        const result = await res.json();
        toast.error(result.error || "Failed to save settings");
      }
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  }

  function handleReset() {
    setConfig(defaultConfig);
    toast.info("Settings reset to defaults (not saved)");
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
        <h2 className="text-xl font-semibold text-white">General Settings</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Configure platform-wide settings and defaults
        </p>
      </div>

      {/* Loan Settings */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h3 className="font-medium text-white">Loan Configuration</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Default loan parameters and limits
          </p>
        </div>
        <div className="space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                Interest Rate (% APR)
              </label>
              <input
                type="number"
                value={config.loan_interest_rate}
                onChange={(e) =>
                  setConfig({ ...config, loan_interest_rate: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-yellow-400/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                Collateral Ratio (%)
              </label>
              <input
                type="number"
                value={config.collateral_ratio}
                onChange={(e) =>
                  setConfig({ ...config, collateral_ratio: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-yellow-400/50 focus:outline-none"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                Minimum Loan Amount ($)
              </label>
              <input
                type="number"
                value={config.loan_min_amount}
                onChange={(e) =>
                  setConfig({ ...config, loan_min_amount: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-yellow-400/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                Maximum Loan Amount ($)
              </label>
              <input
                type="number"
                value={config.loan_max_amount}
                onChange={(e) =>
                  setConfig({ ...config, loan_max_amount: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-yellow-400/50 focus:outline-none"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                Min Duration (days)
              </label>
              <input
                type="number"
                value={config.loan_min_duration}
                onChange={(e) =>
                  setConfig({ ...config, loan_min_duration: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-yellow-400/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                Max Duration (days)
              </label>
              <input
                type="number"
                value={config.loan_max_duration}
                onChange={(e) =>
                  setConfig({ ...config, loan_max_duration: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-yellow-400/50 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Withdrawal Settings */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h3 className="font-medium text-white">Withdrawal Settings</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Fee structure and withdrawal limits
          </p>
        </div>
        <div className="space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                Withdrawal Fee (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={config.withdrawal_fee_percent}
                onChange={(e) =>
                  setConfig({ ...config, withdrawal_fee_percent: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-yellow-400/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                Min Withdrawal ($)
              </label>
              <input
                type="number"
                value={config.min_withdrawal}
                onChange={(e) =>
                  setConfig({ ...config, min_withdrawal: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-yellow-400/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                Max Withdrawal ($)
              </label>
              <input
                type="number"
                value={config.max_withdrawal}
                onChange={(e) =>
                  setConfig({ ...config, max_withdrawal: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-yellow-400/50 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Platform Settings */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h3 className="font-medium text-white">Platform Settings</h3>
          <p className="mt-1 text-sm text-zinc-500">
            General platform configuration
          </p>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-400">
              Support Email
            </label>
            <input
              type="email"
              value={config.support_email}
              onChange={(e) =>
                setConfig({ ...config, support_email: e.target.value })
              }
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-yellow-400/50 focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-white">Maintenance Mode</p>
              <p className="text-xs text-zinc-500">
                Enable to show maintenance page to users
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setConfig({ ...config, maintenance_mode: !config.maintenance_mode })
              }
              className={`relative h-6 w-11 rounded-full transition-colors ${
                config.maintenance_mode ? "bg-yellow-400" : "bg-zinc-600"
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  config.maintenance_mode ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-zinc-800 pt-6">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
        >
          <RotateCcw className="h-4 w-4" />
          Reset to Defaults
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-yellow-300 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Changes
        </button>
      </div>
    </div>
  );
}
