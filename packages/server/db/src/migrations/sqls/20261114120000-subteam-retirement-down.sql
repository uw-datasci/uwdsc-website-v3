ALTER TABLE org.subteams
  DROP COLUMN IF EXISTS retired_in_cycle_id,
  DROP COLUMN IF EXISTS retired_at;
