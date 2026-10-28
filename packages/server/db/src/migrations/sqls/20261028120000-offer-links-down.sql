ALTER TABLE hiring.offers
  DROP CONSTRAINT IF EXISTS offers_response_note_length,
  DROP CONSTRAINT IF EXISTS offers_personal_line_length,
  DROP COLUMN IF EXISTS response_note,
  DROP COLUMN IF EXISTS personal_line;
