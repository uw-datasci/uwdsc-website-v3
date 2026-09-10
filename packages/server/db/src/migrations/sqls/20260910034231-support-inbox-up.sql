ALTER TABLE public.contact_submissions
  ADD COLUMN resend_email_id TEXT UNIQUE,
  ADD COLUMN resolved_at     TIMESTAMPTZ,
  ADD COLUMN resolved_by     UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
