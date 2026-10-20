import { Resend } from "resend";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceRoleClient } from "@/utils/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Lenix Recovery <onboarding@lenixprotocol.com>";
const DEFAULT_TO_EMAIL = "recovery@lenixprotocol.com";

export interface RecoveryIntake {
  name: string;
  email: string;
  transaction_hash: string;
  amount_stolen: string;
  incident_summary: string;
  phone_number?: string;
  country_phone_code?: string;
  blockchain?: string;
  currency?: string;
  evidence_url?: string;
  evidence_filename?: string;
  source?: "onboarding" | "account" | "public";
}

function escapeHtml(text: string): string {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildEmailHtml(body: RecoveryIntake & { id: string }): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Recovery Request</title></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0a0a0a;color:#e5e5e5;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="background:#1a1a1a;border:1px solid #333;border-radius:12px;overflow:hidden;">
      <div style="background:#F9FF38;padding:24px;text-align:center;">
        <h1 style="margin:0;font-size:22px;font-weight:700;color:#0a0a0a;">Lenix Protocol</h1>
        <p style="margin:8px 0 0;font-size:14px;color:#333;">Asset recovery request</p>
      </div>
      <div style="padding:32px 24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:12px 0;border-bottom:1px solid #333;color:#a3a3a3;width:180px;">Case ID</td><td style="padding:12px 0;border-bottom:1px solid #333;color:#fff;">${escapeHtml(body.id)}</td></tr>
          <tr><td style="padding:12px 0;border-bottom:1px solid #333;color:#a3a3a3;">Name</td><td style="padding:12px 0;border-bottom:1px solid #333;color:#fff;">${escapeHtml(body.name)}</td></tr>
          <tr><td style="padding:12px 0;border-bottom:1px solid #333;color:#a3a3a3;">Email</td><td style="padding:12px 0;border-bottom:1px solid #333;color:#fff;">${escapeHtml(body.email)}</td></tr>
          <tr><td style="padding:12px 0;border-bottom:1px solid #333;color:#a3a3a3;">Trail / hash</td><td style="padding:12px 0;border-bottom:1px solid #333;color:#fff;word-break:break-all;">${escapeHtml(body.transaction_hash)}</td></tr>
          <tr><td style="padding:12px 0;border-bottom:1px solid #333;color:#a3a3a3;">Amount</td><td style="padding:12px 0;border-bottom:1px solid #333;color:#fff;">${escapeHtml(body.amount_stolen)} ${escapeHtml(body.currency ?? "")}</td></tr>
          <tr><td style="padding:12px 0;border-bottom:1px solid #333;color:#a3a3a3;">Chain</td><td style="padding:12px 0;border-bottom:1px solid #333;color:#fff;">${escapeHtml(body.blockchain ?? "")}</td></tr>
          <tr><td style="padding:12px 0;border-bottom:1px solid #333;color:#a3a3a3;">Phone</td><td style="padding:12px 0;border-bottom:1px solid #333;color:#fff;">${escapeHtml(body.phone_number ?? "")} (${escapeHtml(body.country_phone_code ?? "")})</td></tr>
          <tr><td style="padding:12px 0;vertical-align:top;color:#a3a3a3;">Summary</td><td style="padding:12px 0;color:#fff;white-space:pre-wrap;">${escapeHtml(body.incident_summary)}</td></tr>
          ${
            body.evidence_url
              ? `<tr><td style="padding:12px 0;color:#a3a3a3;">Evidence</td><td style="padding:12px 0;"><a href="${escapeHtml(body.evidence_url)}" style="color:#F9FF38;">${escapeHtml(body.evidence_filename ?? "file")}</a></td></tr>`
              : ""
          }
        </table>
        <p style="margin:24px 0 0;font-size:12px;color:#737373;">Source: ${escapeHtml(body.source ?? "account")} · ${new Date().toUTCString()}</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export type SubmitRecoveryIntakeResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export async function submitRecoveryIntake(options: {
  intake: RecoveryIntake;
  userId: string | null;
  evidenceFile?: File | null;
  admin?: SupabaseClient;
  sendEmail?: boolean;
  toEmail?: string;
}): Promise<SubmitRecoveryIntakeResult> {
  const admin = options.admin ?? createServiceRoleClient();
  const { intake, userId } = options;

  let evidenceUrl = intake.evidence_url;
  let evidenceFilename = intake.evidence_filename;
  const evidenceFile = options.evidenceFile;

  if (evidenceFile instanceof File && evidenceFile.size > 0) {
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
      console.error("Recovery evidence upload error:", uploadError);
      return { ok: false, error: "Failed to upload evidence" };
    }
    const { data: urlData } = admin.storage.from("onboarding-evidence").getPublicUrl(uploadData.path);
    evidenceUrl = urlData?.publicUrl ?? undefined;
  }

  const country =
    intake.country_phone_code?.includes(":") ?
      intake.country_phone_code.split(":")[0]
    : intake.country_phone_code ?? null;

  const { data: inserted, error: insertError } = await admin
    .from("recovery_requests")
    .insert({
      user_id: userId,
      full_name: intake.name,
      email: intake.email,
      phone: intake.phone_number ?? null,
      wallet_type: intake.blockchain ?? null,
      wallet_address: intake.transaction_hash,
      additional_details: intake.incident_summary,
      status: "pending",
      country,
      questionnaire_data: {
        kind: "stolen_assets",
        amount: intake.amount_stolen,
        currency: intake.currency ?? null,
        evidence_url: evidenceUrl ?? null,
        evidence_filename: evidenceFilename ?? null,
        source: intake.source ?? "account",
      },
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error("Recovery insert error:", insertError);
    return { ok: false, error: "Failed to save recovery request" };
  }

  if (options.sendEmail !== false && process.env.RESEND_API_KEY) {
    const to = options.toEmail ?? DEFAULT_TO_EMAIL;
    const { error: emailError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      replyTo: [intake.email],
      subject: `[Recovery Request] ${intake.name} - ${intake.blockchain || "N/A"}`,
      html: buildEmailHtml({ ...intake, id: inserted.id, evidence_url: evidenceUrl, evidence_filename: evidenceFilename }),
    });
    if (emailError) {
      console.error("Recovery email error:", emailError);
    }
  }

  return { ok: true, id: inserted.id };
}

const RECOVERY_LIST_COLUMNS =
  "id, user_id, full_name, email, phone, wallet_type, wallet_address, status, created_at, country, telegram";

export async function listAllRecoveryRequests(
  admin: SupabaseClient = createServiceRoleClient(),
) {
  const rows: Record<string, unknown>[] = [];
  const pageSize = 1000;
  let from = 0;

  while (from < 100_000) {
    const { data, error } = await admin
      .from("recovery_requests")
      .select(RECOVERY_LIST_COLUMNS)
      .order("created_at", { ascending: false })
      .range(from, from + pageSize - 1);

    if (error) {
      console.error("Failed to list recovery requests:", error);
      break;
    }
    if (!data?.length) break;
    rows.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }

  return rows;
}
