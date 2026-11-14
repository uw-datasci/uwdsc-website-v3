-- Instagram handles are unique per term, so a returning exec keeps theirs on the next term's row.
DO $$
DECLARE
  v_name TEXT;
BEGIN
  SELECT c.conname INTO v_name
  FROM pg_constraint c
  JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attname = 'instagram'
  WHERE c.conrelid = 'org.exec_team'::regclass
    AND c.contype = 'u'
    AND c.conkey = ARRAY[a.attnum];

  IF v_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE org.exec_team DROP CONSTRAINT %I', v_name);
  END IF;
END $$;

ALTER TABLE org.exec_team
  ADD CONSTRAINT exec_team_instagram_term_id_key UNIQUE (instagram, term_id);

-- The term whose team is "current": the target term of the latest finalized cycle,
-- or the active term before any cycle is finalized.
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

-- At most one accepted offer per candidate.
DO $$
DECLARE
  v_duplicates TEXT;
BEGIN
  SELECT string_agg(application_id::text, ', ')
    INTO v_duplicates
  FROM (
    SELECT application_id
    FROM hiring.application_position_selections
    WHERE status = 'Accepted Offer'
    GROUP BY application_id
    HAVING count(*) > 1
  ) d;

  IF v_duplicates IS NOT NULL THEN
    RAISE EXCEPTION
      'These applications have more than one Accepted Offer: %. Fix them before running this migration.',
      v_duplicates;
  END IF;
END $$;

CREATE UNIQUE INDEX idx_selections_one_accepted_per_application
  ON hiring.application_position_selections (application_id)
  WHERE status = 'Accepted Offer';
