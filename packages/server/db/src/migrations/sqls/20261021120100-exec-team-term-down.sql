DROP INDEX IF EXISTS org.idx_exec_team_term_id;

ALTER TABLE org.exec_team
  DROP CONSTRAINT IF EXISTS exec_team_profile_id_term_id_key;

ALTER TABLE org.exec_team
  DROP COLUMN IF EXISTS term_id;
