"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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

