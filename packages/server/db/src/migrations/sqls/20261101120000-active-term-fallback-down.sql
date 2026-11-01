CREATE OR REPLACE FUNCTION public.active_term_id()
RETURNS UUID
LANGUAGE sql
STABLE
AS $$
  SELECT id
  FROM public.terms
  WHERE start_date <= now() AND now() <= end_date
  ORDER BY start_date DESC
  LIMIT 1
$$;
