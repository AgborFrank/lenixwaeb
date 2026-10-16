-- Add 'refund' to web_onboarding service_type check constraint
ALTER TABLE public.web_onboarding 
  DROP CONSTRAINT IF EXISTS web_onboarding_service_type_check,
  ADD CONSTRAINT web_onboarding_service_type_check 
  CHECK (service_type = ANY (ARRAY['recovery'::text, 'loan'::text, 'banking'::text, 'refund'::text]));
