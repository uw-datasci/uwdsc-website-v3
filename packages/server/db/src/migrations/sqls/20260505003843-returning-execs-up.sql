-- ============================================================================
-- 0. terms: adjust column nullability
-- ============================================================================
ALTER TABLE public.terms
  ALTER COLUMN is_active SET NOT NULL,
  ALTER COLUMN is_active SET DEFAULT false,
  ALTER COLUMN start_date SET NOT NULL,
  ALTER COLUMN application_release_date DROP NOT NULL,
  ALTER COLUMN application_soft_deadline DROP NOT NULL,
  ALTER COLUMN application_hard_deadline DROP NOT NULL,
  ADD COLUMN end_date TIMESTAMPTZ NOT NULL,
  ADD COLUMN returning_exec_release_date TIMESTAMPTZ,
  ADD COLUMN returning_exec_deadline TIMESTAMPTZ;

UPDATE public.terms
SET end_date = CASE
  WHEN start_date IS NOT NULL THEN start_date + interval '4 months'
  ELSE COALESCE(created_at, now()) + interval '4 months'
END
WHERE end_date IS NULL;

UPDATE public.terms t
SET is_active = true
FROM (
  SELECT id
  FROM public.terms
  WHERE start_date <= now()
    AND now() <= end_date
  ORDER BY created_at DESC
  LIMIT 1
) cur
WHERE t.id = cur.id;

CREATE UNIQUE INDEX terms_at_most_one_active
  ON public.terms ((1))
  WHERE is_active = true;

ALTER TABLE public.terms
  ADD CONSTRAINT terms_is_active_implies_current_interval
  CHECK (
    is_active = (start_date <= now() AND now() <= end_date)
  );

-- is_active must follow [start_date, end_date] vs now(); column DEFAULT cannot reference other columns,
-- so we keep DEFAULT false and sync the real value on every INSERT/UPDATE.
CREATE OR REPLACE FUNCTION public.terms_sync_is_active_from_window()
RETURNS TRIGGER AS $$
BEGIN
  NEW.is_active := (NEW.start_date <= now() AND now() <= NEW.end_date);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER terms_sync_is_active_from_window
  BEFORE INSERT OR UPDATE ON public.terms
  FOR EACH ROW
  EXECUTE FUNCTION public.terms_sync_is_active_from_window();

-- Keep epoch default on application_hard_deadline when soft_deadline is absent on INSERT;
-- when application_soft_deadline is set, application_hard_deadline = soft + 15 minutes.
CREATE OR REPLACE FUNCTION public.sync_terms_hard_deadline()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.application_soft_deadline IS NOT NULL THEN
    NEW.application_hard_deadline := NEW.application_soft_deadline + interval '15 minutes';
  ELSIF TG_OP = 'UPDATE' THEN
    NEW.application_hard_deadline := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 1. returning_exec_submissions table
-- ============================================================================
CREATE TYPE public.in_person_next_term_enum AS ENUM (
  'yes',
  'no_outside_gta',
  'no_in_gta',
  'not_sure'
);

CREATE TABLE public.returning_exec_submissions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id            UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  term_id               UUID NOT NULL REFERENCES public.terms(id) ON DELETE CASCADE,
  email                 VARCHAR(255) NOT NULL,
  full_name             TEXT NOT NULL,
  discord               VARCHAR(64) NOT NULL,
  past_positions        TEXT NOT NULL,
  interested_in_returning BOOLEAN NOT NULL,
  interested_in_future_term VARCHAR(8),
  not_returning_reason  TEXT,
  in_person_next_term   public.in_person_next_term_enum,
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
