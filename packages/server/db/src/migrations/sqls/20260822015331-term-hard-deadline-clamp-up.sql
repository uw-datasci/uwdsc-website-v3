-- The hard deadline is now the real cutoff for the apply page and every application
-- API; the soft deadline is display-only. Presidents set both from
-- /applications/settings, so the trigger no longer overwrites an explicitly chosen
-- hard deadline -- it only clamps it up to the 15-minute grace minimum.
CREATE OR REPLACE FUNCTION public.sync_terms_hard_deadline()
RETURNS TRIGGER AS $$
BEGIN
  -- Nothing to clamp against; leave whatever was supplied.
  IF NEW.application_soft_deadline IS NULL THEN
    RETURN NEW;
  END IF;

  IF NEW.application_hard_deadline IS NULL
     OR NEW.application_hard_deadline < NEW.application_soft_deadline + interval '15 minutes'
  THEN
    NEW.application_hard_deadline := NEW.application_soft_deadline + interval '15 minutes';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Must also fire when only the hard deadline changes, or a direct hard-deadline
-- edit skips the clamp entirely.
DROP TRIGGER IF EXISTS terms_sync_hard_deadline ON public.terms;
CREATE TRIGGER terms_sync_hard_deadline
BEFORE INSERT OR UPDATE OF application_soft_deadline, application_hard_deadline ON public.terms
FOR EACH ROW EXECUTE FUNCTION public.sync_terms_hard_deadline();
