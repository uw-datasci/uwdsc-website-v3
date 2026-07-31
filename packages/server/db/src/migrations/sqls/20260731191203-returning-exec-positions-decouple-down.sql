-- ============================================================================
-- Revert: point returning_exec_position_selections.position_id back at
-- hiring.application_positions_available(id).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. The old FK cannot represent a selection for a position that is not open
--    on the external application -- which is the normal state once returning
--    execs can pick any role. Backfill availability rows so the revert is
--    lossless.
--    SIDE EFFECT: these positions become OPEN on the public application until
--    a President toggles them back off.
-- ----------------------------------------------------------------------------
DO $$
DECLARE
  backfilled int;
BEGIN
  INSERT INTO hiring.application_positions_available (position_id)
  SELECT DISTINCT reps.position_id
  FROM hiring.returning_exec_position_selections reps
  WHERE NOT EXISTS (
    SELECT 1 FROM hiring.application_positions_available apa
    WHERE apa.position_id = reps.position_id
  );
  GET DIAGNOSTICS backfilled = ROW_COUNT;

  IF backfilled > 0 THEN
    RAISE NOTICE
      'Backfilled % application_positions_available row(s) to preserve returning-exec selections. These positions are now OPEN on the public application; review the positions page.',
      backfilled;
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 2. Drop the FK to org.exec_positions.
-- ----------------------------------------------------------------------------
ALTER TABLE hiring.returning_exec_position_selections
  DROP CONSTRAINT IF EXISTS returning_exec_position_selections_position_id_fkey;

-- ----------------------------------------------------------------------------
-- 3. Remap exec_positions.id -> apa.id, same two-phase negative staging.
--    MIN(id) makes the mapping deterministic and injective when duplicate apa
--    rows exist for one position, so no new UNIQUE collisions are introduced.
-- ----------------------------------------------------------------------------
WITH target AS (
  SELECT position_id AS exec_position_id, MIN(id) AS available_id
  FROM hiring.application_positions_available
  WHERE position_id IS NOT NULL
  GROUP BY position_id
)
UPDATE hiring.returning_exec_position_selections reps
SET position_id = -target.available_id
FROM target
WHERE target.exec_position_id = reps.position_id;

UPDATE hiring.returning_exec_position_selections
SET position_id = -position_id
WHERE position_id < 0;

-- ----------------------------------------------------------------------------
-- 4. Restore the original FK.
-- ----------------------------------------------------------------------------
ALTER TABLE hiring.returning_exec_position_selections
  ADD CONSTRAINT returning_exec_position_selections_position_id_fkey
  FOREIGN KEY (position_id) REFERENCES hiring.application_positions_available(id) ON DELETE CASCADE;
