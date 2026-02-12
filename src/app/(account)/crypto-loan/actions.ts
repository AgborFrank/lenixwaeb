"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

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
    const payoutDetails: any = { method: payoutMethod };
    if (payoutMethod === "crypto") {
        payoutDetails.wallet_address = formData.get("wallet_address");
        payoutDetails.network = formData.get("network");
    } else {
        // Mock bank details from "placeholder"
        payoutDetails.bank_name = "Mock Bank";
        payoutDetails.account_number = "****1234";
    }

    // Upsert payout details logic (following onboarding pattern)
    await supabase.from("web_loan_payouts").upsert({
        user_id: user.id,
        payout_method: payoutMethod,
        payout_details: payoutDetails,
        updated_at: new Date().toISOString()
    }, { onConflict: "user_id" });


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
        start_date: new Date().toISOString()
        // We could store loan_type_id if schema allowed, but it wasn't in original plan.
        // Terms are captured in APY/Amounts.
    });

    if (error) {
        console.error("Loan application error:", error);
        return { error: "Failed to submit loan application" };
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
