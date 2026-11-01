DROP INDEX IF EXISTS hiring.idx_selections_one_accepted_per_application;

DROP FUNCTION IF EXISTS org.team_term_id();

-- Fails if the same handle is now used in more than one term.
ALTER TABLE org.exec_team DROP CONSTRAINT IF EXISTS exec_team_instagram_term_id_key;
ALTER TABLE org.exec_team
  ADD CONSTRAINT exec_team_instagram_key UNIQUE (instagram);
