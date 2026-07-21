import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const BANKING_SERVICE_TYPES = ["transfer", "receive", "liquidation", "lending", "custody"] as const;

interface BankingRequestBody {
  name: string;
  phone_number?: string;
  country_phone_code?: string;
  country: string;
  banking_service: string;
  notes?: string;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: BankingRequestBody = await req.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!body.country || !body.country.trim()) {
      return NextResponse.json({ error: "Country is required" }, { status: 400 });
    }

    if (!body.banking_service || !BANKING_SERVICE_TYPES.includes(body.banking_service as any)) {
      return NextResponse.json({ error: "Valid banking service is required" }, { status: 400 });
    }

    const { data: onboarding } = await supabase
      .from("web_onboarding")
      .select("service_type, step_completed")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!onboarding || onboarding.service_type !== "banking") {
      return NextResponse.json(
        { error: "Banking service not selected in onboarding" },
        { status: 400 }
      );
    }

    if (onboarding.step_completed >= 2) {
      return NextResponse.json(
        { error: "Onboarding already completed" },
        { status: 400 }
      );
    }

    const details: Record<string, string> = {
      name: body.name.trim(),
      country: body.country.trim(),
      banking_service: body.banking_service,
    };

    if (body.phone_number && body.phone_number.trim()) {
      details.phone_number = body.phone_number.trim();
    }

    if (body.country_phone_code && body.country_phone_code.trim()) {
      details.country_phone_code = body.country_phone_code.trim();
    }

    if (body.notes && body.notes.trim()) {
      details.notes = body.notes.trim();
    }

    const { error: updateError } = await supabase
      .from("web_onboarding")
      .update({
        details: details,
        step_completed: 2,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Banking onboarding update error:", updateError);
      return NextResponse.json(
        { error: "Failed to save banking details" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Banking request submitted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Banking API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
