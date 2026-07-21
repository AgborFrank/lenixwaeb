ALTER TABLE public.user_wallets
  ADD COLUMN IF NOT EXISTS bitcoin_xpub TEXT,
  ADD COLUMN IF NOT EXISTS bitcoin_next_index INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS bitcoin_network TEXT NOT NULL DEFAULT 'mainnet';

ALTER TABLE public.user_wallets
  DROP CONSTRAINT IF EXISTS user_wallets_bitcoin_network_check;

ALTER TABLE public.user_wallets
  ADD CONSTRAINT user_wallets_bitcoin_network_check
  CHECK (bitcoin_network IN ('mainnet', 'testnet'));

CREATE UNIQUE INDEX IF NOT EXISTS user_wallets_bitcoin_xpub_unique
  ON public.user_wallets (bitcoin_xpub)
  WHERE bitcoin_xpub IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.btc_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  wallet_id UUID NOT NULL REFERENCES public.user_wallets(id) ON DELETE CASCADE,
  derivation_index INTEGER NOT NULL CHECK (derivation_index >= 0),
  address TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'used', 'disabled')),
  first_seen_at TIMESTAMPTZ,
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(wallet_id, derivation_index)
);

CREATE INDEX IF NOT EXISTS btc_addresses_user_id_idx
  ON public.btc_addresses(user_id);
CREATE INDEX IF NOT EXISTS btc_addresses_wallet_status_idx
  ON public.btc_addresses(wallet_id, status);

ALTER TABLE public.btc_addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS btc_addresses_select_own ON public.btc_addresses;
CREATE POLICY btc_addresses_select_own
  ON public.btc_addresses FOR SELECT
  USING (user_id = auth.uid()::TEXT);

DROP POLICY IF EXISTS btc_addresses_insert_own ON public.btc_addresses;
CREATE POLICY btc_addresses_insert_own
  ON public.btc_addresses FOR INSERT
  WITH CHECK (user_id = auth.uid()::TEXT);

DROP POLICY IF EXISTS btc_addresses_update_own ON public.btc_addresses;
CREATE POLICY btc_addresses_update_own
  ON public.btc_addresses FOR UPDATE
  USING (user_id = auth.uid()::TEXT)
  WITH CHECK (user_id = auth.uid()::TEXT);

CREATE TABLE IF NOT EXISTS public.btc_deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  wallet_id UUID NOT NULL REFERENCES public.user_wallets(id) ON DELETE CASCADE,
  address_id UUID NOT NULL REFERENCES public.btc_addresses(id) ON DELETE RESTRICT,
  txid TEXT NOT NULL,
  vout INTEGER NOT NULL CHECK (vout >= 0),
  amount_sats BIGINT NOT NULL CHECK (amount_sats > 0),
  confirmations INTEGER NOT NULL DEFAULT 0 CHECK (confirmations >= 0),
  block_height INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'reorged')),
  credited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(txid, vout)
);

CREATE INDEX IF NOT EXISTS btc_deposits_user_created_idx
  ON public.btc_deposits(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS btc_deposits_wallet_status_idx
  ON public.btc_deposits(wallet_id, status);

ALTER TABLE public.btc_deposits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS btc_deposits_select_own ON public.btc_deposits;
CREATE POLICY btc_deposits_select_own
  ON public.btc_deposits FOR SELECT
  USING (user_id = auth.uid()::TEXT);

DROP POLICY IF EXISTS btc_deposits_insert_own ON public.btc_deposits;
CREATE POLICY btc_deposits_insert_own
  ON public.btc_deposits FOR INSERT
  WITH CHECK (user_id = auth.uid()::TEXT);

DROP POLICY IF EXISTS btc_deposits_update_own ON public.btc_deposits;
CREATE POLICY btc_deposits_update_own
  ON public.btc_deposits FOR UPDATE
  USING (user_id = auth.uid()::TEXT)
  WITH CHECK (user_id = auth.uid()::TEXT);
