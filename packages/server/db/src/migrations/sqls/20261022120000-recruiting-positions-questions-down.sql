-- Seeded General questions are left in place (answers may reference them).

ALTER TABLE hiring.cycle_leadership
  DROP COLUMN IF EXISTS prior_subteam_id,
  DROP COLUMN IF EXISTS prior_role;

ALTER TABLE hiring.cycles
  DROP COLUMN IF EXISTS leadership_draft;

ALTER TABLE hiring.answers
  DROP CONSTRAINT answers_question_id_fkey,
  ADD CONSTRAINT answers_question_id_fkey
    FOREIGN KEY (question_id) REFERENCES hiring.questions(id) ON DELETE CASCADE;

ALTER TABLE hiring.answers
  DROP COLUMN IF EXISTS question_text;

DROP TRIGGER IF EXISTS questions_set_updated_at ON hiring.questions;

ALTER TABLE hiring.questions
  DROP COLUMN IF EXISTS updated_at,
  DROP COLUMN IF EXISTS archived_at;

-- Point question links back at a position row (the legacy one, else the lowest id).
ALTER TABLE hiring.position_questions
  DROP CONSTRAINT position_questions_position_id_fkey;

UPDATE hiring.position_questions pq
SET position_id = -apa.id
FROM (
  SELECT DISTINCT ON (position_id) id, position_id
  FROM hiring.application_positions_available
  ORDER BY position_id, (cycle_id IS NOT NULL), id
) apa
WHERE apa.position_id = pq.position_id;

UPDATE hiring.position_questions
SET position_id = -position_id
WHERE position_id < 0;

ALTER TABLE hiring.position_questions
  ADD CONSTRAINT position_questions_position_id_fkey
    FOREIGN KEY (position_id) REFERENCES hiring.application_positions_available(id) ON DELETE CASCADE;

ALTER TABLE hiring.application_position_selections
  DROP CONSTRAINT application_position_selections_position_id_fkey,
  ADD CONSTRAINT application_position_selections_position_id_fkey
    FOREIGN KEY (position_id) REFERENCES hiring.application_positions_available(id) ON DELETE CASCADE;

-- Per-cycle rows can't fit UNIQUE (position_id); this fails if any cycle has rows.
ALTER TABLE hiring.application_positions_available
  DROP CONSTRAINT application_positions_available_cycle_id_position_id_key;

ALTER TABLE hiring.application_positions_available
  ADD CONSTRAINT application_positions_available_position_id_key UNIQUE (position_id);

ALTER TABLE hiring.application_positions_available
  DROP CONSTRAINT IF EXISTS application_positions_available_openings_positive,
  DROP COLUMN IF EXISTS openings,
  DROP COLUMN IF EXISTS cycle_id;
