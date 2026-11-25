-- Per-term exec_team rows. Backfills existing rows to the term that started most recently
-- (not terms.is_active, which can still point at a term that has ended).
-- Fails if anyone has more than one row; one row per person per term.

ALTER TABLE org.exec_team
  ADD COLUMN term_id UUID REFERENCES public.terms(id) ON DELETE RESTRICT;

DO $$
DECLARE
  v_term_id    UUID;
  v_duplicates TEXT;
BEGIN
  SELECT string_agg(profile_id::text, ', ')
    INTO v_duplicates
  FROM (
    SELECT profile_id
    FROM org.exec_team
    GROUP BY profile_id
    HAVING count(*) > 1
  ) d;

  IF v_duplicates IS NOT NULL THEN
    RAISE EXCEPTION
      'org.exec_team has more than one row for these profile_ids: %. Remove the extra rows before running this migration (one row per person per term).',
      v_duplicates;
  END IF;

  SELECT id INTO v_term_id
  FROM public.terms
  WHERE start_date <= now()
  ORDER BY start_date DESC
  LIMIT 1;

  IF v_term_id IS NULL AND EXISTS (SELECT 1 FROM org.exec_team) THEN
    RAISE EXCEPTION
      'Cannot backfill org.exec_team.term_id: no term has started yet.';
  END IF;

  UPDATE org.exec_team SET term_id = v_term_id WHERE term_id IS NULL;
END $$;

ALTER TABLE org.exec_team
  ALTER COLUMN term_id SET NOT NULL;

ALTER TABLE org.exec_team
  ADD CONSTRAINT exec_team_profile_id_term_id_key UNIQUE (profile_id, term_id);

CREATE INDEX idx_exec_team_term_id ON org.exec_team (term_id);
