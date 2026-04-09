-- ============================================================================
-- 1. New enum for term type
-- ============================================================================
CREATE TYPE public.term_type_enum AS ENUM ('study', 'coop');

-- ============================================================================
-- 2. Add onboarding date columns to terms
-- ============================================================================
ALTER TABLE public.terms
  ADD COLUMN start_date TIMESTAMPTZ,
  ADD COLUMN onboarding_due_date   TIMESTAMPTZ;

-- ============================================================================
-- 3. exec_form_submissions table
-- ============================================================================
CREATE TABLE public.exec_form_submissions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  term_id             UUID NOT NULL REFERENCES public.terms(id) ON DELETE CASCADE,
  email               VARCHAR(255) NOT NULL,
  role_id             INT NOT NULL REFERENCES public.exec_positions(id) ON DELETE RESTRICT,
  in_waterloo         VARCHAR(255),
  term_type           public.term_type_enum NOT NULL,
  instagram           VARCHAR(30),
  headshot_url        TEXT,
  consent_website     BOOLEAN NOT NULL DEFAULT false,
  consent_instagram   BOOLEAN NOT NULL DEFAULT false,
  discord             VARCHAR(32) NOT NULL,
  datasci_competency  SMALLINT NOT NULL CHECK (datasci_competency BETWEEN 0 AND 4),
  anything_else       TEXT,
  submitted_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (profile_id, term_id)
);

-- ============================================================================
-- 4. Indexes
-- ============================================================================
CREATE INDEX idx_exec_form_submissions_profile_id ON public.exec_form_submissions (profile_id);
CREATE INDEX idx_exec_form_submissions_term_id    ON public.exec_form_submissions (term_id);
CREATE INDEX idx_exec_form_submissions_role_id    ON public.exec_form_submissions (role_id);

-- ============================================================================
-- 5. updated_at trigger
-- ============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER exec_form_submissions_set_updated_at
BEFORE UPDATE ON public.exec_form_submissions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 6. RLS
-- ============================================================================
ALTER TABLE public.exec_form_submissions ENABLE ROW LEVEL SECURITY;

-- SELECT: own submission OR exec/admin can see all
CREATE POLICY exec_form_submissions_select ON public.exec_form_submissions
  FOR SELECT
  USING (
    profile_id = auth.uid() OR
    public.is_exec_or_admin(auth.uid())
  );

-- INSERT: execs submit their own row only
CREATE POLICY exec_form_submissions_insert ON public.exec_form_submissions
  FOR INSERT
  WITH CHECK (profile_id = auth.uid());

-- UPDATE: own row OR admin
CREATE POLICY exec_form_submissions_update ON public.exec_form_submissions
  FOR UPDATE
  USING (
    profile_id = auth.uid() OR
    public.is_admin(auth.uid())
  )
  WITH CHECK (
    profile_id = auth.uid() OR
    public.is_admin(auth.uid())
  );

-- DELETE: admin only
CREATE POLICY exec_form_submissions_delete ON public.exec_form_submissions
  FOR DELETE
  USING (public.is_admin(auth.uid()));
