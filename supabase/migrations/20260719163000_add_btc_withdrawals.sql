CREATE TABLE IF NOT EXISTS public.btc_withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  wallet_id UUID NOT NULL REFERENCES public.user_wallets(id) ON DELETE CASCADE,
  destination_address TEXT NOT NULL,
  txid TEXT,
  amount_sats BIGINT NOT NULL CHECK (amount_sats > 0),
  fee_sats BIGINT NOT NULL DEFAULT 0 CHECK (fee_sats >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'broadcast', 'confirmed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS btc_withdrawals_user_created_idx
  ON public.btc_withdrawals(user_id, created_at DESC);

ALTER TABLE public.btc_withdrawals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS btc_withdrawals_select_own ON public.btc_withdrawals;
CREATE POLICY btc_withdrawals_select_own
  ON public.btc_withdrawals FOR SELECT
  USING (user_id = auth.uid()::TEXT);

DROP POLICY IF EXISTS btc_withdrawals_insert_own ON public.btc_withdrawals;
CREATE POLICY btc_withdrawals_insert_own
  ON public.btc_withdrawals FOR INSERT
  WITH CHECK (user_id = auth.uid()::TEXT);

DROP POLICY IF EXISTS btc_withdrawals_update_own ON public.btc_withdrawals;
CREATE POLICY btc_withdrawals_update_own
  ON public.btc_withdrawals FOR UPDATE
  USING (user_id = auth.uid()::TEXT)
  WITH CHECK (user_id = auth.uid()::TEXT);
