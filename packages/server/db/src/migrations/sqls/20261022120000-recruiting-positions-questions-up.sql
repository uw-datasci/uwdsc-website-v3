-- Per-cycle open positions, a question bank keyed by exec position, answer snapshots,
-- and leadership roster storage.

-- Open positions per cycle. Legacy rows keep cycle_id NULL.
ALTER TABLE hiring.application_positions_available
  ADD COLUMN cycle_id UUID REFERENCES hiring.cycles(id) ON DELETE RESTRICT,
  ADD COLUMN openings INT NOT NULL DEFAULT 1,
  ADD CONSTRAINT application_positions_available_openings_positive CHECK (openings > 0);

ALTER TABLE hiring.application_positions_available
  DROP CONSTRAINT application_positions_available_position_id_key;

ALTER TABLE hiring.application_positions_available
  ADD CONSTRAINT application_positions_available_cycle_id_position_id_key UNIQUE (cycle_id, position_id);

ALTER TABLE hiring.application_position_selections
  DROP CONSTRAINT application_position_selections_position_id_fkey,
  ADD CONSTRAINT application_position_selections_position_id_fkey
    FOREIGN KEY (position_id) REFERENCES hiring.application_positions_available(id) ON DELETE RESTRICT;

-- Question links point at org.exec_positions instead of a position row. NULL = General.
ALTER TABLE hiring.position_questions
  DROP CONSTRAINT position_questions_position_id_fkey;

DO $$
DECLARE
  unresolvable int;
BEGIN
  SELECT COUNT(*) INTO unresolvable
  FROM hiring.position_questions pq
  LEFT JOIN hiring.application_positions_available apa ON apa.id = pq.position_id
  WHERE pq.position_id IS NOT NULL
    AND (apa.id IS NULL OR apa.position_id IS NULL);

  IF unresolvable > 0 THEN
    RAISE EXCEPTION
      'Cannot remap hiring.position_questions: % row(s) resolve to no exec position.',
      unresolvable;
  END IF;
END $$;

-- Two passes so the remap never collides with UNIQUE (position_id, question_id) mid-update.
UPDATE hiring.position_questions pq
SET position_id = -apa.position_id
FROM hiring.application_positions_available apa
WHERE apa.id = pq.position_id;

UPDATE hiring.position_questions
SET position_id = -position_id
WHERE position_id < 0;

ALTER TABLE hiring.position_questions
  ADD CONSTRAINT position_questions_position_id_fkey
    FOREIGN KEY (position_id) REFERENCES org.exec_positions(id) ON DELETE RESTRICT;

-- Archive instead of delete.
ALTER TABLE hiring.questions
  ADD COLUMN archived_at TIMESTAMPTZ,
  ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE TRIGGER questions_set_updated_at
  BEFORE UPDATE ON hiring.questions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Answers keep the question text they were written against.
ALTER TABLE hiring.answers
  ADD COLUMN question_text TEXT;

UPDATE hiring.answers a
SET question_text = q.question_text
FROM hiring.questions q
WHERE q.id = a.question_id;

ALTER TABLE hiring.answers
  DROP CONSTRAINT answers_question_id_fkey,
  ADD CONSTRAINT answers_question_id_fkey
    FOREIGN KEY (question_id) REFERENCES hiring.questions(id) ON DELETE RESTRICT;

-- Leadership roster: editable draft on the cycle, prior role to restore on post-lock removal.
ALTER TABLE hiring.cycles
  ADD COLUMN leadership_draft JSONB;

ALTER TABLE hiring.cycle_leadership
  ADD COLUMN prior_role public.user_role_enum,
  ADD COLUMN prior_subteam_id INT REFERENCES org.subteams(id) ON DELETE RESTRICT;

-- General questions that replace the old returning-exec form fields.
INSERT INTO hiring.questions (question_text, type, max_length, help_text)
SELECT v.question_text, 'text'::hiring.application_input_enum, v.max_length, v.help_text
FROM (VALUES
  ('Past DSC roles (if any)', 200, 'List positions and terms, e.g. Developer (F25). Leave blank if none.'),
  ('Will you be in person next term?', 200, 'e.g. Yes, No (outside the GTA), No (in the GTA), Not sure')
) AS v(question_text, max_length, help_text)
WHERE NOT EXISTS (
  SELECT 1 FROM hiring.questions q WHERE q.question_text = v.question_text
);

INSERT INTO hiring.position_questions (position_id, question_id, sort_order)
SELECT NULL, q.id,
  (SELECT COALESCE(MAX(sort_order), 0) FROM hiring.position_questions WHERE position_id IS NULL)
    + row_number() OVER (ORDER BY q.id)
FROM hiring.questions q
WHERE q.question_text IN ('Past DSC roles (if any)', 'Will you be in person next term?')
  AND NOT EXISTS (
    SELECT 1 FROM hiring.position_questions pq
    WHERE pq.question_id = q.id AND pq.position_id IS NULL
  );
