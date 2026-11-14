ALTER TABLE hiring.applications DROP COLUMN IF EXISTS applicant_role;

DROP TABLE IF EXISTS hiring.offers;
DROP TABLE IF EXISTS hiring.candidate_notes;
DROP TABLE IF EXISTS hiring.selection_events;
DROP TABLE IF EXISTS hiring.cycle_events;
DROP TABLE IF EXISTS hiring.cycle_leadership;
DROP TABLE IF EXISTS hiring.cycles;

DROP TYPE IF EXISTS hiring.offer_response_via_enum;
DROP TYPE IF EXISTS hiring.offer_response_enum;
DROP TYPE IF EXISTS hiring.note_kind_enum;
DROP TYPE IF EXISTS hiring.cycle_event_type_enum;
DROP TYPE IF EXISTS hiring.leadership_kind_enum;
DROP TYPE IF EXISTS hiring.cycle_phase_enum;
