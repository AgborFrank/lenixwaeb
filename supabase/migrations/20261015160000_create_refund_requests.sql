-- Purchase refund cases (Lenix recovery flow + Reshop/Reveni-style underwriting).
-- Public intake writes through the service role; authenticated users may read their own rows.

CREATE TABLE IF NOT EXISTS public.refund_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  role text NOT NULL CHECK (role IN ('buyer', 'seller')),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  country_phone_code text,
  counterparty_name text,
  order_ref text,
  payment_tx_hash text NOT NULL,
  amount text NOT NULL,
  asset text NOT NULL DEFAULT 'USD',
  chain text,
  incident_summary text NOT NULL,
  evidence_url text,
  evidence_filename text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
  lifecycle text NOT NULL DEFAULT 'intake' CHECK (lifecycle IN (
    'intake',
    'underwriting',
    'terms_pending',
    'instant_paid',
    'awaiting_return',
    'in_transit',
    'received',
    'clawback_open',
    'settled',
    'rejected'
  )),
  risk_score numeric,
  risk_reasons jsonb,
  refund_mode text CHECK (refund_mode IS NULL OR refund_mode IN ('instant', 'standard', 'reject')),
  payout_destination text,
  admin_notes text,
  terms_accepted_at timestamptz,
  return_due_at timestamptz,
  tracking_number text,
  carrier text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.refund_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  refund_request_id uuid NOT NULL REFERENCES public.refund_requests (id) ON DELETE CASCADE,
  event_type text NOT NULL,
  actor text NOT NULL DEFAULT 'system',
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS refund_requests_user_id_created_at_idx
  ON public.refund_requests (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS refund_requests_status_created_at_idx
  ON public.refund_requests (status, created_at DESC);

CREATE INDEX IF NOT EXISTS refund_requests_lifecycle_idx
  ON public.refund_requests (lifecycle);

CREATE INDEX IF NOT EXISTS refund_events_request_id_created_at_idx
  ON public.refund_events (refund_request_id, created_at DESC);

COMMENT ON TABLE public.refund_requests IS 'Purchase refund cases opened by buyers or sellers. Instant payouts are underwritten separately; this table is the case file.';
COMMENT ON TABLE public.refund_events IS 'Append-only audit log for refund case transitions, payouts, and clawbacks.';

ALTER TABLE public.refund_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refund_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY refund_requests_select_own
  ON public.refund_requests
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY refund_events_select_own
  ON public.refund_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.refund_requests r
      WHERE r.id = refund_events.refund_request_id
        AND r.user_id = auth.uid()
    )
  );
