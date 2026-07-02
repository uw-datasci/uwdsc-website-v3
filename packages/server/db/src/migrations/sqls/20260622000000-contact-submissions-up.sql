CREATE TYPE public.contact_source_enum AS ENUM ('contact_form', 'email');

CREATE TABLE public.contact_submissions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  subject     TEXT NOT NULL,
  message     TEXT NOT NULL,
  source      public.contact_source_enum NOT NULL DEFAULT 'contact_form',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY contact_submissions_insert_public ON public.contact_submissions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY contact_submissions_select_admin ON public.contact_submissions
  FOR SELECT
  USING (public.is_admin(auth.uid()));

GRANT INSERT ON public.contact_submissions TO authenticated, anon;
GRANT SELECT ON public.contact_submissions TO service_role;
