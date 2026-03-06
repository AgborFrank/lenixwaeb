import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LoanPayoutForm } from "../loan-payout-form";

export default async function LoanPayoutPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: onboarding } = await supabase
    .from("web_onboarding")
    .select("service_type, step_completed")
    .eq("user_id", user.id)
    .single();

  if (!onboarding || onboarding.service_type !== "loan") redirect("/onboarding");
  if (onboarding.step_completed >= 2) redirect("/dashboard");

  const params = await searchParams;
  const error = params.error;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/assets/img/background6.png)" }}
      />
      <div className="absolute inset-0 z-[1] bg-black/50" />

      <Link
        href="/onboarding/details"
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-20"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to loan details</span>
      </Link>

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-10">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white text-xs mb-4 border border-white/10 uppercase tracking-widest">
            Step 2 of 2 — Payout
          </span>
          <h1 className="text-3xl font-bold text-white mb-2">
            How would you like to receive your funds?
          </h1>
          <p className="text-gray-400">
            Choose your preferred payout method and provide the required details.
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-400 rounded-lg bg-red-400/10 border border-red-400/20 p-3 mb-6">
            {error}
          </p>
        )}

        <div className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <LoanPayoutForm />
        </div>
      </div>
    </main>
  );
}
