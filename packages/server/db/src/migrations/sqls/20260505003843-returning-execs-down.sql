DROP TRIGGER IF EXISTS enforce_returning_exec_position_limit ON public.returning_exec_position_selections;
DROP FUNCTION IF EXISTS public.check_returning_exec_position_limit();
DROP TRIGGER IF EXISTS returning_exec_submissions_set_updated_at ON public.returning_exec_submissions;
DROP TABLE IF EXISTS public.returning_exec_position_selections;
DROP TABLE IF EXISTS public.returning_exec_submissions;
DROP TYPE IF EXISTS public.in_person_next_term_enum;

-- Revert terms nullability (restore state from prior migrations)
DROP TRIGGER IF EXISTS terms_sync_is_active_from_window ON public.terms;
DROP FUNCTION IF EXISTS public.terms_sync_is_active_from_window();

ALTER TABLE public.terms DROP CONSTRAINT IF EXISTS terms_is_active_implies_current_interval;
DROP INDEX IF EXISTS public.terms_at_most_one_active;

ALTER TABLE public.terms DROP COLUMN IF EXISTS end_date;

UPDATE public.terms
SET application_release_date = COALESCE(application_release_date, start_date, created_at, now())
WHERE application_release_date IS NULL;

UPDATE public.terms
SET application_soft_deadline = COALESCE(application_soft_deadline, application_release_date, created_at, now())
WHERE application_soft_deadline IS NULL;

UPDATE public.terms
SET application_hard_deadline = COALESCE(
  application_hard_deadline,
  application_soft_deadline + interval '15 minutes',
  '1970-01-01 00:00:00+00'::timestamptz
)
WHERE application_hard_deadline IS NULL;

ALTER TABLE public.terms
  ALTER COLUMN application_hard_deadline SET DEFAULT '1970-01-01 00:00:00+00'::timestamptz;

ALTER TABLE public.terms
  ALTER COLUMN application_release_date SET NOT NULL,
  ALTER COLUMN application_soft_deadline SET NOT NULL,
  ALTER COLUMN application_hard_deadline SET NOT NULL;

ALTER TABLE public.terms
  ALTER COLUMN is_active DROP NOT NULL,
  ALTER COLUMN start_date DROP NOT NULL;

CREATE OR REPLACE FUNCTION public.sync_terms_hard_deadline()
RETURNS TRIGGER AS $$
BEGIN
  NEW.application_hard_deadline := NEW.application_soft_deadline + interval '15 minutes';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
