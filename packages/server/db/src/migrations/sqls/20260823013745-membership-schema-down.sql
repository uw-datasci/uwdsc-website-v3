-- ============================================================================
-- Reverse the membership domain schema.
-- ============================================================================

DROP TABLE IF EXISTS membership.email_receipts;
DROP TABLE IF EXISTS membership.submission_reviews;
DROP TABLE IF EXISTS membership.submission_files;
DROP TABLE IF EXISTS membership.payment_submissions;

DROP TYPE IF EXISTS membership.review_decision_enum;
DROP TYPE IF EXISTS membership.submission_source_enum;
DROP TYPE IF EXISTS membership.submission_status_enum;

ALTER TABLE membership.memberships SET SCHEMA public;

-- Restore the RPC body. CREATE OR REPLACE rather than DROP + CREATE so the
-- EXECUTE grant survives (a DROP would silently break the browser heartbeat).
CREATE OR REPLACE FUNCTION public.increment_membership_active_time(
  p_membership_id uuid,
  p_seconds integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_seconds IS NULL OR p_seconds <= 0 THEN
    RETURN;
  END IF;

  UPDATE public.memberships m
  SET
    active_time_seconds = m.active_time_seconds + p_seconds,
    updated_at = now()
  WHERE m.id = p_membership_id
    AND m.profile_id = auth.uid()
    AND m.term_id = (SELECT id FROM public.terms WHERE is_active = true LIMIT 1);
END;
$$;

DROP SCHEMA IF EXISTS membership;
