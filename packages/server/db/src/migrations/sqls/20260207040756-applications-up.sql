-- 1. Independent Tables
CREATE TABLE terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(5) UNIQUE NOT NULL, -- e.g., 'W26'
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE application_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL
);

CREATE TABLE questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text text NOT NULL,
  type application_input_enum NOT NULL DEFAULT 'textarea',
  options jsonb, -- For dropdown choices
  created_at timestamptz DEFAULT now()
);

-- 2. The Bridge (Logic)
CREATE TABLE term_role_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term_id uuid REFERENCES terms(id) ON DELETE CASCADE,
  role_id uuid REFERENCES application_roles(id) ON DELETE CASCADE, -- NULL = General
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  sort_order int DEFAULT 0,
  UNIQUE(term_id, role_id, question_id)
);

-- 3. The Submissions
CREATE TABLE applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  term_id uuid REFERENCES terms(id) ON DELETE CASCADE,
  resume_url text,
  full_name text NOT NULL,
  major text,
  year_of_study text,
  submitted_at timestamptz DEFAULT now(),
  UNIQUE(profile_id, term_id)
);

CREATE TABLE application_role_selections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE,
  role_id uuid REFERENCES application_roles(id) ON DELETE CASCADE,
  priority int CHECK (priority BETWEEN 1 AND 3),
  status application_review_status_enum DEFAULT 'In Review',
  UNIQUE(application_id, role_id)
);

CREATE TABLE answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE,
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  answer_text text NOT NULL
);

-- 4. Triggers
CREATE OR REPLACE FUNCTION delete_old_terms()
RETURNS void AS $$
BEGIN
  DELETE FROM terms
  WHERE id NOT IN (
    SELECT id FROM terms
    ORDER BY created_at DESC
    LIMIT 2
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_role_limit() 
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM application_role_selections WHERE application_id = NEW.application_id) >= 3 THEN
    RAISE EXCEPTION 'You cannot apply for more than 3 roles.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_role_limit
BEFORE INSERT ON application_role_selections
FOR EACH ROW EXECUTE FUNCTION check_role_limit();
