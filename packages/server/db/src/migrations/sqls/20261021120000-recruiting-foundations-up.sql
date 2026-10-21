-- Recruiting data model. New tables are server-only (RLS on, no policies).

-- Enums

CREATE TYPE hiring.cycle_phase_enum AS ENUM (
  'leadership',
  'setup',
  'open',
  'review',
  'offers',
  'finalized'
);

CREATE TYPE hiring.leadership_kind_enum AS ENUM ('continuing', 'appointed', 'public_hire');

CREATE TYPE hiring.cycle_event_type_enum AS ENUM (
  'cycle_started',
  'leadership_locked',
  'leadership_edited',
  'phase_changed',
  'finalized'
);

CREATE TYPE hiring.note_kind_enum AS ENUM ('general', 'interview');

CREATE TYPE hiring.offer_response_enum AS ENUM ('accepted', 'declined');

CREATE TYPE hiring.offer_response_via_enum AS ENUM ('link', 'manual', 'expiry');

-- hiring.cycles
-- term_id: term applications are collected in; target_term_id: term being hired for
CREATE TABLE hiring.cycles (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term_id               UUID NOT NULL REFERENCES public.terms(id) ON DELETE RESTRICT,
  target_term_id        UUID NOT NULL REFERENCES public.terms(id) ON DELETE RESTRICT,
  phase                 hiring.cycle_phase_enum NOT NULL DEFAULT 'leadership',
  roster_locked_at      TIMESTAMPTZ,
  offer_response_hours  INT NOT NULL DEFAULT 48,
  finalized_at          TIMESTAMPTZ,
  finalized_by          UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by            UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT cycles_term_id_key UNIQUE (term_id),
  CONSTRAINT cycles_target_differs_from_term CHECK (target_term_id <> term_id),
  CONSTRAINT cycles_offer_response_hours_positive CHECK (offer_response_hours > 0)
);

CREATE INDEX idx_cycles_target_term_id ON hiring.cycles (target_term_id);

CREATE TRIGGER cycles_set_updated_at
  BEFORE UPDATE ON hiring.cycles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE hiring.cycles ENABLE ROW LEVEL SECURITY;

-- hiring.cycle_leadership
CREATE TABLE hiring.cycle_leadership (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id      UUID NOT NULL REFERENCES hiring.cycles(id) ON DELETE CASCADE,
  profile_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  role          public.user_role_enum NOT NULL,
  position_id   INT NOT NULL REFERENCES org.exec_positions(id) ON DELETE RESTRICT,
  subteam_id    INT NOT NULL REFERENCES org.subteams(id) ON DELETE RESTRICT,
  kind          hiring.leadership_kind_enum NOT NULL,
  confirmed_by  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  confirmed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT cycle_leadership_role_is_leadership CHECK (role IN ('pres', 'admin')),
  CONSTRAINT cycle_leadership_cycle_id_profile_id_key UNIQUE (cycle_id, profile_id)
);

CREATE INDEX idx_cycle_leadership_position_id ON hiring.cycle_leadership (cycle_id, position_id);

ALTER TABLE hiring.cycle_leadership ENABLE ROW LEVEL SECURITY;

-- hiring.cycle_events
CREATE TABLE hiring.cycle_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id    UUID NOT NULL REFERENCES hiring.cycles(id) ON DELETE CASCADE,
  actor_id    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type        hiring.cycle_event_type_enum NOT NULL,
  payload     JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_cycle_events_cycle_id_created_at ON hiring.cycle_events (cycle_id, created_at);

ALTER TABLE hiring.cycle_events ENABLE ROW LEVEL SECURITY;

-- hiring.selection_events
CREATE TABLE hiring.selection_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  selection_id  UUID NOT NULL REFERENCES hiring.application_position_selections(id) ON DELETE CASCADE,
  actor_id      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  from_status   hiring.application_review_status_enum,
  to_status     hiring.application_review_status_enum NOT NULL,
  reason        TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_selection_events_selection_id_created_at
  ON hiring.selection_events (selection_id, created_at);

ALTER TABLE hiring.selection_events ENABLE ROW LEVEL SECURITY;

-- hiring.candidate_notes
CREATE TABLE hiring.candidate_notes (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id              UUID NOT NULL REFERENCES hiring.cycles(id) ON DELETE CASCADE,
  candidate_profile_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_id             UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_role_label     TEXT NOT NULL,
  kind                  hiring.note_kind_enum NOT NULL DEFAULT 'general',
  body                  TEXT NOT NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at            TIMESTAMPTZ,
  CONSTRAINT candidate_notes_body_not_blank CHECK (length(btrim(body)) > 0)
);

CREATE INDEX idx_candidate_notes_cycle_id_candidate
  ON hiring.candidate_notes (cycle_id, candidate_profile_id);

CREATE TRIGGER candidate_notes_set_updated_at
  BEFORE UPDATE ON hiring.candidate_notes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE hiring.candidate_notes ENABLE ROW LEVEL SECURITY;

-- hiring.offers
CREATE TABLE hiring.offers (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  selection_id   UUID NOT NULL REFERENCES hiring.application_position_selections(id) ON DELETE CASCADE,
  token_hash     TEXT,
  sent_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at     TIMESTAMPTZ NOT NULL,
  email_id       TEXT,
  responded_at   TIMESTAMPTZ,
  response       hiring.offer_response_enum,
  responded_via  hiring.offer_response_via_enum,
  withdrawn_at   TIMESTAMPTZ,
  sent_by        UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  CONSTRAINT offers_token_hash_key UNIQUE (token_hash),
  CONSTRAINT offers_expires_after_sent CHECK (expires_at > sent_at),
  CONSTRAINT offers_response_complete CHECK (
    (response IS NULL AND responded_at IS NULL AND responded_via IS NULL)
    OR (response IS NOT NULL AND responded_at IS NOT NULL AND responded_via IS NOT NULL)
  )
);

CREATE UNIQUE INDEX idx_offers_one_live_per_selection
  ON hiring.offers (selection_id)
  WHERE withdrawn_at IS NULL;

ALTER TABLE hiring.offers ENABLE ROW LEVEL SECURITY;

-- hiring.applications.applicant_role
-- user_roles.role at submit
ALTER TABLE hiring.applications
  ADD COLUMN applicant_role public.user_role_enum;
