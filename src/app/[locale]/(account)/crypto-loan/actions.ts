"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const LOAN_EMAIL_FROM =
  process.env.RESEND_FROM_EMAIL || "Lenix Protocol <noreply@lenixprotocol.com>";
const LOAN_EMAIL_TO = "loan@lenixprotocol.com";

function escapeHtml(t: string): string {
  return String(t ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildLoanRequestEmailHtml(params: {
  userEmail: string;
  loanTypeName: string;
  borrowAmount: number;
  collateralAsset: string;
  duration: string;
  payoutMethod: string;
  payoutDetails: Record<string, string>;
  phoneNumber: string;
  telegramOrWhatsapp: string;
}): string {
  const {
    userEmail,
    loanTypeName,
    borrowAmount,
    collateralAsset,
    duration,
    payoutMethod,
    payoutDetails,
    phoneNumber,
    telegramOrWhatsapp,
  } = params;
  const payoutRows = Object.entries(payoutDetails)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #333;font-weight:600;color:#a3a3a3;width:160px;">${escapeHtml(k)}</td><td style="padding:8px 0;border-bottom:1px solid #333;color:#fff;">${escapeHtml(v)}</td></tr>`
    )
    .join("");
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Loan Request</title></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0a0a0a;color:#e5e5e5;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:linear-gradient(135deg,#1a1a1a 0%,#262626 100%);border:1px solid #333;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(90deg,#F9FF38 0%,#e6ed2e 100%);padding:20px;text-align:center;">
        <h1 style="margin:0;font-size:20px;font-weight:700;color:#0a0a0a;">Lenix Protocol</h1>
        <p style="margin:6px 0 0;font-size:13px;color:#333;">Crypto Loan Request</p>
      </div>
      <div style="padding:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;border-bottom:1px solid #333;font-weight:600;color:#a3a3a3;width:160px;">Applicant (email)</td><td style="padding:8px 0;border-bottom:1px solid #333;color:#fff;">${escapeHtml(userEmail)}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #333;font-weight:600;color:#a3a3a3;">Loan type</td><td style="padding:8px 0;border-bottom:1px solid #333;color:#fff;">${escapeHtml(loanTypeName)}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #333;font-weight:600;color:#a3a3a3;">Borrow amount (USD)</td><td style="padding:8px 0;border-bottom:1px solid #333;color:#fff;">${escapeHtml(String(borrowAmount))}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #333;font-weight:600;color:#a3a3a3;">Collateral asset</td><td style="padding:8px 0;border-bottom:1px solid #333;color:#fff;">${escapeHtml(collateralAsset)}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #333;font-weight:600;color:#a3a3a3;">Duration</td><td style="padding:8px 0;border-bottom:1px solid #333;color:#fff;">${escapeHtml(duration)} months</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #333;font-weight:600;color:#a3a3a3;">Phone</td><td style="padding:8px 0;border-bottom:1px solid #333;color:#fff;">${escapeHtml(phoneNumber) || "—"}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #333;font-weight:600;color:#a3a3a3;">Telegram / WhatsApp</td><td style="padding:8px 0;border-bottom:1px solid #333;color:#fff;">${escapeHtml(telegramOrWhatsapp) || "—"}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #333;font-weight:600;color:#a3a3a3;">Payout method</td><td style="padding:8px 0;border-bottom:1px solid #333;color:#fff;">${escapeHtml(payoutMethod)}</td></tr>
          ${payoutRows}
        </table>
        <p style="margin:16px 0 0;font-size:12px;color:#737373;">Submitted from Crypto Loan (Apply) at ${new Date().toUTCString()}.</p>
      </div>
    </div>
  </div>
</body>
</html>`.trim();
}

export interface Loan {
    id: string;
    user_id: string;
    borrow_amount: number;
    borrow_asset: string;
    collateral_amount: number;
    collateral_asset: string;
    apy: number;
    health_factor: number;
    status: string;
    start_date: string;
    due_date: string | null;
    request_details?: {
        duration?: string;
        payout_method?: string;
        payout_details?: Record<string, string>;
        phone_number?: string;
        telegram_or_whatsapp?: string;
    } | null;
}

export async function getUserLoans(): Promise<Loan[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from("active_loans")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching loans:", error);
        return [];
    }

    return data as Loan[];
}

export async function applyForLoan(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "User not authenticated" };
    }

    const loanTypeId = formData.get("loan_type_id");
    const borrowAmount = Number(formData.get("loan_amount"));
    const collateralAsset = String(formData.get("collateral_asset"));
    const duration = formData.get("duration");
    const payoutMethod = String(formData.get("payout_method"));

    if (!borrowAmount || !loanTypeId) {
        return { error: "Missing required loan details" };
    }

    // Fetch Loan Type to get rates
    const { data: loanType } = await supabase
        .from("loan_types")
        .select("*")
        .eq("id", loanTypeId)
        .single();

    if (!loanType) {
        return { error: "Invalid loan type selected" };
    }

    // Mock Collateral Calculation (In real app, fetch price)
    // Assume BTC = $50k, ETH = $3000, SOL = $100
    // Collateral needed = Borrow Amount / (LTV / 100)
    // Let's just store what they asked for logic-wise or calculate a mock amount
    // For this demo, let's assume they have enough and just set a safe collateral amount based on LTV
    const ltvDecimal = Number(loanType.ltv) / 100;
    // Mock Price
    const price = collateralAsset === "BTC" ? 50000 : collateralAsset === "ETH" ? 3000 : 100;
    const requiredCollateralValue = borrowAmount / ltvDecimal;
    const collateralAmount = requiredCollateralValue / price;

    // Save Payout Preference
    const payoutDetails: Record<string, string> = { payout_method: payoutMethod };
    if (payoutMethod === "crypto") {
        payoutDetails.wallet_address = String(formData.get("wallet_address") || "").trim();
        payoutDetails.network = String(formData.get("network") || "").trim();
    } else if (payoutMethod === "wire_transfer") {
        const bank_name = formData.get("bank_name");
        const swift_bic = formData.get("swift_bic");
        const account_number = formData.get("account_number");
        const account_name = formData.get("account_name");
        if (!bank_name || !swift_bic || !account_number || !account_name) {
            return { error: "All wire transfer fields are required" };
        }
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
        if (!bank_name || !account_number || !routing_iban || !account_holder) {
            return { error: "All bank deposit fields are required" };
        }
        payoutDetails.bank_name = String(bank_name).trim();
        payoutDetails.account_number = String(account_number).trim();
        payoutDetails.routing_iban = String(routing_iban).trim();
        payoutDetails.account_holder = String(account_holder).trim();
    }

    // Upsert payout details logic (following onboarding pattern)
    await supabase.from("web_loan_payouts").upsert({
        user_id: user.id,
        payout_method: payoutMethod,
        payout_details: payoutDetails,
        updated_at: new Date().toISOString()
    }, { onConflict: "user_id" });


    // Contact details for reaching the applicant
    const phoneNumber = String(formData.get("phone_number") || "").trim();
    const telegramOrWhatsapp = String(formData.get("telegram_or_whatsapp") || "").trim();

    // Build request details for View Details
    const requestDetails: Record<string, unknown> = {
        duration: String(duration || "12"),
        payout_method: payoutMethod,
        payout_details: payoutDetails,
    };
    if (phoneNumber) requestDetails.phone_number = phoneNumber;
    if (telegramOrWhatsapp) requestDetails.telegram_or_whatsapp = telegramOrWhatsapp;

    // Create Active Loan
    const { error } = await supabase.from("active_loans").insert({
        user_id: user.id,
        borrow_amount: borrowAmount,
        borrow_asset: "USDT", // Defaulting to USDT as per form implication
        collateral_amount: parseFloat(collateralAmount.toFixed(6)),
        collateral_asset: collateralAsset,
        apy: loanType.interest_rate,
        health_factor: 2.50, // Starting safe
        status: 'Active',
        start_date: new Date().toISOString(),
        request_details: requestDetails,
    });

    if (error) {
        console.error("Loan application error:", error);
        return { error: "Failed to submit loan application" };
    }

    // Send loan request to loan@lenixprotocol.com (verified Resend domain)
    if (process.env.RESEND_API_KEY) {
        const html = buildLoanRequestEmailHtml({
            userEmail: user.email ?? "",
            loanTypeName: String(loanType.name ?? ""),
            borrowAmount,
            collateralAsset,
            duration: String(duration ?? "12"),
            payoutMethod,
            payoutDetails,
            phoneNumber,
            telegramOrWhatsapp: telegramOrWhatsapp,
        });
        await resend.emails.send({
            from: LOAN_EMAIL_FROM,
            to: [LOAN_EMAIL_TO],
            subject: `[Loan Request] ${user.email ?? "User"} — ${borrowAmount} USD (${loanType.name ?? ""})`,
            html,
        }).catch((err) => console.error("Loan request email error:", err));
    }

    revalidatePath("/crypto-loan");
    return { success: true };
}

export async function repayLoan(loanId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    const { error } = await supabase
        .from("active_loans")
        .update({ status: "Repaid" })
        .eq("id", loanId)
        .eq("user_id", user.id);

    if (error) {
        console.error("Repay error:", error);
        return { error: "Failed to repay loan" };
    }

    revalidatePath("/crypto-loan");
    return { success: true };
}
