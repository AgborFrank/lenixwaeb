"use client";

import { Loader2, Save } from "lucide-react";
import { adminGlass } from "@/lib/admin-glass";
import {
  DEFAULT_FINANCIAL_CONFIG,
  SYSTEM_CONFIG_KEYS,
  type FinancialConfig,
} from "@/lib/platform-settings";
import {
  SettingsActions,
  SettingsField,
  SettingsLoading,
  SettingsPageHeader,
  SettingsSection,
} from "../_components/settings-ui";
import { useAdminSetting } from "../_components/use-admin-setting";

export default function FinancialSettingsPage() {
  const { data, setData, isLoading, isSaving, save } = useAdminSetting<FinancialConfig>(
    SYSTEM_CONFIG_KEYS.financial,
    DEFAULT_FINANCIAL_CONFIG,
  );

  if (isLoading) return <SettingsLoading />;

  return (
    <>
      <SettingsPageHeader
        title="Financial"
        description="Loan product defaults, withdrawal policy, and admin alert thresholds."
      />

      <SettingsSection title="Loans">
        <div className="grid gap-4 sm:grid-cols-2">
          <SettingsField label="Interest rate (% APR)">
            <input
              type="number"
              value={data.loan_interest_rate}
              onChange={(e) =>
                setData({ ...data, loan_interest_rate: Number(e.target.value) })
              }
              className={adminGlass.input}
            />
          </SettingsField>
          <SettingsField label="Collateral ratio (%)">
            <input
              type="number"
              value={data.collateral_ratio}
              onChange={(e) =>
                setData({ ...data, collateral_ratio: Number(e.target.value) })
              }
              className={adminGlass.input}
            />
          </SettingsField>
          <SettingsField label="Minimum amount (USD)">
            <input
              type="number"
              value={data.loan_min_amount}
              onChange={(e) =>
                setData({ ...data, loan_min_amount: Number(e.target.value) })
              }
              className={adminGlass.input}
            />
          </SettingsField>
          <SettingsField label="Maximum amount (USD)">
            <input
              type="number"
              value={data.loan_max_amount}
              onChange={(e) =>
                setData({ ...data, loan_max_amount: Number(e.target.value) })
              }
              className={adminGlass.input}
            />
          </SettingsField>
          <SettingsField label="Minimum duration (days)">
            <input
              type="number"
              value={data.loan_min_duration}
              onChange={(e) =>
                setData({ ...data, loan_min_duration: Number(e.target.value) })
              }
              className={adminGlass.input}
            />
          </SettingsField>
          <SettingsField label="Maximum duration (days)">
            <input
              type="number"
              value={data.loan_max_duration}
              onChange={(e) =>
                setData({ ...data, loan_max_duration: Number(e.target.value) })
              }
              className={adminGlass.input}
            />
          </SettingsField>
        </div>
      </SettingsSection>

      <SettingsSection title="Withdrawals">
        <div className="grid gap-4 sm:grid-cols-3">
          <SettingsField label="Fee (%)">
            <input
              type="number"
              step="0.01"
              value={data.withdrawal_fee_percent}
              onChange={(e) =>
                setData({ ...data, withdrawal_fee_percent: Number(e.target.value) })
              }
              className={adminGlass.input}
            />
          </SettingsField>
          <SettingsField label="Minimum (USD)">
            <input
              type="number"
              value={data.min_withdrawal}
              onChange={(e) =>
                setData({ ...data, min_withdrawal: Number(e.target.value) })
              }
              className={adminGlass.input}
            />
          </SettingsField>
          <SettingsField label="Maximum (USD)">
            <input
              type="number"
              value={data.max_withdrawal}
              onChange={(e) =>
                setData({ ...data, max_withdrawal: Number(e.target.value) })
              }
              className={adminGlass.input}
            />
          </SettingsField>
        </div>
        <SettingsField
          label="Large withdrawal alert (USD)"
          hint="Used with notification settings for admin email."
        >
          <input
            type="number"
            value={data.large_withdrawal_alert_usd}
            onChange={(e) =>
              setData({ ...data, large_withdrawal_alert_usd: Number(e.target.value) })
            }
            className={adminGlass.input}
          />
        </SettingsField>
      </SettingsSection>

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
