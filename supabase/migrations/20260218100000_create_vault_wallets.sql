-- Vault wallets: store multiple imported external wallets per user (seed phrases / private keys)
-- Same encryption structure as user_wallets (Lenix wallet)
CREATE TABLE IF NOT EXISTS vault_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_name TEXT NOT NULL,
  wallet_type TEXT NOT NULL CHECK (wallet_type IN ('seed_phrase', 'private_key')),
  ethereum_address TEXT NOT NULL,
  encrypted_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, ethereum_address)
);

CREATE INDEX IF NOT EXISTS idx_vault_wallets_user_id ON vault_wallets(user_id);

-- RLS
ALTER TABLE vault_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own vault wallets"
  ON vault_wallets FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
