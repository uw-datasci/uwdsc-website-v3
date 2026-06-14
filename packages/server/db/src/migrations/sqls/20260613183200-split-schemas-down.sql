-- ============================================================================
-- Revert schema split: move everything back to public
-- ============================================================================

-- Drop grants (optional cleanup; re-granted when tables return to public)
REVOKE SELECT ON identity.profiles FROM authenticated;
REVOKE SELECT ON org.subteams, org.exec_positions, org.exec_team FROM authenticated, anon;
REVOKE SELECT ON events.events FROM authenticated, anon;
REVOKE USAGE ON SCHEMA identity, org, hiring, events FROM authenticated, anon, service_role;

-- ----------------------------------------------------------------------------
-- RLS policies: restore public-qualified references before moving tables
-- ----------------------------------------------------------------------------

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
-- Move tables back to public (reverse dependency order)
-- ----------------------------------------------------------------------------
ALTER TABLE hiring.exec_form_submissions SET SCHEMA public;
ALTER TABLE hiring.returning_exec_position_selections SET SCHEMA public;
ALTER TABLE hiring.returning_exec_submissions SET SCHEMA public;
ALTER TABLE hiring.answers SET SCHEMA public;
ALTER TABLE hiring.application_position_selections SET SCHEMA public;
ALTER TABLE hiring.applications SET SCHEMA public;
ALTER TABLE hiring.position_questions SET SCHEMA public;
ALTER TABLE hiring.application_positions_available SET SCHEMA public;
ALTER TABLE hiring.questions SET SCHEMA public;

ALTER TABLE events.attendance SET SCHEMA public;
ALTER TABLE events.events SET SCHEMA public;

ALTER TABLE org.exec_team SET SCHEMA public;
ALTER TABLE org.exec_positions SET SCHEMA public;
ALTER TABLE org.subteams SET SCHEMA public;

ALTER TABLE identity.profiles SET SCHEMA public;
ALTER TABLE identity.user_roles SET SCHEMA public;

-- ----------------------------------------------------------------------------
-- Enums back to public
-- ----------------------------------------------------------------------------
ALTER TYPE hiring.term_type_enum SET SCHEMA public;
ALTER TYPE hiring.application_input_enum SET SCHEMA public;
ALTER TYPE hiring.application_review_status_enum SET SCHEMA public;
ALTER TYPE hiring.application_status_enum SET SCHEMA public;
ALTER TYPE identity.faculty_enum SET SCHEMA public;
ALTER TYPE identity.user_role_enum SET SCHEMA public;

-- ----------------------------------------------------------------------------
-- Restore functions in public
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS public.user_role_enum AS $$
  SELECT role FROM public.user_roles WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_application_draft(app_id uuid)
RETURNS boolean AS $$
  SELECT COALESCE((SELECT status = 'draft' FROM public.applications WHERE id = app_id), false);
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id);
  INSERT INTO public.user_roles (id, role) VALUES (NEW.id, 'member');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.check_position_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.application_position_selections WHERE application_id = NEW.application_id) >= 3 THEN
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
    FROM public.returning_exec_position_selections
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

-- Recreate cross-table policies with public schema references
DROP POLICY IF EXISTS application_position_selections_select_own_or_admin ON public.application_position_selections;
DROP POLICY IF EXISTS application_position_selections_insert_own ON public.application_position_selections;

CREATE POLICY application_position_selections_select_own_or_admin ON public.application_position_selections
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE applications.id = application_position_selections.application_id
      AND applications.profile_id = auth.uid()
    ) OR
    public.is_admin(auth.uid())
  );

CREATE POLICY application_position_selections_insert_own ON public.application_position_selections
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE applications.id = application_position_selections.application_id
      AND applications.profile_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS answers_select_own_or_admin ON public.answers;
DROP POLICY IF EXISTS answers_insert_own ON public.answers;
DROP POLICY IF EXISTS answers_update_own_draft_or_admin ON public.answers;

CREATE POLICY answers_select_own_or_admin ON public.answers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE applications.id = answers.application_id
      AND applications.profile_id = auth.uid()
    ) OR
    public.is_admin(auth.uid())
  );

CREATE POLICY answers_insert_own ON public.answers
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE applications.id = answers.application_id
      AND applications.profile_id = auth.uid()
    )
  );

CREATE POLICY answers_update_own_draft_or_admin ON public.answers
  FOR UPDATE
  USING (
    (
      EXISTS (
        SELECT 1 FROM public.applications
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
        SELECT 1 FROM public.applications
        WHERE applications.id = answers.application_id
        AND applications.profile_id = auth.uid()
        AND public.is_application_draft(answers.application_id)
      )
    ) OR
    public.is_admin(auth.uid())
  );

DROP POLICY IF EXISTS returning_exec_position_selections_select ON public.returning_exec_position_selections;
DROP POLICY IF EXISTS returning_exec_position_selections_insert ON public.returning_exec_position_selections;

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

CREATE POLICY returning_exec_position_selections_insert ON public.returning_exec_position_selections
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.returning_exec_submissions s
      WHERE s.id = returning_exec_position_selections.submission_id
        AND s.profile_id = auth.uid()
    )
  );

GRANT SELECT ON public.profiles TO authenticated;

DROP SCHEMA IF EXISTS identity;
DROP SCHEMA IF EXISTS org;
DROP SCHEMA IF EXISTS hiring;
DROP SCHEMA IF EXISTS events;
