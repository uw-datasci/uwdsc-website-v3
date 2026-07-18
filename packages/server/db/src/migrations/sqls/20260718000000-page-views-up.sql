CREATE TABLE public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL,
  visited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  term_id UUID NOT NULL REFERENCES public.terms(id) ON DELETE RESTRICT,
  visitor_id UUID NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  CONSTRAINT page_views_path_starts_with_slash CHECK (path ~ '^/')
);

CREATE INDEX page_views_term_id_path_idx ON public.page_views (term_id, path);
CREATE INDEX page_views_term_id_visited_at_idx ON public.page_views (term_id, visited_at DESC);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY page_views_insert_public ON public.page_views
  FOR INSERT
  WITH CHECK (
    user_id IS NULL OR user_id = auth.uid()
  );

CREATE POLICY page_views_select_exec_admin ON public.page_views
  FOR SELECT
  USING (public.is_exec_or_admin(auth.uid()));
