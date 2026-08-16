-- ============================================================================
-- Revert to hard-delete-on-close. The old schema has no way to represent
-- "closed but retained", so rows currently closed (is_open = false) simply
-- become indistinguishable from open ones once the column is dropped -- they
-- reappear as available on the public application. This does NOT re-delete
-- them, since that would cascade into application_position_selections and
-- position_questions exactly like the pre-migration behavior this migration
-- was written to fix.
-- ============================================================================

DO $$
DECLARE
  reopened_count int;
BEGIN
  SELECT COUNT(*) INTO reopened_count
  FROM hiring.application_positions_available
  WHERE is_open = false;

  IF reopened_count > 0 THEN
    RAISE NOTICE
      '% previously-closed position(s) will become open again after this rollback (pre-migration schema cannot represent "closed but retained"). Review hiring.application_positions_available.',
      reopened_count;
  END IF;
END $$;

ALTER TABLE hiring.application_positions_available
  DROP CONSTRAINT IF EXISTS application_positions_available_position_id_key;

ALTER TABLE hiring.application_positions_available
  DROP COLUMN IF EXISTS is_open;
