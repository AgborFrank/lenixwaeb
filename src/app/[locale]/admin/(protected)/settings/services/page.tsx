"use client";

import { Loader2, Save } from "lucide-react";
import {
  DEFAULT_SERVICES_CONFIG,
  SYSTEM_CONFIG_KEYS,
  type ServicesConfig,
} from "@/lib/platform-settings";
import {
  SettingsActions,
  SettingsLoading,
  SettingsPageHeader,
  SettingsRow,
  SettingsSection,
  SettingsToggle,
} from "../_components/settings-ui";
import { adminGlass } from "@/lib/admin-glass";
import { ServiceField } from "../_components/service-field";
import { useAdminSetting } from "../_components/use-admin-setting";

export default function ServicesSettingsPage() {
  const { data, setData, isLoading, isSaving, save } = useAdminSetting<ServicesConfig>(
    SYSTEM_CONFIG_KEYS.services,
    DEFAULT_SERVICES_CONFIG,
  );

  if (isLoading) return <SettingsLoading />;

  return (
    <>
      <SettingsPageHeader
        title="Services"
        description="Turn product surfaces on or off for logged-in users. Disabled routes stay out of the account navigation."
      />

      <SettingsSection title="Desks" description="Case intake and specialist workflows." bodyClassName="p-0">
        <ServiceField
          label="Recovery"
          hint="Wallet recovery assistance queue."
          value={data.recovery}
          onChange={(recovery) => setData({ ...data, recovery })}
          showEmail
          showPublicIntake
          extra={
            <SettingsRow label="Require evidence upload" hint="Onboarding and open-case forms.">
              <SettingsToggle
                label="Require evidence"
                checked={data.recovery.require_evidence}
                onChange={(require_evidence) =>
                  setData({
                    ...data,
                    recovery: { ...data.recovery, require_evidence },
                  })
                }
              />
            </SettingsRow>
          }
        />
        <ServiceField
          label="Purchase refunds"
          hint="Refund intake separate from recovery."
          value={data.refunds}
          onChange={(refunds) => setData({ ...data, refunds })}
          showEmail
          showPublicIntake
        />
        <ServiceField
          label="Crypto loans"
          hint="Borrow desk and applications."
          value={data.crypto_loans}
          onChange={(crypto_loans) => setData({ ...data, crypto_loans })}
          showEmail
          extra={
            <SettingsRow label="Applications open" hint="Allow new loan requests.">
              <SettingsToggle
                label="Applications open"
                checked={data.crypto_loans.applications_open}
                onChange={(applications_open) =>
                  setData({
                    ...data,
                    crypto_loans: { ...data.crypto_loans, applications_open },
                  })
                }
              />
            </SettingsRow>
          }
        />
        <ServiceField
          label="Banking"
          hint="Fiat banking onboarding and accounts."
          value={data.banking}
          onChange={(banking) => setData({ ...data, banking })}
          showEmail
        />
      </SettingsSection>

      <SettingsSection title="Wallet & assets" bodyClassName="p-0">
        <ServiceField
          label="Vault"
          hint="Custodial vault carousel and balances."
          value={data.vault}
          onChange={(vault) => setData({ ...data, vault })}
        />
        <ServiceField
          label="Lenix wallet"
          hint="In-app wallet experience."
          value={data.lenix_wallet}
          onChange={(lenix_wallet) => setData({ ...data, lenix_wallet })}
        />
        <ServiceField
          label="Assets"
          hint="Portfolio overview and allocation."
          value={data.assets}
          onChange={(assets) => setData({ ...data, assets })}
        />
        <ServiceField
          label="Send"
          hint="Outbound transfers."
          value={data.send}
          onChange={(send) => setData({ ...data, send })}
        />
        <ServiceField
          label="Receive"
          hint="Deposit addresses and QR."
          value={data.receive}
          onChange={(receive) => setData({ ...data, receive })}
        />
        <ServiceField
          label="Transactions"
          hint="Unified history."
          value={data.transactions}
          onChange={(transactions) => setData({ ...data, transactions })}
        />
      </SettingsSection>

      <SettingsSection title="Commerce" bodyClassName="p-0">
        <ServiceField
          label="Token sale"
          hint="LNX purchase widget and sale flows."
          value={data.token_sale}
          onChange={(token_sale) => setData({ ...data, token_sale })}
        />
        <ServiceField
          label="Stripe checkout"
          hint="Card payments where Stripe is integrated."
          value={data.stripe_checkout}
          onChange={(stripe_checkout) => setData({ ...data, stripe_checkout })}
        />
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
