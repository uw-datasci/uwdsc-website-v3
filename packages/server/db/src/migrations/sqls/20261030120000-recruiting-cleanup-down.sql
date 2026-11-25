-- 6. Stored is_active flag
ALTER TABLE public.terms ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT false;

UPDATE public.terms SET is_active = true WHERE id = public.active_term_id();

CREATE UNIQUE INDEX terms_at_most_one_active
  ON public.terms ((1))
  WHERE is_active = true;

ALTER TABLE public.terms
  ADD CONSTRAINT terms_is_active_implies_current_interval
  CHECK (is_active = (start_date <= now() AND now() <= end_date));

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

CREATE OR REPLACE FUNCTION org.team_term_id()
RETURNS UUID
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    (
      SELECT c.target_term_id
      FROM hiring.cycles c
      JOIN public.terms t ON t.id = c.target_term_id
      WHERE c.finalized_at IS NOT NULL
      ORDER BY t.start_date DESC
      LIMIT 1
    ),
    (SELECT id FROM public.terms WHERE is_active = true LIMIT 1)
  )
$$;

CREATE OR REPLACE FUNCTION public.increment_membership_active_time(
  p_membership_id uuid,
  p_seconds integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_seconds IS NULL OR p_seconds <= 0 THEN
    RETURN;
  END IF;

  UPDATE membership.memberships m
  SET
    active_time_seconds = m.active_time_seconds + p_seconds,
    updated_at = now()
  WHERE m.id = p_membership_id
    AND m.profile_id = auth.uid()
    AND m.term_id = (SELECT id FROM public.terms WHERE is_active = true LIMIT 1);
END;
$$;

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

DROP FUNCTION IF EXISTS public.active_term_id();

-- 5. Selections
ALTER TABLE hiring.application_position_selections
  DROP CONSTRAINT IF EXISTS application_position_selections_application_id_priority_key,
  ALTER COLUMN application_id DROP NOT NULL,
  ALTER COLUMN position_id DROP NOT NULL,
  ALTER COLUMN priority DROP NOT NULL,
  ALTER COLUMN status DROP NOT NULL;

-- 4. Applications (drafts keep a NULL submitted_at)
DROP TRIGGER IF EXISTS applications_set_updated_at ON hiring.applications;

ALTER TABLE hiring.applications
  DROP COLUMN IF EXISTS created_at,
  DROP COLUMN IF EXISTS updated_at,
  ALTER COLUMN submitted_at SET DEFAULT now(),
  ALTER COLUMN profile_id DROP NOT NULL,
  ALTER COLUMN term_id DROP NOT NULL;

-- 3. exec_team / cycle_leadership foreign keys
ALTER TABLE hiring.cycle_leadership
  DROP CONSTRAINT IF EXISTS cycle_leadership_position_subteam_fkey;

ALTER TABLE org.exec_team
  DROP CONSTRAINT IF EXISTS exec_team_position_subteam_fkey,
  DROP CONSTRAINT IF EXISTS exec_team_position_id_fkey,
  DROP CONSTRAINT IF EXISTS exec_team_subteam_id_fkey;

ALTER TABLE org.exec_positions
  DROP CONSTRAINT IF EXISTS exec_positions_id_subteam_id_key;

ALTER TABLE org.exec_team
  ADD CONSTRAINT exec_team_position_id_fkey
    FOREIGN KEY (position_id) REFERENCES org.exec_positions(id) ON DELETE CASCADE,
  ADD CONSTRAINT exec_team_subteam_id_fkey
    FOREIGN KEY (subteam_id) REFERENCES org.subteams(id) ON DELETE CASCADE;

-- 2. Application RLS policies
CREATE OR REPLACE FUNCTION public.is_application_draft(app_id uuid)
RETURNS boolean AS $$
  SELECT COALESCE((SELECT status = 'draft' FROM hiring.applications WHERE id = app_id), false);
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE POLICY application_positions_available_select_authenticated ON hiring.application_positions_available
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY application_positions_available_insert_admin_only ON hiring.application_positions_available
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY application_positions_available_update_admin_only ON hiring.application_positions_available
  FOR UPDATE USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY application_positions_available_delete_admin_only ON hiring.application_positions_available
  FOR DELETE USING (public.is_admin(auth.uid()));

CREATE POLICY questions_select_authenticated ON hiring.questions
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY questions_insert_admin_only ON hiring.questions
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY questions_update_admin_only ON hiring.questions
  FOR UPDATE USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY questions_delete_admin_only ON hiring.questions
  FOR DELETE USING (public.is_admin(auth.uid()));

CREATE POLICY position_questions_select_authenticated ON hiring.position_questions
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY position_questions_insert_admin_only ON hiring.position_questions
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY position_questions_update_admin_only ON hiring.position_questions
  FOR UPDATE USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY position_questions_delete_admin_only ON hiring.position_questions
  FOR DELETE USING (public.is_admin(auth.uid()));

CREATE POLICY applications_select_own_or_admin ON hiring.applications
  FOR SELECT USING (profile_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY applications_insert_members_only ON hiring.applications
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    profile_id = auth.uid() AND
    public.get_user_role(auth.uid()) = 'member'
  );
CREATE POLICY applications_update_own_draft_or_admin ON hiring.applications
  FOR UPDATE
  USING ((profile_id = auth.uid() AND public.is_application_draft(id)) OR public.is_admin(auth.uid()))
  WITH CHECK ((profile_id = auth.uid() AND public.is_application_draft(id)) OR public.is_admin(auth.uid()));
CREATE POLICY applications_delete_admin_only ON hiring.applications
  FOR DELETE USING (public.is_admin(auth.uid()));

CREATE POLICY application_position_selections_select_own_or_admin ON hiring.application_position_selections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM hiring.applications
      WHERE applications.id = application_position_selections.application_id
        AND applications.profile_id = auth.uid()
    ) OR public.is_admin(auth.uid())
  );
