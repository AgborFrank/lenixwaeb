ALTER TABLE public.loans DROP CONSTRAINT loans_status_check;
ALTER TABLE public.loans ADD CONSTRAINT loans_status_check CHECK (
  status = ANY (ARRAY[
    'pending'::text,
    'approved'::text,
    'active'::text,
    'completed'::text,
    'rejected'::text,
    'defaulted'::text,
    'repaid'::text,
    'liquidated'::text
  ])
);
