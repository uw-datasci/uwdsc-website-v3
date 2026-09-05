-- ============================================================================
-- Membership domain schema
--
-- Moves `memberships` out of public and adds the online proof-of-payment
-- review pipeline alongside it. `payment_method_enum` and `terms` deliberately
-- stay in public -- the enum is referenced from admin/core repositories by bare
-- name, and `terms` is shared with hiring, events and page_views.
-- ============================================================================

CREATE SCHEMA membership;

ALTER TABLE public.memberships SET SCHEMA membership;

-- RLS policies travel with the table on SET SCHEMA, and the existing ones
-- (memberships_select_own_or_elevated, ...) reference public.is_exec_or_admin /
-- public.is_admin by qualified name, so none of them need recreating.

-- ----------------------------------------------------------------------------
-- Active-time heartbeat RPC
--
-- Called from the browser (apps/web/hooks/useActiveTimeTracker.ts) via
-- supabase.rpc(), so the function stays in `public` -- PostgREST only exposes
-- schemas on the project's exposed-schemas list, and keeping it here means no
-- dashboard change and no frontend change.
--
-- plpgsql bodies are not validated at definition time, so without this the
-- SET SCHEMA above would leave a function that only fails at runtime.
--
-- CREATE OR REPLACE, never DROP + CREATE: the signature is unchanged, so the
-- function is mutated in place and its EXECUTE grant (Postgres' default grant
-- to PUBLIC, which is how `authenticated` reaches it) survives.
--
-- `SET search_path = public` is left as-is: `membership.memberships` is
-- schema-qualified so it resolves regardless, and pinning the search_path is
-- SECURITY DEFINER hardening we do not want to widen.
-- ----------------------------------------------------------------------------
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

  UPDATE membership.memberships m
  SET
    active_time_seconds = m.active_time_seconds + p_seconds,
    updated_at = now()
  WHERE m.id = p_membership_id
    AND m.profile_id = auth.uid()
    AND m.term_id = (SELECT id FROM public.terms WHERE is_active = true LIMIT 1);
END;
$$;

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
CREATE TYPE membership.submission_status_enum AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE membership.submission_source_enum AS ENUM ('web_form', 'email');
CREATE TYPE membership.review_decision_enum   AS ENUM ('approved', 'rejected');

-- ----------------------------------------------------------------------------
-- payment_submissions: the online-payment review queue.
-- One row per (profile, term), edited in place on re-submit.
-- ----------------------------------------------------------------------------
CREATE TABLE membership.payment_submissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  term_id       UUID NOT NULL REFERENCES public.terms(id)    ON DELETE RESTRICT,
  status        membership.submission_status_enum NOT NULL DEFAULT 'pending',
  source        membership.submission_source_enum NOT NULL DEFAULT 'web_form',
  -- Point-in-time snapshot of what the member attested to. Deliberately
  -- denormalised from profiles: a reviewer compares these against the receipt,
  -- and a later profile edit must not rewrite history.
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  wat_iam       TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  -- Nullable: the web form requires both, but a forwarded Moneris receipt
  -- carries neither, so NULL means "not asked" rather than "not on co-op".
  program       TEXT,
  is_coop_term  BOOLEAN,
  rejection_reason TEXT,
  reviewed_by   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at   TIMESTAMPTZ,
  submitted_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT payment_submissions_profile_term_key UNIQUE (profile_id, term_id),
  -- Mirrors memberships_verifier_not_self so self-review fails here rather than
  -- deeper in the approval transaction.
  CONSTRAINT payment_submissions_reviewer_not_self CHECK (
    reviewed_by IS NULL OR reviewed_by <> profile_id
  ),
  CONSTRAINT payment_submissions_rejected_has_reason CHECK (
    status <> 'rejected' OR btrim(COALESCE(rejection_reason, '')) <> ''
  )
);

CREATE INDEX idx_payment_submissions_term_status
  ON membership.payment_submissions (term_id, status);

CREATE INDEX idx_payment_submissions_profile
  ON membership.payment_submissions (profile_id);

-- ----------------------------------------------------------------------------
-- submission_files: uploaded proofs. One current file per submission;
-- superseded uploads are retained so a reviewer can see what was rejected.
-- ----------------------------------------------------------------------------
CREATE TABLE membership.submission_files (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES membership.payment_submissions(id) ON DELETE CASCADE,
  object_key    TEXT NOT NULL UNIQUE,
  file_name     TEXT NOT NULL,
  mime_type     TEXT NOT NULL,
  size_bytes    INTEGER NOT NULL CHECK (size_bytes > 0),
  is_current    BOOLEAN NOT NULL DEFAULT true,
  uploaded_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX submission_files_one_current
  ON membership.submission_files (submission_id) WHERE is_current;

-- ----------------------------------------------------------------------------
-- submission_reviews: append-only decision log.
-- reviewer_id IS NULL means the decision was automated (email receipt).
-- ----------------------------------------------------------------------------
CREATE TABLE membership.submission_reviews (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES membership.payment_submissions(id) ON DELETE CASCADE,
  decision      membership.review_decision_enum NOT NULL,
  reason        TEXT,
  reviewer_id   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT submission_reviews_rejected_has_reason CHECK (
    decision <> 'rejected' OR btrim(COALESCE(reason, '')) <> ''
  )
);

CREATE INDEX idx_submission_reviews_submission
  ON membership.submission_reviews (submission_id, created_at DESC);

-- ----------------------------------------------------------------------------
-- email_receipts: forwarded proof-of-payment emails.
--
-- submission_id and profile_id are nullable on purpose: an inbound email may
-- fail to parse, or resolve to no account at all. Those emails are dropped
-- entirely today -- storing them unattached means an exec can still act on one.
-- ----------------------------------------------------------------------------
CREATE TABLE membership.email_receipts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id   UUID REFERENCES membership.payment_submissions(id) ON DELETE SET NULL,
  profile_id      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  -- Resend delivers at-least-once; this is the idempotency key.
  resend_email_id TEXT NOT NULL UNIQUE,
  from_address    TEXT NOT NULL,
  to_address      TEXT,
  subject         TEXT,
  received_at     TIMESTAMPTZ,
  text_body       TEXT,
  html_body       TEXT,
  raw_payload     JSONB,
  parse_status    TEXT NOT NULL CHECK (parse_status IN ('pending', 'parsed', 'failed')),
  parse_error     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_email_receipts_submission ON membership.email_receipts (submission_id);
CREATE INDEX idx_email_receipts_profile    ON membership.email_receipts (profile_id);

-- ----------------------------------------------------------------------------
-- RLS
--
-- Every server write goes through postgres.js as the DB owner (BaseRepository),
-- which bypasses RLS. These policies exist so that if the schema is ever
-- exposed to PostgREST, the browser still cannot reach anything it shouldn't.
-- No INSERT/UPDATE/DELETE policies are granted at all.
-- ----------------------------------------------------------------------------
ALTER TABLE membership.payment_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY payment_submissions_select_own_or_elevated ON membership.payment_submissions
  FOR SELECT
  USING (
    profile_id = auth.uid() OR
    public.is_exec_or_admin(auth.uid())
  );

ALTER TABLE membership.submission_files   ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership.submission_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership.email_receipts     ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- Grants (Supabase roles). Matches how split-schemas granted `hiring`.
-- `anon` gets nothing, and no table-level SELECT is granted.
-- ----------------------------------------------------------------------------
GRANT USAGE ON SCHEMA membership TO authenticated, service_role;
