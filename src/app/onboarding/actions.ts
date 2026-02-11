"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const RECOVERY_FIELDS = [
  "name",
  "transaction_hash",
  "amount_stolen",
  "incident_summary",
  "phone_number",
  "country_phone_code",
  "blockchain",
  "currency",
] as const;

const LOAN_FIELDS = ["loan_type_id", "loan_amount", "collateral_asset", "duration"] as const;

export async function submitServiceSelection(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const serviceType = formData.get("serviceType") as string;

    if (!serviceType) {
        redirect("/onboarding?error=Please select a service");
    }

    // Update or Insert the selection
    const { error } = await supabase
        .from("web_onboarding")
        .upsert({
            user_id: user.id,
            service_type: serviceType,
            step_completed: 1,
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

    if (error) {
        console.error("Onboarding error:", error);
        redirect("/onboarding?error=Something went wrong");
    }

    redirect("/onboarding/details");
}

export async function submitOnboardingDetails(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    // Fetch current service type to validate fields
    const { data: onboarding } = await supabase
        .from("web_onboarding")
        .select("service_type")
        .eq("user_id", user.id)
        .single();

    if (!onboarding) redirect("/onboarding");

    const details: Record<string, unknown> = {};
    const serviceType = onboarding.service_type as string;

    if (serviceType === "recovery") {
        // Explicitly save every recovery field to the database
        for (const key of RECOVERY_FIELDS) {
            const value = formData.get(key);
            if (value !== null && value !== undefined && value !== "")
                details[key] = String(value);
        }
        // Evidence file: upload to Storage and save both filename and URL
        const evidenceFile = formData.get("evidence") as File | null;
        if (evidenceFile instanceof File && evidenceFile.size > 0) {
            details.evidence = evidenceFile.name;
            try {
                const path = `${user.id}/${Date.now()}-${evidenceFile.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from("onboarding-evidence")
                    .upload(path, evidenceFile, { upsert: false });
                if (!uploadError && uploadData?.path) {
                    const { data: urlData } = supabase.storage
                        .from("onboarding-evidence")
                        .getPublicUrl(uploadData.path);
                    details.evidence_url = urlData?.publicUrl ?? null;
                }
            } catch {
                // Keep only filename if upload fails
            }
        }
    } else {
        // Loan application: explicitly save every loan field
        for (const key of LOAN_FIELDS) {
            const value = formData.get(key);
            if (value !== null && value !== undefined && value !== "")
                details[key] = String(value);
        }
    }

    const { error } = await supabase
        .from("web_onboarding")
        .update({
            details: details,
            step_completed: 2,
            updated_at: new Date().toISOString()
        })
        .eq("user_id", user.id);

    if (error) {
        console.error("Onboarding Details error:", error);
        redirect("/onboarding/details?error=Could not save details");
    }

    redirect("/dashboard");
}

/** Loan step 1: save loan params only, then go to payout step */
export async function submitLoanStep1(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: onboarding } = await supabase
        .from("web_onboarding")
        .select("service_type")
        .eq("user_id", user.id)
        .single();
    if (!onboarding || onboarding.service_type !== "loan") redirect("/onboarding");

    const details: Record<string, unknown> = {};
    for (const key of LOAN_FIELDS) {
        const value = formData.get(key);
        if (value !== null && value !== undefined && value !== "")
            details[key] = String(value);
    }

    const { error } = await supabase
        .from("web_onboarding")
        .update({
            details,
            step_completed: 1,
            updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

    if (error) {
        console.error("Loan step 1 error:", error);
        redirect("/onboarding/details?error=Could not save");
    }
    redirect("/onboarding/details/loan-payout");
}

/** Loan step 2: save payout method and details to web_loan_payouts, then complete onboarding */
export async function submitLoanPayout(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: onboarding } = await supabase
        .from("web_onboarding")
        .select("service_type")
        .eq("user_id", user.id)
        .single();
    if (!onboarding || onboarding.service_type !== "loan") redirect("/onboarding");

    const payoutMethod = formData.get("payout_method") as string;
    if (!payoutMethod || !["crypto", "wire_transfer", "bank"].includes(payoutMethod)) {
        redirect("/onboarding/details/loan-payout?error=Invalid payout method");
    }

    const payoutDetails: Record<string, unknown> = { payout_method: payoutMethod };
    if (payoutMethod === "crypto") {
        const wallet_address = formData.get("wallet_address");
        const network = formData.get("network");
        const memo = formData.get("memo");
        if (!wallet_address || !network) redirect("/onboarding/details/loan-payout?error=Wallet address and network required");
        payoutDetails.wallet_address = String(wallet_address).trim();
        payoutDetails.network = String(network).trim();
        if (memo) payoutDetails.memo = String(memo).trim();
    } else if (payoutMethod === "wire_transfer") {
        const bank_name = formData.get("bank_name");
        const swift_bic = formData.get("swift_bic");
        const account_number = formData.get("account_number");
        const account_name = formData.get("account_name");
        if (!bank_name || !swift_bic || !account_number || !account_name)
            redirect("/onboarding/details/loan-payout?error=All wire transfer fields required");
        payoutDetails.bank_name = String(bank_name).trim();
        payoutDetails.swift_bic = String(swift_bic).trim();
        payoutDetails.account_number = String(account_number).trim();
        payoutDetails.account_name = String(account_name).trim();
        const reference = formData.get("reference");
        if (reference) payoutDetails.reference = String(reference).trim();
    } else if (payoutMethod === "bank") {
        const bank_name = formData.get("bank_name");
        const account_number = formData.get("account_number");
        const routing_iban = formData.get("routing_iban");
        const account_holder = formData.get("account_holder");
        if (!bank_name || !account_number || !routing_iban || !account_holder)
            redirect("/onboarding/details/loan-payout?error=All bank fields required");
        payoutDetails.bank_name = String(bank_name).trim();
        payoutDetails.account_number = String(account_number).trim();
        payoutDetails.routing_iban = String(routing_iban).trim();
        payoutDetails.account_holder = String(account_holder).trim();
    }

    const { error: upsertError } = await supabase
        .from("web_loan_payouts")
        .upsert(
            {
                user_id: user.id,
                payout_method: payoutMethod,
                payout_details: payoutDetails,
                updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
        );

    if (upsertError) {
        console.error("Loan payout save error:", upsertError);
        redirect("/onboarding/details/loan-payout?error=Could not save payout details");
    }

    const { error: updateError } = await supabase
        .from("web_onboarding")
        .update({
            step_completed: 2,
            updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

    if (updateError) {
        console.error("Onboarding complete error:", updateError);
        redirect("/onboarding/details/loan-payout?error=Could not complete");
    }
    redirect("/dashboard");
}
