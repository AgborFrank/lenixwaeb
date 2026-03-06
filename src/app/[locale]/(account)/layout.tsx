import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AccountLayout } from "./_components/account-layout";
import { WalletProvider } from "./_providers/wallet-provider";
import { SettingsProvider } from "./_providers/settings-provider";
import { getSettings } from "./settings/actions";

export default async function AccountLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: onboarding } = await supabase
    .from("web_onboarding")
    .select("step_completed")
    .eq("user_id", user.id)
    .single();

  if (!onboarding || (onboarding.step_completed ?? 0) < 2) {
    redirect("/onboarding");
  }

  const { data: settings } = await getSettings();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/assets/img/background6.png)" }}
      />
      <div className="fixed inset-0 z-[1] bg-black/50" />
      <div className="relative z-10">
        <SettingsProvider initialSettings={settings ?? null}>
          <WalletProvider>
            <AccountLayout userEmail={user.email ?? ""}>
              {children}
            </AccountLayout>
          </WalletProvider>
        </SettingsProvider>
      </div>
    </div>
  );
}
