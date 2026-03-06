import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { RecoveryDetailsForm } from "./recovery-details-form";
import { LoanApplicationForm, type LoanType } from "./loan-application-form";

export default async function OnboardingDetailsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch selection
  const { data: onboarding } = await supabase
    .from("web_onboarding")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!onboarding || !onboarding.service_type) {
    redirect("/onboarding");
  }

  if (onboarding.step_completed >= 2) {
    redirect("/dashboard"); // Already done
  }

  const isRecovery = onboarding.service_type === "recovery";

  // Fetch loan types for loan application form
  const { data: loanTypes = [] } = await supabase
    .from("loan_types")
    .select("id, name, ltv, interest_rate, min_collateral, max_collateral")
    .order("id", { ascending: true });

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/assets/img/background6.png)" }}
      />
      <div className="absolute inset-0 z-[1] bg-black/50" />

      <Link
        href="/onboarding"
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-20"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Selection</span>
      </Link>

      <div
        className={`w-full relative z-10 ${isRecovery ? "max-w-4xl" : "max-w-2xl"}`}
      >
        <div className="text-center mb-10">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white text-xs mb-4 border border-white/10 uppercase tracking-widest">
            {isRecovery ? "Step 2 of 2" : "Step 1 of 2 — Loan details"}
          </span>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isRecovery
              ? "Asset Recovery & Forensics Details"
              : "Request Quick Loan for Any Purpose"}
          </h1>
          <p className="text-gray-400">
            {isRecovery
              ? "We help you trace and recover lost crypto assets and build verified evidence to create the documentation required for lawful fund recovery."
              : "Provide details for the loan you need. Next you’ll choose how to receive your funds. All loans are issued by Lenix Finance, LLC and are subject to our terms and conditions."}
          </p>
        </div>

        <div className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          {isRecovery ? (
            <RecoveryDetailsForm />
          ) : (
            <LoanApplicationForm loanTypes={(loanTypes as LoanType[]) ?? []} />
          )}
        </div>
      </div>
    </main>
  );
}
