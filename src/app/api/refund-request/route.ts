import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { firstZodMessage, refundIntakeSchema } from "@/lib/refund/schema";
import { submitRefundIntake } from "@/lib/refund/submit-intake";

const MAX_BODY_BYTES = 9 * 1024 * 1024;

function clientKey(request: Request, email: string): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return `refund-intake:${ip}:${email.toLowerCase()}`;
}

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request is too large" }, { status: 413 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const formData = await request.formData();
    const raw = {
      role: String(formData.get("role") ?? "").trim(),
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
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

    if (user?.email && !raw.email) {
      raw.email = user.email;
    }

    const parsed = refundIntakeSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: firstZodMessage(parsed.error) }, { status: 400 });
    }

    const intake = parsed.data;

    if (!checkRateLimit(clientKey(request, intake.email), 5, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many refund requests. Try again in a few minutes." },
        { status: 429 },
      );
    }

    const evidenceFile = formData.get("evidence");
    const result = await submitRefundIntake({
      intake,
      userId: user?.id ?? null,
      evidenceFile: evidenceFile instanceof File ? evidenceFile : null,
      actor: user ? "user" : "public",
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error("Refund request API error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
