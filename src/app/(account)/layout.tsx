import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AccountLayout } from "./_components/account-layout";

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

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Same background as onboarding/details */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/assets/img/background6.png)" }}
      />
      <div className="fixed inset-0 z-[1] bg-black/50" />
      {/* Layout with sidebar + header (glass effect inside AccountLayout) */}
      <div className="relative z-10">
        <AccountLayout userEmail={user.email ?? ""}>{children}</AccountLayout>
      </div>
    </div>
  );
}
