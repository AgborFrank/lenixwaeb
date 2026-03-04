-- Add request_details JSONB column to active_loans for storing loan application details (duration, payout method, payout details)
ALTER TABLE active_loans ADD COLUMN IF NOT EXISTS request_details JSONB;
