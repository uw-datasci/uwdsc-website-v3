-- Between terms (one has ended, the next hasn't started) the active term stays on the term
-- that started most recently, so memberships, the hiring cycle and the team page carry over.
CREATE OR REPLACE FUNCTION public.active_term_id()
RETURNS UUID
LANGUAGE sql
STABLE
AS $$
  SELECT id
  FROM public.terms
  WHERE start_date <= now()
  ORDER BY start_date DESC
  LIMIT 1
$$;
