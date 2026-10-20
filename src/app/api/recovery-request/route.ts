import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { submitRecoveryIntake } from "@/lib/recovery/submit-intake";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 },
      );
    }

    const formData = await request.formData();
    const body: Record<string, string | undefined> = {};
    const keys = [
      "name",
      "email",
      "transaction_hash",
      "amount_stolen",
      "incident_summary",
      "phone_number",
      "country_phone_code",
      "blockchain",
      "currency",
    ];
    for (const key of keys) {
      const v = formData.get(key);
      body[key] = v != null ? String(v).trim() : undefined;
    }

    if (!body.name || !body.transaction_hash || !body.amount_stolen || !body.incident_summary) {
      return NextResponse.json(
        { error: "Name, transaction hash, amount, and incident summary are required" },
        { status: 400 },
      );
    }

    const email = body.email || user?.email;
    if (!email) {
      return NextResponse.json(
        { error: "Email is required when not logged in" },
        { status: 400 },
      );
    }

    const evidenceFile = formData.get("evidence") as File | null;

    const result = await submitRecoveryIntake({
      intake: {
        name: body.name,
        email,
        transaction_hash: body.transaction_hash,
        amount_stolen: body.amount_stolen,
        incident_summary: body.incident_summary,
        phone_number: body.phone_number,
        country_phone_code: body.country_phone_code,
        blockchain: body.blockchain,
        currency: body.currency,
        source: user ? "account" : "public",
      },
      userId: user?.id ?? null,
      evidenceFile:
        evidenceFile instanceof File && evidenceFile.size > 0 ? evidenceFile : null,
      sendEmail: true,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (e) {
    console.error("Recovery request API error:", e);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
