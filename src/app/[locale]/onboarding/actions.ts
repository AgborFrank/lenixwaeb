"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "@/i18n/navigation";
import { revalidatePath } from "next/cache";
import { firstZodMessage, refundIntakeSchema } from "@/lib/refund/schema";
import { submitRefundIntake } from "@/lib/refund/submit-intake";
import { submitRecoveryIntake } from "@/lib/recovery/submit-intake";

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

const BANKING_FIELDS = [
    "name",
    "phone_number",
    "country_phone_code",
    "country",
    "banking_service",
    "notes",
] as const;

export async function submitServiceSelection(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) await redirect("/login");

    const serviceType = formData.get("serviceType") as string;

    if (!serviceType) {
        await redirect(`/onboarding?error=${encodeURIComponent("Please select a service")}`);
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
        await redirect(`/onboarding?error=${encodeURIComponent("Something went wrong")}`);
    }

    await redirect("/onboarding/details");
}

export async function submitOnboardingDetails(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) await redirect("/login");

    // Fetch current service type to validate fields
    const { data: onboarding } = await supabase
        .from("web_onboarding")
        .select("service_type")
        .eq("user_id", user.id)
        .single();

    if (!onboarding) await redirect("/onboarding");

    const details: Record<string, unknown> = {};
    const serviceType = onboarding.service_type as string;

    let recoveryRequestId: string | undefined;
    if (serviceType === "recovery") {
        for (const key of RECOVERY_FIELDS) {
            const value = formData.get(key);
            if (value !== null && value !== undefined && value !== "")
                details[key] = String(value);
        }
        const evidenceFile = formData.get("evidence") as File | null;

        const name = String(details.name ?? "");
        const transaction_hash = String(details.transaction_hash ?? "");
        const amount_stolen = String(details.amount_stolen ?? "");
        const incident_summary = String(details.incident_summary ?? "");

        if (!name || !transaction_hash || !amount_stolen || !incident_summary) {
            await redirect(
                `/onboarding/details?error=${encodeURIComponent("Complete all required recovery fields")}`,
            );
        }

        const recoveryResult = await submitRecoveryIntake({
            intake: {
                name,
                email: user.email ?? "",
                transaction_hash,
                amount_stolen,
                incident_summary,
                phone_number: details.phone_number ? String(details.phone_number) : undefined,
                country_phone_code: details.country_phone_code
                    ? String(details.country_phone_code)
                    : undefined,
                blockchain: details.blockchain ? String(details.blockchain) : undefined,
                currency: details.currency ? String(details.currency) : undefined,
                source: "onboarding",
            },
            userId: user.id,
            evidenceFile:
                evidenceFile instanceof File && evidenceFile.size > 0 ? evidenceFile : null,
            sendEmail: true,
        });

        if (!recoveryResult.ok) {
            console.error("Recovery intake failed:", recoveryResult.error);
            await redirect(
                `/onboarding/details?error=${encodeURIComponent("Could not open recovery case")}`,
            );
        }

        recoveryRequestId = recoveryResult.id;
        details.recovery_request_id = recoveryRequestId;
        if (evidenceFile instanceof File && evidenceFile.size > 0) {
            details.evidence = evidenceFile.name;
        }
    } else if (serviceType === "banking") {
        for (const key of BANKING_FIELDS) {
            const value = formData.get(key);
            if (value !== null && value !== undefined && value !== "")
                details[key] = String(value);
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
        await redirect(`/onboarding/details?error=${encodeURIComponent("Could not save details")}`);
    }

    await redirect("/dashboard");
}

/** Loan step 1: save loan params only, then go to payout step */
export async function submitLoanStep1(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) await redirect("/login");

    const { data: onboarding } = await supabase
        .from("web_onboarding")
        .select("service_type")
        .eq("user_id", user.id)
        .single();
    if (!onboarding || onboarding.service_type !== "loan") await redirect("/onboarding");

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
        await redirect(`/onboarding/details?error=${encodeURIComponent("Could not save")}`);
    }
    await redirect("/onboarding/details/loan-payout");
}

export async function submitRefundOnboardingDetails(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) await redirect("/login");

    const { data: onboarding } = await supabase
        .from("web_onboarding")
        .select("service_type")
        .eq("user_id", user.id)
        .single();
    if (!onboarding || onboarding.service_type !== "refund") {
        await redirect("/onboarding");
    }

    const raw = {
        role: String(formData.get("role") ?? "").trim(),
        name: String(formData.get("name") ?? "").trim(),
        email: String(formData.get("email") ?? user.email ?? "").trim(),
        phone_number: String(formData.get("phone_number") ?? "").trim(),
        country_phone_code: String(formData.get("country_phone_code") ?? "").trim(),
        counterparty_name: String(formData.get("counterparty_name") ?? "").trim(),
        order_ref: String(formData.get("order_ref") ?? "").trim(),
        payment_tx_hash: String(formData.get("payment_tx_hash") ?? "").trim(),
        amount: String(formData.get("amount") ?? "").trim(),
        currency: String(formData.get("currency") ?? "").trim(),
        blockchain: String(formData.get("blockchain") ?? "").trim() || undefined,
        incident_summary: String(formData.get("incident_summary") ?? "").trim(),
    };

    const parsed = refundIntakeSchema.safeParse(raw);
    if (!parsed.success) {
        await redirect(
            `/onboarding/details?error=${encodeURIComponent(firstZodMessage(parsed.error))}`,
        );
    }

    const evidenceFile = formData.get("evidence");
    const result = await submitRefundIntake({
        intake: parsed.data,
        userId: user.id,
        evidenceFile: evidenceFile instanceof File ? evidenceFile : null,
        actor: "user",
    });

    if (!result.ok) {
        await redirect(`/onboarding/details?error=${encodeURIComponent(result.error)}`);
    }

    const details: Record<string, unknown> = {
        role: parsed.data.role,
        name: parsed.data.name,
        email: parsed.data.email,
        phone_number: parsed.data.phone_number,
        country_phone_code: parsed.data.country_phone_code,
        counterparty_name: parsed.data.counterparty_name,
        order_ref: parsed.data.order_ref,
        payment_tx_hash: parsed.data.payment_tx_hash,
        amount: parsed.data.amount,
        currency: parsed.data.currency,
        blockchain: parsed.data.blockchain,
        incident_summary: parsed.data.incident_summary,
        refund_request_id: result.id,
    };
    if (result.evidenceFilename) details.evidence = result.evidenceFilename;
    if (result.evidenceUrl) details.evidence_url = result.evidenceUrl;

    const { error } = await supabase
        .from("web_onboarding")
        .update({
            details,
            step_completed: 2,
            updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

    if (error) {
        console.error("Refund onboarding save error:", error);
        await redirect(`/onboarding/details?error=${encodeURIComponent("Could not save details")}`);
    }

    revalidatePath("/", "layout");
    await redirect("/dashboard");
}

