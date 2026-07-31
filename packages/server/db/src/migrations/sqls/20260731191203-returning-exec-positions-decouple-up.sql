-- ============================================================================
-- Returning-exec role preferences are no longer gated by the external
-- application's position toggles (hiring.application_positions_available).
--
-- returning_exec_position_selections.position_id stops meaning
-- "an application_positions_available.id" and starts meaning
-- "an org.exec_positions.id".
--
-- NOTE: apa.id and exec_positions.id are both small ints in overlapping ranges,
-- so a half-deployed state does NOT error -- it silently joins the wrong rows.
-- This migration must ship in the same release as the matching code changes.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Drop the FK into the toggle table. This cascade is what silently deleted
--    returning-exec preferences whenever a President toggled a role off.
-- ----------------------------------------------------------------------------
ALTER TABLE hiring.returning_exec_position_selections
  DROP CONSTRAINT IF EXISTS returning_exec_position_selections_position_id_fkey;

-- ----------------------------------------------------------------------------
-- 2. Refuse to migrate if the remap cannot produce a valid final state.
--    application_positions_available.position_id is nullable and has no UNIQUE
--    constraint, so both dangling/NULL targets and many-to-one collisions are
--    representable in the current schema.
-- ----------------------------------------------------------------------------
DO $$
DECLARE
  unresolvable int;
  collisions   int;
BEGIN
  SELECT COUNT(*) INTO unresolvable
  FROM hiring.returning_exec_position_selections reps
  LEFT JOIN hiring.application_positions_available apa ON apa.id = reps.position_id
  WHERE apa.id IS NULL OR apa.position_id IS NULL;

  IF unresolvable > 0 THEN
    RAISE EXCEPTION
      'Cannot remap returning_exec_position_selections: % row(s) resolve to no exec position (dangling or NULL apa.position_id).',
      unresolvable;
  END IF;

  SELECT COUNT(*) INTO collisions FROM (
    SELECT reps.submission_id, apa.position_id
    FROM hiring.returning_exec_position_selections reps
    JOIN hiring.application_positions_available apa ON apa.id = reps.position_id
    GROUP BY reps.submission_id, apa.position_id
    HAVING COUNT(*) > 1
  ) dupes;

  IF collisions > 0 THEN
    RAISE EXCEPTION
      'Cannot remap returning_exec_position_selections: % (submission_id, exec_position_id) collision(s). Deduplicate before migrating.',
      collisions;
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 3. Remap apa.id -> org.exec_positions.id.
--    Two phases via a negative staging space: UNIQUE (submission_id, position_id)
--    is NOT DEFERRABLE and is enforced per-row during an UPDATE, so a direct
--    single-statement remap can raise a *transient* duplicate-key error even
--    though the final state is unique (the two id spaces overlap). Negative
--    values are disjoint from both, and the FK is dropped at this point, so the
--    intermediate state is legal.
-- ----------------------------------------------------------------------------
UPDATE hiring.returning_exec_position_selections reps
SET position_id = -apa.position_id
FROM hiring.application_positions_available apa
WHERE apa.id = reps.position_id;

UPDATE hiring.returning_exec_position_selections
SET position_id = -position_id
WHERE position_id < 0;

-- ----------------------------------------------------------------------------
-- 4. Point the FK at the real position table.
--    ON DELETE RESTRICT rather than CASCADE (unlike the sibling FKs on
--    application_position_selections / position_questions): these rows are a
--    historical record of a term's submission along with its review status, and
--    this entire migration exists because a cascade destroyed them. No code path
--    deletes an org.exec_positions row, so RESTRICT costs nothing operationally
--    and turns silent data loss into a loud error.
-- ----------------------------------------------------------------------------
ALTER TABLE hiring.returning_exec_position_selections
  ADD CONSTRAINT returning_exec_position_selections_position_id_fkey
  FOREIGN KEY (position_id) REFERENCES org.exec_positions(id) ON DELETE RESTRICT;
