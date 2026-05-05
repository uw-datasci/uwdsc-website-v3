-- ============================================================================
-- 1. returning_exec_submissions table
-- ============================================================================
CREATE TABLE public.returning_exec_submissions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id            UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  term_id               UUID NOT NULL REFERENCES public.terms(id) ON DELETE CASCADE,
  email                 VARCHAR(255) NOT NULL,
  full_name             TEXT NOT NULL,
  discord               VARCHAR(64) NOT NULL,
  past_positions        TEXT NOT NULL,
  interested_in_returning BOOLEAN NOT NULL,
  not_returning_reason  TEXT,
  in_person_next_term   BOOLEAN NOT NULL DEFAULT false,
  qualifications        TEXT NOT NULL DEFAULT '',
  additional_notes      TEXT,
  submitted_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (profile_id, term_id)
);

-- ============================================================================
-- 2. returning_exec_position_selections table
-- ============================================================================
CREATE TABLE public.returning_exec_position_selections (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.returning_exec_submissions(id) ON DELETE CASCADE,
  position_id   INT NOT NULL REFERENCES public.application_positions_available(id) ON DELETE CASCADE,
  priority      INT NOT NULL CHECK (priority BETWEEN 1 AND 3),
  status        public.application_review_status_enum NOT NULL DEFAULT 'In Review',
  UNIQUE (submission_id, priority),
  UNIQUE (submission_id, position_id)
);

-- ============================================================================
-- 3. Indexes
-- ============================================================================
CREATE INDEX idx_returning_exec_submissions_profile_id ON public.returning_exec_submissions (profile_id);
CREATE INDEX idx_returning_exec_submissions_term_id    ON public.returning_exec_submissions (term_id);
CREATE INDEX idx_returning_exec_position_selections_submission_id ON public.returning_exec_position_selections (submission_id);
CREATE INDEX idx_returning_exec_position_selections_position_status ON public.returning_exec_position_selections (position_id, status);

-- ============================================================================
-- 4. updated_at trigger (reuse existing set_updated_at function)
-- ============================================================================
CREATE TRIGGER returning_exec_submissions_set_updated_at
BEFORE UPDATE ON public.returning_exec_submissions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 5. Position limit trigger (max 3 selections per submission)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.check_returning_exec_position_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT COUNT(*)
    FROM public.returning_exec_position_selections
    WHERE submission_id = NEW.submission_id
  ) >= 3 THEN
    RAISE EXCEPTION 'You cannot select more than 3 positions.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_returning_exec_position_limit
BEFORE INSERT ON public.returning_exec_position_selections
FOR EACH ROW EXECUTE FUNCTION public.check_returning_exec_position_limit();

-- ============================================================================
-- 6. RLS
-- ============================================================================
ALTER TABLE public.returning_exec_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.returning_exec_position_selections ENABLE ROW LEVEL SECURITY;

-- returning_exec_submissions: SELECT - own row OR admin
CREATE POLICY returning_exec_submissions_select ON public.returning_exec_submissions
  FOR SELECT
  USING (
    profile_id = auth.uid() OR
    public.is_admin(auth.uid())
  );

-- returning_exec_submissions: INSERT - own row only
CREATE POLICY returning_exec_submissions_insert ON public.returning_exec_submissions
  FOR INSERT
  WITH CHECK (profile_id = auth.uid());

-- returning_exec_submissions: UPDATE - own row OR admin
CREATE POLICY returning_exec_submissions_update ON public.returning_exec_submissions
  FOR UPDATE
  USING (
    profile_id = auth.uid() OR
    public.is_admin(auth.uid())
  )
  WITH CHECK (
    profile_id = auth.uid() OR
    public.is_admin(auth.uid())
  );

-- returning_exec_submissions: DELETE - admin only
CREATE POLICY returning_exec_submissions_delete ON public.returning_exec_submissions
  FOR DELETE
  USING (public.is_admin(auth.uid()));

-- returning_exec_position_selections: SELECT - own (via submission) OR admin
CREATE POLICY returning_exec_position_selections_select ON public.returning_exec_position_selections
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.returning_exec_submissions s
      WHERE s.id = returning_exec_position_selections.submission_id
        AND s.profile_id = auth.uid()
    ) OR
    public.is_admin(auth.uid())
  );

-- returning_exec_position_selections: INSERT - own submission only
CREATE POLICY returning_exec_position_selections_insert ON public.returning_exec_position_selections
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.returning_exec_submissions s
      WHERE s.id = returning_exec_position_selections.submission_id
        AND s.profile_id = auth.uid()
    )
  );

-- returning_exec_position_selections: UPDATE - admin only (status changes)
CREATE POLICY returning_exec_position_selections_update ON public.returning_exec_position_selections
  FOR UPDATE
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- returning_exec_position_selections: DELETE - admin only
CREATE POLICY returning_exec_position_selections_delete ON public.returning_exec_position_selections
  FOR DELETE
  USING (public.is_admin(auth.uid()));
