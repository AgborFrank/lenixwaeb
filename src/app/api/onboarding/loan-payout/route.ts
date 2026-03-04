import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Please log in" }, { status: 401 });
    }

    const { data: onboarding, error: onboardingError } = await supabase
      .from("web_onboarding")
      .select("service_type")
      .eq("user_id", user.id)
      .single();

    if (onboardingError || !onboarding || onboarding.service_type !== "loan") {
      return NextResponse.json(
        { error: "Invalid onboarding state" },
        { status: 400 }
      );
    }

    const payoutMethod = formData.get("payout_method") as string;
    if (
      !payoutMethod ||
      !["crypto", "wire_transfer", "bank"].includes(payoutMethod)
    ) {
      return NextResponse.json(
        { error: "Invalid payout method" },
        { status: 400 }
      );
    }

    const payoutDetails: Record<string, unknown> = {
      payout_method: payoutMethod,
    };

    const phoneNumber = String(formData.get("phone_number") || "").trim();
    const telegramOrWhatsapp = String(
      formData.get("telegram_or_whatsapp") || ""
    ).trim();
    if (phoneNumber) payoutDetails.phone_number = phoneNumber;
    if (telegramOrWhatsapp)
      payoutDetails.telegram_or_whatsapp = telegramOrWhatsapp;

    if (payoutMethod === "crypto") {
      const wallet_address = formData.get("wallet_address");
      const network = formData.get("network");
      const memo = formData.get("memo");
      if (!wallet_address || !network) {
        return NextResponse.json(
          { error: "Wallet address and network required" },
          { status: 400 }
        );
      }
      payoutDetails.wallet_address = String(wallet_address).trim();
      payoutDetails.network = String(network).trim();
      if (memo) payoutDetails.memo = String(memo).trim();
    } else if (payoutMethod === "wire_transfer") {
      const bank_name = formData.get("bank_name");
      const swift_bic = formData.get("swift_bic");
      const account_number = formData.get("account_number");
      const account_name = formData.get("account_name");
      if (!bank_name || !swift_bic || !account_number || !account_name) {
        return NextResponse.json(
          { error: "All wire transfer fields required" },
          { status: 400 }
        );
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
        return NextResponse.json(
          { error: "All bank fields required" },
          { status: 400 }
        );
      }
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
      return NextResponse.json(
        { error: "Could not save payout details" },
        { status: 500 }
      );
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
      return NextResponse.json(
        { error: "Could not complete" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Unexpected error in loan-payout:", e);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
