import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Lenix Contact <onboarding@lenixprotocol.com>";
const TO_EMAIL = "recovery@lenixprotocol.com";

function buildEmailHtml(body: {
  name: string;
  email: string;
  subject: string;
  message: string;
  inquiryType: string;
  phone?: string;
  whatsappOrTelegram?: string;
}): string {
  const inquiryLabels: Record<string, string> = {
    general: "General Inquiry",
    recovery: "Recovery Services",
    crypto_loan: "Crypto Loan Services",
    support: "Technical Support",
    partnership: "Partnership",
    business: "Business Development",
    press: "Press & Media",
    other: "Other",
  };
  const inquiryLabel = inquiryLabels[body.inquiryType] || body.inquiryType;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; color: #e5e5e5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 32px 24px;">
    <div style="background: linear-gradient(135deg, #1a1a1a 0%, #262626 100%); border: 1px solid #333; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.4);">
      <!-- Header -->
      <div style="background: linear-gradient(90deg, #F9FF38 0%, #e6ed2e 100%); padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #0a0a0a;">Lenix Protocol</h1>
        <p style="margin: 8px 0 0; font-size: 14px; color: #333;">Contact Form Submission</p>
      </div>

      <!-- Content -->
      <div style="padding: 32px 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #333; font-weight: 600; color: #a3a3a3; width: 140px;">Name</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #333; color: #fff;">${escapeHtml(body.name)}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #333; font-weight: 600; color: #a3a3a3;">Email</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #333;">
              <a href="mailto:${escapeHtml(body.email)}" style="color: #F9FF38; text-decoration: none;">${escapeHtml(body.email)}</a>
            </td>
          </tr>
          ${body.phone ? `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #333; font-weight: 600; color: #a3a3a3;">Phone</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #333; color: #fff;">${escapeHtml(body.phone)}</td>
          </tr>
          ` : ""}
          ${body.whatsappOrTelegram ? `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #333; font-weight: 600; color: #a3a3a3;">WhatsApp / Telegram</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #333; color: #fff;">${escapeHtml(body.whatsappOrTelegram)}</td>
          </tr>
          ` : ""}
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #333; font-weight: 600; color: #a3a3a3;">Inquiry Type</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #333; color: #fff;">${escapeHtml(inquiryLabel)}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #333; font-weight: 600; color: #a3a3a3;">Subject</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #333; color: #fff;">${escapeHtml(body.subject)}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; vertical-align: top; font-weight: 600; color: #a3a3a3;">Message</td>
            <td style="padding: 12px 0; color: #fff; white-space: pre-wrap;">${escapeHtml(body.message)}</td>
          </tr>
        </table>

        <p style="margin: 24px 0 0; font-size: 12px; color: #737373;">
          This message was sent from the Lenix Protocol contact form at ${new Date().toUTCString()}.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      name,
      email,
      subject,
      message,
      inquiryType,
      phone,
      whatsappOrTelegram,
    } = body;

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, subject, and message are required" },
        { status: 400 }
      );
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const html = buildEmailHtml({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      inquiryType: inquiryType || "general",
      phone: phone?.trim() || undefined,
      whatsappOrTelegram: whatsappOrTelegram?.trim() || undefined,
    });

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: email.trim(),
      subject: `[Contact] ${subject.trim()}`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (e) {
    console.error("Contact API error:", e);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
