ALTER TABLE hiring.offers
  ADD COLUMN personal_line TEXT,
  ADD COLUMN response_note TEXT,
  ADD CONSTRAINT offers_personal_line_length CHECK (char_length(personal_line) <= 300),
  ADD CONSTRAINT offers_response_note_length CHECK (char_length(response_note) <= 500);
