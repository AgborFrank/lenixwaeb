"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { adminGlass } from "@/lib/admin-glass";
import {
  DEFAULT_WEB3_CONFIG,
  SYSTEM_CONFIG_KEYS,
  type Web3ChainKey,
  type Web3Config,
} from "@/lib/platform-settings";
import {
  SettingsActions,
  SettingsField,
  SettingsLoading,
  SettingsNotice,
  SettingsPageHeader,
  SettingsRow,
  SettingsRowList,
  SettingsSection,
  SettingsToggle,
} from "../_components/settings-ui";
import { useAdminSetting } from "../_components/use-admin-setting";

const CHAIN_LABELS: Record<Web3ChainKey, string> = {
  polygon: "Polygon",
  mainnet: "Ethereum",
  sepolia: "Sepolia (test)",
  bsc: "BNB Smart Chain",
};

const CONTRACT_ROWS: { key: keyof Web3Config["contracts"]; label: string }[] = [
  { key: "lnx_token", label: "LNX token" },
  { key: "lnx_sale", label: "LNX sale" },
  { key: "usdt", label: "USDT" },
];

interface RuntimeStatus {
  wallet_connect_project_id: boolean;
  env: Record<string, boolean>;
  wagmi_networks: { id: number; name: string }[];
  note: string;
}

export default function Web3SettingsPage() {
  const { data, setData, isLoading, isSaving, save } = useAdminSetting<Web3Config>(
    SYSTEM_CONFIG_KEYS.web3,
    DEFAULT_WEB3_CONFIG,
  );
  const [runtime, setRuntime] = useState<RuntimeStatus | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings/runtime")
      .then((r) => r.json())
      .then((j) => setRuntime(j.data ?? null))
      .catch(() => setRuntime(null));
  }, []);

  if (isLoading) return <SettingsLoading />;

  return (
    <>
      <SettingsPageHeader
        title="Web3"
        description="Chain availability, treasury targets, and contract references. Live wallet connectivity still reads deploy-time env vars."
      />

      {runtime ? (
        <SettingsSection title="Deployment status" description="From server environment (read-only).">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-white/[0.06] bg-black/30 px-3 py-2">
              <p className="text-[11px] text-zinc-500">WalletConnect project</p>
              <p className="text-sm text-white">
                {runtime.wallet_connect_project_id ? "Configured" : "Missing"}
              </p>
            </div>
            <div className="rounded-md border border-white/[0.06] bg-black/30 px-3 py-2">
              <p className="text-[11px] text-zinc-500">Wagmi networks</p>
              <p className="text-sm text-white">
                {runtime.wagmi_networks.map((n) => n.name).join(", ")}
              </p>
            </div>
          </div>
          <p className="text-xs text-zinc-500">{runtime.note}</p>
        </SettingsSection>
      ) : null}

      <SettingsSection title="Networks" bodyClassName="p-0">
        <SettingsRowList>
          {(Object.keys(CHAIN_LABELS) as Web3ChainKey[]).map((chainKey) => (
            <SettingsRow
              key={chainKey}
              label={CHAIN_LABELS[chainKey]}
              hint={`Chain ID ${data.chains[chainKey].chain_id}`}
            >
              <SettingsToggle
                label={`${CHAIN_LABELS[chainKey]} enabled`}
                checked={data.chains[chainKey].enabled}
                onChange={(enabled) =>
                  setData({
                    ...data,
                    chains: {
                      ...data.chains,
                      [chainKey]: { ...data.chains[chainKey], enabled },
                    },
                  })
                }
              />
            </SettingsRow>
          ))}
        </SettingsRowList>
        <div className="border-t border-white/[0.06] p-4 sm:p-5">
          <SettingsField label="Default chain ID" hint="Preferred network for new wallet sessions.">
            <input
              type="number"
              value={data.default_chain_id}
              onChange={(e) =>
                setData({ ...data, default_chain_id: Number(e.target.value) })
              }
              className={adminGlass.input}
            />
          </SettingsField>
        </div>
      </SettingsSection>

      <SettingsSection title="Treasury & routing">
        <div className="space-y-4">
          <SettingsField label="EVM deposit / treasury" hint="0x address for consolidated deposits.">
            <input
              type="text"
              value={data.treasury.evm_deposit}
              onChange={(e) =>
                setData({
                  ...data,
                  treasury: { ...data.treasury, evm_deposit: e.target.value },
                })
              }
              placeholder="0x…"
              className={adminGlass.input}
            />
          </SettingsField>
          <SettingsField label="Bitcoin deposit address">
            <input
              type="text"
              value={data.treasury.bitcoin_deposit}
              onChange={(e) =>
                setData({
                  ...data,
                  treasury: { ...data.treasury, bitcoin_deposit: e.target.value },
                })
              }
              className={adminGlass.input}
            />
          </SettingsField>
          <SettingsField
            label="Auto-transfer destination"
            hint="Optional sweep target when auto mode is enabled in env."
          >
            <input
              type="text"
              value={data.treasury.auto_transfer_destination}
              onChange={(e) =>
                setData({
                  ...data,
                  treasury: { ...data.treasury, auto_transfer_destination: e.target.value },
                })
              }
              placeholder="0x…"
              className={adminGlass.input}
            />
          </SettingsField>
        </div>
      </SettingsSection>

      <SettingsSection title="Contracts by chain" description="Reference addresses; env vars override at runtime today.">
        <div className="space-y-6">
          {CONTRACT_ROWS.map(({ key, label }) => (
            <div key={key}>
              <p className="mb-3 text-[13px] font-medium text-zinc-300">{label}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {(Object.keys(CHAIN_LABELS) as Web3ChainKey[]).map((chainKey) => (
                  <SettingsField key={chainKey} label={CHAIN_LABELS[chainKey]}>
                    <input
                      type="text"
                      value={data.contracts[key][chainKey] ?? ""}
                      onChange={(e) =>
                        setData({
                          ...data,
                          contracts: {
                            ...data.contracts,
                            [key]: {
                              ...data.contracts[key],
                              [chainKey]: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="0x…"
                      className={adminGlass.input}
                    />
                  </SettingsField>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection title="Confirmations">
        <div className="grid gap-4 sm:grid-cols-2">
          <SettingsField label="EVM confirmations">
            <input
              type="number"
              value={data.confirmations.evm}
              onChange={(e) =>
                setData({
                  ...data,
                  confirmations: { ...data.confirmations, evm: Number(e.target.value) },
                })
              }
              className={adminGlass.input}
            />
          </SettingsField>
          <SettingsField label="Bitcoin confirmations">
            <input
              type="number"
              value={data.confirmations.bitcoin}
              onChange={(e) =>
                setData({
                  ...data,
                  confirmations: { ...data.confirmations, bitcoin: Number(e.target.value) },
                })
              }
              className={adminGlass.input}
            />
          </SettingsField>
        </div>
      </SettingsSection>

      <SettingsNotice title="Env vs database">
        NEXT_PUBLIC_* contract and RPC variables require a redeploy to change. Use this page to
        document targets and prepare for runtime overrides in a later release.
      </SettingsNotice>

      <SettingsActions>
        <button
          type="button"
          disabled={isSaving}
          onClick={() => save(data)}
          className={adminGlass.buttonPrimary}
        >
          {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Save
        </button>
      </SettingsActions>
    </>
  );
}
