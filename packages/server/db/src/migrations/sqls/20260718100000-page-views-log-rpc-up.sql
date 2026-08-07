DROP POLICY IF EXISTS page_views_insert_public ON public.page_views;

CREATE OR REPLACE FUNCTION public.log_page_view(
  p_path text,
  p_visitor_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_term_id uuid;
BEGIN
  IF p_path IS NULL OR btrim(p_path) = '' OR p_path !~ '^/' THEN
    RETURN;
  END IF;

  IF p_visitor_id IS NULL THEN
    RETURN;
  END IF;

  SELECT id INTO v_term_id
  FROM public.terms
  WHERE is_active = true
  LIMIT 1;

  IF v_term_id IS NULL THEN
    RETURN;
  END IF;

  INSERT INTO public.page_views (path, term_id, visitor_id, user_id)
  VALUES (p_path, v_term_id, p_visitor_id, auth.uid());
END;
$$;
