import { Resend } from "resend";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Lenix Recovery <onboarding@lenixprotocol.com>";
const TO_EMAIL = "recovery@lenixprotocol.com";

function escapeHtml(text: string): string {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildEmailHtml(body: Record<string, string | undefined>): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recovery Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #e5e5e5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 32px 24px;">
    <div style="background: linear-gradient(135deg, #1a1a1a 0%, #262626 100%); border: 1px solid #333; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(90deg, #F9FF38 0%, #e6ed2e 100%); padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #0a0a0a;">Lenix Protocol</h1>
        <p style="margin: 8px 0 0; font-size: 14px; color: #333;">Asset Recovery Request</p>
      </div>
      <div style="padding: 32px 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 12px 0; border-bottom: 1px solid #333; font-weight: 600; color: #a3a3a3; width: 180px;">Name</td><td style="padding: 12px 0; border-bottom: 1px solid #333; color: #fff;">${escapeHtml(body.name ?? "")}</td></tr>
          <tr><td style="padding: 12px 0; border-bottom: 1px solid #333; font-weight: 600; color: #a3a3a3;">Transaction hash / Wallet</td><td style="padding: 12px 0; border-bottom: 1px solid #333; color: #fff; word-break: break-all;">${escapeHtml(body.transaction_hash ?? "")}</td></tr>
          <tr><td style="padding: 12px 0; border-bottom: 1px solid #333; font-weight: 600; color: #a3a3a3;">Amount stolen</td><td style="padding: 12px 0; border-bottom: 1px solid #333; color: #fff;">${escapeHtml(body.amount_stolen ?? "")}</td></tr>
          <tr><td style="padding: 12px 0; border-bottom: 1px solid #333; font-weight: 600; color: #a3a3a3;">Blockchain</td><td style="padding: 12px 0; border-bottom: 1px solid #333; color: #fff;">${escapeHtml(body.blockchain ?? "")}</td></tr>
          <tr><td style="padding: 12px 0; border-bottom: 1px solid #333; font-weight: 600; color: #a3a3a3;">Currency</td><td style="padding: 12px 0; border-bottom: 1px solid #333; color: #fff;">${escapeHtml(body.currency ?? "")}</td></tr>
          <tr><td style="padding: 12px 0; border-bottom: 1px solid #333; font-weight: 600; color: #a3a3a3;">Email</td><td style="padding: 12px 0; border-bottom: 1px solid #333; color: #fff;">${escapeHtml(body.email ?? body.user_email ?? "")}</td></tr>
          <tr><td style="padding: 12px 0; border-bottom: 1px solid #333; font-weight: 600; color: #a3a3a3;">Phone</td><td style="padding: 12px 0; border-bottom: 1px solid #333; color: #fff;">${escapeHtml(body.phone_number ?? "")} (${escapeHtml(body.country_phone_code ?? "")})</td></tr>
          <tr><td style="padding: 12px 0; vertical-align: top; font-weight: 600; color: #a3a3a3;">Incident Summary</td><td style="padding: 12px 0; color: #fff; white-space: pre-wrap;">${escapeHtml(body.incident_summary ?? "")}</td></tr>
          ${body.evidence_url ? `<tr><td style="padding: 12px 0; font-weight: 600; color: #a3a3a3;">Evidence</td><td style="padding: 12px 0;"><a href="${escapeHtml(body.evidence_url ?? "")}" style="color: #F9FF38;">${escapeHtml(body.evidence ?? "")}</a></td></tr>` : ""}
        </table>
        <p style="margin: 24px 0 0; font-size: 12px; color: #737373;">Submitted from Recovery Services at ${new Date().toUTCString()}.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 }
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
        { status: 400 }
      );
    }

    // For logged-in users, use their email. For public form, require email.
    if (user) {
      body.user_email = user.email ?? undefined;
    } else if (!body.email) {
      return NextResponse.json(
        { error: "Email is required when not logged in" },
        { status: 400 }
      );
    }

    const evidenceFile = formData.get("evidence") as File | null;
    if (evidenceFile instanceof File && evidenceFile.size > 0) {
      body.evidence = evidenceFile.name;
      try {
        const storagePath = user
          ? `${user.id}/${Date.now()}-${evidenceFile.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`
          : `anonymous/${Date.now()}-${evidenceFile.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("onboarding-evidence")
          .upload(storagePath, evidenceFile, { upsert: false });
        if (!uploadError && uploadData?.path) {
          const { data: urlData } = supabase.storage
            .from("onboarding-evidence")
            .getPublicUrl(uploadData.path);
          body.evidence_url = urlData?.publicUrl ?? undefined;
        }
      } catch {
        // Continue without evidence URL
      }
    }

    const html = buildEmailHtml(body);

    const replyTo = body.email ?? body.user_email;
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      ...(replyTo && { replyTo: [replyTo] }),
      subject: `[Recovery Request] ${body.name} - ${body.blockchain || "N/A"}`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to submit recovery request" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Recovery request API error:", e);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
