import { Resend } from "resend";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceRoleClient } from "@/utils/supabase/server";
import type { RefundIntake } from "@/lib/refund/schema";
import { isAllowedEvidenceFile } from "@/lib/refund/schema";

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

function buildEmailHtml(body: {
  id: string;
  role: string;
  name: string;
  email: string;
  phone?: string;
  country_phone_code?: string;
  counterparty_name?: string;
  order_ref?: string;
  payment_tx_hash: string;
  amount: string;
  currency: string;
  blockchain?: string;
  incident_summary: string;
  evidence_url?: string;
  evidence_filename?: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Purchase refund request</title></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0a0a0a;color:#e5e5e5;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="background:#1a1a1a;border:1px solid #333;border-radius:12px;overflow:hidden;">
      <div style="background:#F9FF38;padding:24px;text-align:center;">
        <h1 style="margin:0;font-size:22px;font-weight:700;color:#0a0a0a;">Lenix Protocol</h1>
        <p style="margin:8px 0 0;font-size:14px;color:#333;">Purchase refund request</p>
      </div>
      <div style="padding:32px 24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:12px 0;border-bottom:1px solid #333;color:#a3a3a3;width:180px;">Case ID</td><td style="padding:12px 0;border-bottom:1px solid #333;color:#fff;">${escapeHtml(body.id)}</td></tr>
          <tr><td style="padding:12px 0;border-bottom:1px solid #333;color:#a3a3a3;">Role</td><td style="padding:12px 0;border-bottom:1px solid #333;color:#fff;">${escapeHtml(body.role)}</td></tr>
          <tr><td style="padding:12px 0;border-bottom:1px solid #333;color:#a3a3a3;">Name</td><td style="padding:12px 0;border-bottom:1px solid #333;color:#fff;">${escapeHtml(body.name)}</td></tr>
          <tr><td style="padding:12px 0;border-bottom:1px solid #333;color:#a3a3a3;">Email</td><td style="padding:12px 0;border-bottom:1px solid #333;color:#fff;">${escapeHtml(body.email)}</td></tr>
          <tr><td style="padding:12px 0;border-bottom:1px solid #333;color:#a3a3a3;">Phone</td><td style="padding:12px 0;border-bottom:1px solid #333;color:#fff;">${escapeHtml(body.phone ?? "")} (${escapeHtml(body.country_phone_code ?? "")})</td></tr>
          <tr><td style="padding:12px 0;border-bottom:1px solid #333;color:#a3a3a3;">Counterparty</td><td style="padding:12px 0;border-bottom:1px solid #333;color:#fff;">${escapeHtml(body.counterparty_name ?? "")}</td></tr>
          <tr><td style="padding:12px 0;border-bottom:1px solid #333;color:#a3a3a3;">Order ref</td><td style="padding:12px 0;border-bottom:1px solid #333;color:#fff;">${escapeHtml(body.order_ref ?? "")}</td></tr>
          <tr><td style="padding:12px 0;border-bottom:1px solid #333;color:#a3a3a3;">Payment proof</td><td style="padding:12px 0;border-bottom:1px solid #333;color:#fff;word-break:break-all;">${escapeHtml(body.payment_tx_hash)}</td></tr>
          <tr><td style="padding:12px 0;border-bottom:1px solid #333;color:#a3a3a3;">Amount</td><td style="padding:12px 0;border-bottom:1px solid #333;color:#fff;">${escapeHtml(body.amount)} ${escapeHtml(body.currency)}</td></tr>
          <tr><td style="padding:12px 0;border-bottom:1px solid #333;color:#a3a3a3;">Chain</td><td style="padding:12px 0;border-bottom:1px solid #333;color:#fff;">${escapeHtml(body.blockchain ?? "")}</td></tr>
          <tr><td style="padding:12px 0;vertical-align:top;color:#a3a3a3;">Incident</td><td style="padding:12px 0;color:#fff;white-space:pre-wrap;">${escapeHtml(body.incident_summary)}</td></tr>
          ${
            body.evidence_url
              ? `<tr><td style="padding:12px 0;color:#a3a3a3;">Evidence</td><td style="padding:12px 0;"><a href="${escapeHtml(body.evidence_url)}" style="color:#F9FF38;">${escapeHtml(body.evidence_filename ?? "file")}</a></td></tr>`
              : ""
          }
        </table>
        <p style="margin:24px 0 0;font-size:12px;color:#737373;">No payout has been issued. Case is in intake / underwriting.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export type SubmitRefundIntakeResult =
  | {
      ok: true;
      id: string;
      evidenceUrl?: string;
      evidenceFilename?: string;
    }
  | { ok: false; error: string };

export async function submitRefundIntake(options: {
  intake: RefundIntake;
  userId: string | null;
  evidenceFile?: File | null;
  actor: "user" | "public";
  admin?: SupabaseClient;
  sendEmail?: boolean;
}): Promise<SubmitRefundIntakeResult> {
  const admin = options.admin ?? createServiceRoleClient();
  const { intake, userId } = options;

  let evidenceUrl: string | undefined;
  let evidenceFilename: string | undefined;
  const evidenceFile = options.evidenceFile;

  if (evidenceFile instanceof File && evidenceFile.size > 0) {
    const allowed = isAllowedEvidenceFile(evidenceFile);
    if (!allowed.ok) {
      return { ok: false, error: allowed.error };
    }
    evidenceFilename = evidenceFile.name;
    const safeName = evidenceFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = userId
      ? `${userId}/${Date.now()}-${safeName}`
      : `anonymous/${Date.now()}-${safeName}`;
    const { data: uploadData, error: uploadError } = await admin.storage
      .from("onboarding-evidence")
      .upload(storagePath, evidenceFile, {
        upsert: false,
        contentType: evidenceFile.type || undefined,
      });
    if (uploadError || !uploadData?.path) {
      console.error("Refund evidence upload error:", uploadError);
      return { ok: false, error: "Failed to upload evidence" };
    }
    const { data: urlData } = admin.storage.from("onboarding-evidence").getPublicUrl(uploadData.path);
    evidenceUrl = urlData?.publicUrl ?? undefined;
  }

  const { data: inserted, error: insertError } = await admin
    .from("refund_requests")
    .insert({
      user_id: userId,
      role: intake.role,
      full_name: intake.name,
      email: intake.email,
      phone: intake.phone_number ?? null,
      country_phone_code: intake.country_phone_code ?? null,
      counterparty_name: intake.counterparty_name ?? null,
      order_ref: intake.order_ref ?? null,
      payment_tx_hash: intake.payment_tx_hash,
      amount: intake.amount,
      asset: intake.currency,
      chain: intake.blockchain ?? null,
      incident_summary: intake.incident_summary,
      evidence_url: evidenceUrl ?? null,
      evidence_filename: evidenceFilename ?? null,
      status: "pending",
      lifecycle: "intake",
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error("Refund insert error:", insertError);
    return { ok: false, error: "Failed to submit refund request" };
  }

  await admin.from("refund_events").insert({
    refund_request_id: inserted.id,
    event_type: "intake_submitted",
    actor: options.actor,
    payload: { role: intake.role, amount: intake.amount, asset: intake.currency },
  });

  if (options.sendEmail !== false && process.env.RESEND_API_KEY) {
    const { error: emailError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: [intake.email],
      subject: `[Purchase refund] ${intake.name} — ${intake.role}`,
      html: buildEmailHtml({
        id: inserted.id,
        role: intake.role,
        name: intake.name,
        email: intake.email,
        phone: intake.phone_number,
        country_phone_code: intake.country_phone_code,
        counterparty_name: intake.counterparty_name,
        order_ref: intake.order_ref,
        payment_tx_hash: intake.payment_tx_hash,
        amount: intake.amount,
        currency: intake.currency,
        blockchain: intake.blockchain,
        incident_summary: intake.incident_summary,
        evidence_url: evidenceUrl,
        evidence_filename: evidenceFilename,
      }),
    });
    if (emailError) {
      console.error("Refund email error:", emailError);
    }
  }

  return {
    ok: true,
    id: inserted.id,
    evidenceUrl,
    evidenceFilename,
  };
}
