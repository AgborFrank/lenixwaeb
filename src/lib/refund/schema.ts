import { z } from "zod";
import {
  ALLOWED_EVIDENCE_TYPES,
  MAX_EVIDENCE_BYTES,
  REFUND_ASSETS,
  REFUND_CHAINS,
  REFUND_LIFECYCLES,
  REFUND_MODES,
  REFUND_ROLES,
  REFUND_STATUSES,
} from "./constants";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined));

export const refundIntakeSchema = z.object({
  role: z.enum(REFUND_ROLES),
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(254),
  phone_number: optionalText(40),
  country_phone_code: optionalText(20),
  counterparty_name: optionalText(160),
  order_ref: optionalText(120),
  payment_tx_hash: z
    .string()
    .trim()
    .min(8, "Payment proof or transaction hash is required")
    .max(256),
  amount: z.string().trim().min(1, "Amount is required").max(40),
  currency: z.enum(REFUND_ASSETS),
  blockchain: optionalText(32).pipe(z.enum(REFUND_CHAINS).optional()),
  incident_summary: z
    .string()
    .trim()
    .min(20, "Describe what fell short of the purchase, in a few sentences")
    .max(4000),
});

export const refundAdminUpdateSchema = z.object({
  id: z.string().uuid("Invalid request ID"),
  status: z.enum(REFUND_STATUSES).optional(),
  lifecycle: z.enum(REFUND_LIFECYCLES).optional(),
  refund_mode: z.enum(REFUND_MODES).optional(),
  admin_notes: z.string().max(4000).optional(),
});

export function firstZodMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Invalid request";
}

export function isAllowedEvidenceFile(file: File): { ok: true } | { ok: false; error: string } {
  if (file.size <= 0) {
    return { ok: false, error: "Evidence file is empty" };
  }
  if (file.size > MAX_EVIDENCE_BYTES) {
    return { ok: false, error: "Evidence must be 8 MB or smaller" };
  }
  if (!ALLOWED_EVIDENCE_TYPES.includes(file.type as (typeof ALLOWED_EVIDENCE_TYPES)[number])) {
    return { ok: false, error: "Evidence must be a PDF, JPG, PNG, or WebP file" };
  }
  return { ok: true };
}

export type RefundIntake = z.infer<typeof refundIntakeSchema>;