CREATE POLICY application_position_selections_insert_own ON hiring.application_position_selections
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM hiring.applications
      WHERE applications.id = application_position_selections.application_id
        AND applications.profile_id = auth.uid()
    )
  );
CREATE POLICY application_position_selections_update_admin_only ON hiring.application_position_selections
  FOR UPDATE USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY application_position_selections_delete_admin_only ON hiring.application_position_selections
  FOR DELETE USING (public.is_admin(auth.uid()));

CREATE POLICY answers_select_own_or_admin ON hiring.answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM hiring.applications
      WHERE applications.id = answers.application_id
        AND applications.profile_id = auth.uid()
    ) OR public.is_admin(auth.uid())
  );
CREATE POLICY answers_insert_own ON hiring.answers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM hiring.applications
      WHERE applications.id = answers.application_id
        AND applications.profile_id = auth.uid()
    )
  );
CREATE POLICY answers_update_own_draft_or_admin ON hiring.answers
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM hiring.applications
      WHERE applications.id = answers.application_id
        AND applications.profile_id = auth.uid()
        AND public.is_application_draft(answers.application_id)
    ) OR public.is_admin(auth.uid())
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hiring.applications
      WHERE applications.id = answers.application_id
        AND applications.profile_id = auth.uid()
        AND public.is_application_draft(answers.application_id)
    ) OR public.is_admin(auth.uid())
  );
CREATE POLICY answers_delete_admin_only ON hiring.answers
  FOR DELETE USING (public.is_admin(auth.uid()));

-- 1. Returning-exec form (structure only; rows are not restored)
CREATE OR REPLACE FUNCTION public.delete_old_terms()
RETURNS void AS $$
BEGIN
  DELETE FROM terms
  WHERE id NOT IN (
    SELECT id FROM terms
    ORDER BY created_at DESC
    LIMIT 2
  );
END;
$$ LANGUAGE plpgsql;

ALTER TABLE public.terms
  ALTER COLUMN application_hard_deadline SET DEFAULT '1970-01-01 00:00:00+00'::timestamptz,
  ADD COLUMN returning_exec_release_date TIMESTAMPTZ,
  ADD COLUMN returning_exec_deadline TIMESTAMPTZ;

