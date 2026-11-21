-- Subteams that don't continue into a new term. A hiring cycle plans this in its leadership
-- draft; Finalize stamps it here. Rows are never deleted: roles, rosters and past exec_team
-- rows still point at the subteam.
ALTER TABLE org.subteams
  ADD COLUMN retired_at TIMESTAMPTZ,
  ADD COLUMN retired_in_cycle_id UUID REFERENCES hiring.cycles(id) ON DELETE SET NULL;

-- Subteams and positions were seeded with explicit ids; keep the serials ahead of them so
-- rows created from Recruiting don't collide.
SELECT setval(
  pg_get_serial_sequence('org.subteams', 'id'),
  (SELECT COALESCE(MAX(id), 1) FROM org.subteams)
);

SELECT setval(
  pg_get_serial_sequence('org.exec_positions', 'id'),
  (SELECT COALESCE(MAX(id), 1) FROM org.exec_positions)
);
