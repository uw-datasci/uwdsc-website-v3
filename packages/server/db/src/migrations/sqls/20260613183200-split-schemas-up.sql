-- ============================================================================
-- Split tables into domain schemas (public keeps profiles, user_roles, terms, memberships)
-- org | hiring | events
-- ============================================================================

CREATE SCHEMA org;
CREATE SCHEMA hiring;
CREATE SCHEMA events;

-- ----------------------------------------------------------------------------
-- Enums (user_role_enum, faculty_enum, payment_method_enum stay in public)
-- ----------------------------------------------------------------------------
ALTER TYPE public.application_status_enum SET SCHEMA hiring;
ALTER TYPE public.application_review_status_enum SET SCHEMA hiring;
ALTER TYPE public.application_input_enum SET SCHEMA hiring;
ALTER TYPE public.term_type_enum SET SCHEMA hiring;

-- ----------------------------------------------------------------------------
-- Tables: org
-- ----------------------------------------------------------------------------
ALTER TABLE public.subteams SET SCHEMA org;
ALTER TABLE public.exec_positions SET SCHEMA org;
ALTER TABLE public.exec_team SET SCHEMA org;

-- ----------------------------------------------------------------------------
-- Tables: events
-- ----------------------------------------------------------------------------
ALTER TABLE public.events SET SCHEMA events;
ALTER TABLE public.attendance SET SCHEMA events;

-- ----------------------------------------------------------------------------
-- Tables: hiring (order respects FK dependencies)
-- ----------------------------------------------------------------------------
ALTER TABLE public.questions SET SCHEMA hiring;
ALTER TABLE public.application_positions_available SET SCHEMA hiring;
ALTER TABLE public.position_questions SET SCHEMA hiring;
ALTER TABLE public.applications SET SCHEMA hiring;
ALTER TABLE public.application_position_selections SET SCHEMA hiring;
ALTER TABLE public.answers SET SCHEMA hiring;
ALTER TABLE public.returning_exec_submissions SET SCHEMA hiring;
ALTER TABLE public.returning_exec_position_selections SET SCHEMA hiring;
ALTER TABLE public.exec_form_submissions SET SCHEMA hiring;

-- ----------------------------------------------------------------------------
-- Shared RLS helpers (stay in public)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_application_draft(app_id uuid)
RETURNS boolean AS $$
  SELECT COALESCE((SELECT status = 'draft' FROM hiring.applications WHERE id = app_id), false);
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ----------------------------------------------------------------------------
-- Domain trigger functions (stay in public; triggers reference by OID/name)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.check_position_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM hiring.application_position_selections WHERE application_id = NEW.application_id) >= 3 THEN
    RAISE EXCEPTION 'You cannot apply for more than 3 positions.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

CREATE OR REPLACE FUNCTION public.sync_event_buffered_times()
RETURNS TRIGGER AS $$
BEGIN
  NEW.buffered_start_time := NEW.start_time - interval '30 minutes';
  NEW.buffered_end_time   := NEW.end_time   + interval '30 minutes';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- RLS policies with cross-schema table references (must be recreated)
-- ----------------------------------------------------------------------------

-- application_position_selections
DROP POLICY IF EXISTS application_position_selections_select_own_or_admin ON hiring.application_position_selections;
DROP POLICY IF EXISTS application_position_selections_insert_own ON hiring.application_position_selections;

CREATE POLICY application_position_selections_select_own_or_admin ON hiring.application_position_selections
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM hiring.applications
      WHERE applications.id = application_position_selections.application_id
      AND applications.profile_id = auth.uid()
    ) OR
    public.is_admin(auth.uid())
  );

CREATE POLICY application_position_selections_insert_own ON hiring.application_position_selections
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hiring.applications
      WHERE applications.id = application_position_selections.application_id
      AND applications.profile_id = auth.uid()
    )
  );

-- answers
DROP POLICY IF EXISTS answers_select_own_or_admin ON hiring.answers;
DROP POLICY IF EXISTS answers_insert_own ON hiring.answers;
DROP POLICY IF EXISTS answers_update_own_draft_or_admin ON hiring.answers;

CREATE POLICY answers_select_own_or_admin ON hiring.answers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM hiring.applications
      WHERE applications.id = answers.application_id
      AND applications.profile_id = auth.uid()
    ) OR
    public.is_admin(auth.uid())
  );

CREATE POLICY answers_insert_own ON hiring.answers
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hiring.applications
      WHERE applications.id = answers.application_id
      AND applications.profile_id = auth.uid()
    )
  );

CREATE POLICY answers_update_own_draft_or_admin ON hiring.answers
  FOR UPDATE
  USING (
    (
      EXISTS (
        SELECT 1 FROM hiring.applications
        WHERE applications.id = answers.application_id
        AND applications.profile_id = auth.uid()
        AND public.is_application_draft(answers.application_id)
      )
    ) OR
    public.is_admin(auth.uid())
  )
  WITH CHECK (
    (
      EXISTS (
        SELECT 1 FROM hiring.applications
        WHERE applications.id = answers.application_id
        AND applications.profile_id = auth.uid()
        AND public.is_application_draft(answers.application_id)
      )
    ) OR
    public.is_admin(auth.uid())
  );

-- returning_exec_position_selections
DROP POLICY IF EXISTS returning_exec_position_selections_select ON hiring.returning_exec_position_selections;
DROP POLICY IF EXISTS returning_exec_position_selections_insert ON hiring.returning_exec_position_selections;

CREATE POLICY returning_exec_position_selections_select ON hiring.returning_exec_position_selections
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM hiring.returning_exec_submissions s
      WHERE s.id = returning_exec_position_selections.submission_id
        AND s.profile_id = auth.uid()
    ) OR
    public.is_admin(auth.uid())
  );

CREATE POLICY returning_exec_position_selections_insert ON hiring.returning_exec_position_selections
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hiring.returning_exec_submissions s
      WHERE s.id = returning_exec_position_selections.submission_id
        AND s.profile_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------------------
-- Grants (Supabase roles)
-- ----------------------------------------------------------------------------
GRANT USAGE ON SCHEMA org TO authenticated, anon, service_role;
GRANT USAGE ON SCHEMA hiring TO authenticated, service_role;
GRANT USAGE ON SCHEMA events TO authenticated, anon, service_role;

GRANT SELECT ON org.subteams TO authenticated, anon;
GRANT SELECT ON org.exec_positions TO authenticated, anon;
GRANT SELECT ON org.exec_team TO authenticated, anon;
GRANT SELECT ON events.events TO authenticated, anon;
