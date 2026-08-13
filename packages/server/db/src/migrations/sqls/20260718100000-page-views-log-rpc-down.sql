DROP FUNCTION IF EXISTS public.log_page_view(text, uuid);

CREATE POLICY page_views_insert_public ON public.page_views
  FOR INSERT
  WITH CHECK (
    user_id IS NULL OR user_id = auth.uid()
  );
