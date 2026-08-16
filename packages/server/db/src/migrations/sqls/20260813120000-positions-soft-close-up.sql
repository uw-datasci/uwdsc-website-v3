-- ============================================================================
-- Closing a position ("Positions" admin tab) used to hard-DELETE its row in
-- hiring.application_positions_available (apa). Because
-- application_position_selections.position_id and position_questions.position_id
-- both FK into apa, that delete either 409'd once an applicant had selected the
-- role (blocking Presidents from closing roles mid-cycle) or, when it succeeded,
-- cascade-deleted every question assignment for the role and forced a fresh
-- apa.id on re-open.
--
-- Row presence in apa now means "has ever been opened"; is_open means
-- "currently accepting new applicants". Closing flips is_open to false instead
-- of deleting the row, so submitted selections and question assignments are
-- untouched and re-opening reuses the same apa.id.
-- ============================================================================

ALTER TABLE hiring.application_positions_available
  ADD COLUMN is_open BOOLEAN NOT NULL DEFAULT true;

-- ----------------------------------------------------------------------------
-- Toggling a position on becomes an idempotent upsert keyed on position_id, so
-- position_id must be unique. There is no such constraint today -- dedupe was
-- enforced only at the app layer (a 409 if a row already existed) -- so verify
-- the current data actually satisfies it before adding the constraint.
-- ----------------------------------------------------------------------------
DO $$
DECLARE
  dup_count int;
BEGIN
  SELECT COUNT(*) INTO dup_count FROM (
    SELECT position_id
    FROM hiring.application_positions_available
    WHERE position_id IS NOT NULL
    GROUP BY position_id
    HAVING COUNT(*) > 1
  ) dupes;

  IF dup_count > 0 THEN
    RAISE EXCEPTION
      'Cannot add UNIQUE(position_id) to hiring.application_positions_available: % duplicate position_id(s) found. Resolve manually before migrating.',
      dup_count;
  END IF;
END $$;

ALTER TABLE hiring.application_positions_available
  ADD CONSTRAINT application_positions_available_position_id_key UNIQUE (position_id);
