-- Platform & web3 settings stored as JSON per key (admin console).
create table if not exists public.system_configs (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.system_configs enable row level security;

-- No public policies: only service role / server routes access this table.
