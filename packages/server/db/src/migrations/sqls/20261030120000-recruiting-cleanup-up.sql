-- 1. Old returning-exec form and unused helpers
DROP TABLE IF EXISTS hiring.returning_exec_position_selections;
DROP TABLE IF EXISTS hiring.returning_exec_submissions;
DROP FUNCTION IF EXISTS public.check_returning_exec_position_limit();
DROP TYPE IF EXISTS hiring.in_person_next_term_enum;

ALTER TABLE public.terms
  DROP COLUMN IF EXISTS returning_exec_release_date,
  DROP COLUMN IF EXISTS returning_exec_deadline,
  ALTER COLUMN application_hard_deadline DROP DEFAULT;

DROP FUNCTION IF EXISTS public.delete_old_terms();

-- 2. Stale RLS: the server bypasses RLS, so these tables go deny-by-default like the newer ones
DO $$
DECLARE
  v_policy RECORD;
BEGIN
  FOR v_policy IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'hiring'
      AND tablename IN (
        'questions',
        'position_questions',
        'application_positions_available',
        'applications',
        'application_position_selections',
        'answers'
      )
  LOOP
    EXECUTE format('DROP POLICY %I ON hiring.%I', v_policy.policyname, v_policy.tablename);
  END LOOP;
END $$;

DROP FUNCTION IF EXISTS public.is_application_draft(uuid);

-- 3. exec_team / cycle_leadership: keep past teams; subteam_id must match the position's
DO $$
DECLARE
  v_team INT;
  v_leadership INT;
BEGIN
  SELECT count(*) INTO v_team
  FROM org.exec_team et
  JOIN org.exec_positions ep ON ep.id = et.position_id
  WHERE ep.subteam_id IS DISTINCT FROM et.subteam_id;

  SELECT count(*) INTO v_leadership
  FROM hiring.cycle_leadership cl
  JOIN org.exec_positions ep ON ep.id = cl.position_id
  WHERE ep.subteam_id IS DISTINCT FROM cl.subteam_id;

  IF v_team > 0 OR v_leadership > 0 THEN
    RAISE EXCEPTION
      '% exec_team row(s) and % cycle_leadership row(s) have a subteam that differs from their position''s. Fix them before running this migration.',
      v_team, v_leadership;
  END IF;
END $$;

DO $$
DECLARE
  v_name TEXT;
BEGIN
  FOR v_name IN
    SELECT c.conname
    FROM pg_constraint c
    JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY (c.conkey)
    WHERE c.conrelid = 'org.exec_team'::regclass
      AND c.contype = 'f'
      AND array_length(c.conkey, 1) = 1
      AND a.attname IN ('position_id', 'subteam_id')
  LOOP
    EXECUTE format('ALTER TABLE org.exec_team DROP CONSTRAINT %I', v_name);
  END LOOP;
END $$;

ALTER TABLE org.exec_team
  ADD CONSTRAINT exec_team_position_id_fkey
    FOREIGN KEY (position_id) REFERENCES org.exec_positions(id) ON DELETE RESTRICT,
  ADD CONSTRAINT exec_team_subteam_id_fkey
    FOREIGN KEY (subteam_id) REFERENCES org.subteams(id) ON DELETE RESTRICT;

ALTER TABLE org.exec_positions
  ADD CONSTRAINT exec_positions_id_subteam_id_key UNIQUE (id, subteam_id);

ALTER TABLE org.exec_team
  ADD CONSTRAINT exec_team_position_subteam_fkey
    FOREIGN KEY (position_id, subteam_id) REFERENCES org.exec_positions(id, subteam_id)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE hiring.cycle_leadership
  ADD CONSTRAINT cycle_leadership_position_subteam_fkey
    FOREIGN KEY (position_id, subteam_id) REFERENCES org.exec_positions(id, subteam_id)
    ON UPDATE CASCADE ON DELETE RESTRICT;

-- 4. applications: required owner/term, no submitted time on drafts, timestamps
DO $$
DECLARE
  v_missing INT;
BEGIN
  SELECT count(*) INTO v_missing
  FROM hiring.applications
  WHERE profile_id IS NULL OR term_id IS NULL;

  IF v_missing > 0 THEN
    RAISE EXCEPTION
      '% application(s) have no profile or term. Fix or delete them before running this migration.',
      v_missing;
  END IF;
END $$;

ALTER TABLE hiring.applications
  ALTER COLUMN profile_id SET NOT NULL,
  ALTER COLUMN term_id SET NOT NULL,
  ALTER COLUMN submitted_at DROP DEFAULT,
  ADD COLUMN created_at TIMESTAMPTZ,
  ADD COLUMN updated_at TIMESTAMPTZ;

UPDATE hiring.applications
SET created_at = COALESCE(submitted_at, now()),
    updated_at = COALESCE(submitted_at, now());

UPDATE hiring.applications SET submitted_at = NULL WHERE status = 'draft';

ALTER TABLE hiring.applications
  ALTER COLUMN created_at SET NOT NULL,
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN updated_at SET NOT NULL,
  ALTER COLUMN updated_at SET DEFAULT now();

CREATE TRIGGER applications_set_updated_at
BEFORE UPDATE ON hiring.applications
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. application_position_selections: required columns, one card per priority
DO $$
DECLARE
  v_missing INT;
  v_duplicates INT;
BEGIN
  SELECT count(*) INTO v_missing
  FROM hiring.application_position_selections
  WHERE application_id IS NULL OR position_id IS NULL OR priority IS NULL OR status IS NULL;

  SELECT count(*) INTO v_duplicates
  FROM (
    SELECT application_id, priority
    FROM hiring.application_position_selections
    GROUP BY application_id, priority
    HAVING count(*) > 1
  ) d;

  IF v_missing > 0 OR v_duplicates > 0 THEN
    RAISE EXCEPTION
      '% selection(s) have empty columns and % application(s) repeat a priority. Fix them before running this migration.',
      v_missing, v_duplicates;
  END IF;
END $$;

ALTER TABLE hiring.application_position_selections
  ALTER COLUMN application_id SET NOT NULL,
  ALTER COLUMN position_id SET NOT NULL,
  ALTER COLUMN priority SET NOT NULL,
  ALTER COLUMN status SET NOT NULL,
  ADD CONSTRAINT application_position_selections_application_id_priority_key
    UNIQUE (application_id, priority);

-- 6. The active term comes from start/end dates, not a stored flag
CREATE OR REPLACE FUNCTION public.active_term_id()
RETURNS UUID
LANGUAGE sql
STABLE
AS $$
  SELECT id
  FROM public.terms
  WHERE start_date <= now() AND now() <= end_date
  ORDER BY start_date DESC
  LIMIT 1
$$;

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
    public.active_term_id()
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
    AND m.term_id = public.active_term_id();
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

  v_term_id := public.active_term_id();

  IF v_term_id IS NULL THEN
    RETURN;
  END IF;

  INSERT INTO public.page_views (path, term_id, visitor_id, user_id)
  VALUES (p_path, v_term_id, p_visitor_id, auth.uid());
END;
$$;

DROP TRIGGER IF EXISTS terms_sync_is_active_from_window ON public.terms;
DROP FUNCTION IF EXISTS public.terms_sync_is_active_from_window();
DROP INDEX IF EXISTS public.terms_at_most_one_active;
ALTER TABLE public.terms
  DROP CONSTRAINT IF EXISTS terms_is_active_implies_current_interval,
  DROP COLUMN IF EXISTS is_active;