CREATE TYPE hiring.in_person_next_term_enum AS ENUM (
  'yes',
  'no_outside_gta',
  'no_in_gta',
  'not_sure'
);

CREATE TABLE hiring.returning_exec_submissions (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id                UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  term_id                   UUID NOT NULL REFERENCES public.terms(id) ON DELETE CASCADE,
  email                     VARCHAR(255) NOT NULL,
  full_name                 TEXT NOT NULL,
  discord                   VARCHAR(64) NOT NULL,
  past_positions            TEXT NOT NULL,
  interested_in_returning   BOOLEAN NOT NULL,
  interested_in_future_term VARCHAR(8),
  not_returning_reason      TEXT,
  in_person_next_term       hiring.in_person_next_term_enum,
  qualifications            TEXT NOT NULL DEFAULT '',
  additional_notes          TEXT,
  submitted_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (profile_id, term_id)
);

CREATE TABLE hiring.returning_exec_position_selections (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES hiring.returning_exec_submissions(id) ON DELETE CASCADE,
  position_id   INT NOT NULL,
  priority      INT NOT NULL CHECK (priority BETWEEN 1 AND 3),
  status        hiring.application_review_status_enum NOT NULL DEFAULT 'In Review',
  UNIQUE (submission_id, priority),
  UNIQUE (submission_id, position_id),
  CONSTRAINT returning_exec_position_selections_position_id_fkey
    FOREIGN KEY (position_id) REFERENCES org.exec_positions(id) ON DELETE RESTRICT
);

CREATE INDEX idx_returning_exec_submissions_profile_id ON hiring.returning_exec_submissions (profile_id);
CREATE INDEX idx_returning_exec_submissions_term_id ON hiring.returning_exec_submissions (term_id);
CREATE INDEX idx_returning_exec_position_selections_submission_id
  ON hiring.returning_exec_position_selections (submission_id);
CREATE INDEX idx_returning_exec_position_selections_position_status
  ON hiring.returning_exec_position_selections (position_id, status);

CREATE TRIGGER returning_exec_submissions_set_updated_at
BEFORE UPDATE ON hiring.returning_exec_submissions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.check_returning_exec_position_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT COUNT(*)
    FROM hiring.returning_exec_position_selections
    WHERE submission_id = NEW.submission_id
  ) >= 3 THEN
    RAISE EXCEPTION 'You cannot select more than 3 positions.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_returning_exec_position_limit
BEFORE INSERT ON hiring.returning_exec_position_selections
FOR EACH ROW EXECUTE FUNCTION public.check_returning_exec_position_limit();

ALTER TABLE hiring.returning_exec_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hiring.returning_exec_position_selections ENABLE ROW LEVEL SECURITY;

CREATE POLICY returning_exec_submissions_select ON hiring.returning_exec_submissions
  FOR SELECT USING (profile_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY returning_exec_submissions_insert ON hiring.returning_exec_submissions
  FOR INSERT WITH CHECK (profile_id = auth.uid());
CREATE POLICY returning_exec_submissions_update ON hiring.returning_exec_submissions
  FOR UPDATE
  USING (profile_id = auth.uid() OR public.is_admin(auth.uid()))
  WITH CHECK (profile_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY returning_exec_submissions_delete ON hiring.returning_exec_submissions
  FOR DELETE USING (public.is_admin(auth.uid()));

CREATE POLICY returning_exec_position_selections_select ON hiring.returning_exec_position_selections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM hiring.returning_exec_submissions s
      WHERE s.id = returning_exec_position_selections.submission_id
        AND s.profile_id = auth.uid()
    ) OR public.is_admin(auth.uid())
  );
CREATE POLICY returning_exec_position_selections_insert ON hiring.returning_exec_position_selections
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM hiring.returning_exec_submissions s
      WHERE s.id = returning_exec_position_selections.submission_id
        AND s.profile_id = auth.uid()
    )
  );
CREATE POLICY returning_exec_position_selections_update ON hiring.returning_exec_position_selections
  FOR UPDATE USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY returning_exec_position_selections_delete ON hiring.returning_exec_position_selections
  FOR DELETE USING (public.is_admin(auth.uid()));
