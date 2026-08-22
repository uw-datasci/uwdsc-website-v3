-- Restore the previous behaviour: application_hard_deadline is always derived
-- from application_soft_deadline (soft + 15 minutes), and is nulled out if the
-- soft deadline is cleared on UPDATE. Direct hard-deadline edits are no longer
-- possible once this trigger signature is restored.
CREATE OR REPLACE FUNCTION public.sync_terms_hard_deadline()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.application_soft_deadline IS NOT NULL THEN
    NEW.application_hard_deadline := NEW.application_soft_deadline + interval '15 minutes';
  ELSIF TG_OP = 'UPDATE' THEN
    NEW.application_hard_deadline := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS terms_sync_hard_deadline ON public.terms;
CREATE TRIGGER terms_sync_hard_deadline
BEFORE INSERT OR UPDATE OF application_soft_deadline ON public.terms
FOR EACH ROW EXECUTE FUNCTION public.sync_terms_hard_deadline();
