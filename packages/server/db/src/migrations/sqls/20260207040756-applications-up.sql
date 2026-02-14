-- 1. Independent Tables
CREATE TABLE terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(5) UNIQUE NOT NULL, -- e.g., 'W26'
  is_active boolean DEFAULT false,
  application_release_date timestamptz NOT NULL,
  application_deadline timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Positions that are available to apply for
CREATE TABLE application_positions_available (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position_id uuid REFERENCES public.exec_positions(id) ON DELETE CASCADE
);

CREATE TABLE questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text text NOT NULL,
  type application_input_enum NOT NULL DEFAULT 'textarea',
  max_length int,
  placeholder text,
  help_text text,
  created_at timestamptz DEFAULT now()
);

-- 2. The Bridge (Logic)
CREATE TABLE term_position_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term_id uuid REFERENCES terms(id) ON DELETE CASCADE,
  position_id uuid REFERENCES application_positions_available(id) ON DELETE CASCADE, -- NULL = General
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  sort_order int DEFAULT 0,
  UNIQUE(term_id, position_id, question_id)
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
  status application_status_enum DEFAULT 'draft',
  submitted_at timestamptz DEFAULT now(),
  UNIQUE(profile_id, term_id)
);

CREATE TABLE application_position_selections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE,
  position_id uuid REFERENCES application_positions_available(id) ON DELETE CASCADE,
  priority int CHECK (priority BETWEEN 1 AND 3),
  status application_review_status_enum DEFAULT 'In Review',
  UNIQUE(application_id, position_id)
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

CREATE OR REPLACE FUNCTION check_position_limit() 
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM application_position_selections WHERE application_id = NEW.application_id) >= 3 THEN
    RAISE EXCEPTION 'You cannot apply for more than 3 positions.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_position_limit
BEFORE INSERT ON application_position_selections
FOR EACH ROW EXECUTE FUNCTION check_position_limit();

-- ============================================================================
-- RLS Helper Function for Applications
-- ============================================================================

-- Check if application is in draft status
CREATE OR REPLACE FUNCTION public.is_application_draft(app_id uuid)
RETURNS boolean AS $$
  SELECT COALESCE((SELECT status = 'draft' FROM public.applications WHERE id = app_id), false);
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================================
-- RLS Policies
-- ============================================================================

-- Enable RLS
ALTER TABLE public.terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_positions_available ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.term_position_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_position_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

-- terms: SELECT - Authenticated users
CREATE POLICY terms_select_authenticated ON public.terms
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- terms: INSERT/UPDATE/DELETE - Admin only
CREATE POLICY terms_insert_admin_only ON public.terms
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY terms_update_admin_only ON public.terms
  FOR UPDATE
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY terms_delete_admin_only ON public.terms
  FOR DELETE
  USING (public.is_admin(auth.uid()));

-- application_positions_available: SELECT - Authenticated users
CREATE POLICY application_positions_available_select_authenticated ON public.application_positions_available
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- application_positions_available: INSERT/UPDATE/DELETE - Admin only
CREATE POLICY application_positions_available_insert_admin_only ON public.application_positions_available
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY application_positions_available_update_admin_only ON public.application_positions_available
  FOR UPDATE
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY application_positions_available_delete_admin_only ON public.application_positions_available
  FOR DELETE
  USING (public.is_admin(auth.uid()));

-- questions: SELECT - Authenticated users
CREATE POLICY questions_select_authenticated ON public.questions
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- questions: INSERT/UPDATE/DELETE - Admin only
CREATE POLICY questions_insert_admin_only ON public.questions
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY questions_update_admin_only ON public.questions
  FOR UPDATE
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY questions_delete_admin_only ON public.questions
  FOR DELETE
  USING (public.is_admin(auth.uid()));

-- term_position_questions: SELECT - Authenticated users
CREATE POLICY term_position_questions_select_authenticated ON public.term_position_questions
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- term_position_questions: INSERT/UPDATE/DELETE - Admin only
CREATE POLICY term_position_questions_insert_admin_only ON public.term_position_questions
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY term_position_questions_update_admin_only ON public.term_position_questions
  FOR UPDATE
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY term_position_questions_delete_admin_only ON public.term_position_questions
  FOR DELETE
  USING (public.is_admin(auth.uid()));

-- applications: SELECT - Own application OR admin can see all
CREATE POLICY applications_select_own_or_admin ON public.applications
  FOR SELECT
  USING (
    profile_id = auth.uid() OR 
    public.is_admin(auth.uid())
  );

-- applications: INSERT - Authenticated members only
CREATE POLICY applications_insert_members_only ON public.applications
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    profile_id = auth.uid() AND
    public.get_user_role(auth.uid()) = 'member'
  );

-- applications: UPDATE - Own draft OR admin can update any
CREATE POLICY applications_update_own_draft_or_admin ON public.applications
  FOR UPDATE
  USING (
    (profile_id = auth.uid() AND public.is_application_draft(id)) OR
    public.is_admin(auth.uid())
  )
  WITH CHECK (
    (profile_id = auth.uid() AND public.is_application_draft(id)) OR
    public.is_admin(auth.uid())
  );

-- applications: DELETE - Admin only
CREATE POLICY applications_delete_admin_only ON public.applications
  FOR DELETE
  USING (public.is_admin(auth.uid()));

-- application_position_selections: SELECT - Own selections (via application) OR admin
CREATE POLICY application_position_selections_select_own_or_admin ON public.application_position_selections
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.applications 
      WHERE applications.id = application_position_selections.application_id 
      AND applications.profile_id = auth.uid()
    ) OR
    public.is_admin(auth.uid())
  );

-- application_position_selections: INSERT - Own application
CREATE POLICY application_position_selections_insert_own ON public.application_position_selections
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.applications 
      WHERE applications.id = application_position_selections.application_id 
      AND applications.profile_id = auth.uid()
    )
  );

-- application_position_selections: UPDATE - Admin only (for status changes)
CREATE POLICY application_position_selections_update_admin_only ON public.application_position_selections
  FOR UPDATE
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- application_position_selections: DELETE - Admin only
CREATE POLICY application_position_selections_delete_admin_only ON public.application_position_selections
  FOR DELETE
  USING (public.is_admin(auth.uid()));

-- answers: SELECT - Own answers (via application) OR admin
CREATE POLICY answers_select_own_or_admin ON public.answers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.applications 
      WHERE applications.id = answers.application_id 
      AND applications.profile_id = auth.uid()
    ) OR
    public.is_admin(auth.uid())
  );

-- answers: INSERT - Own application
CREATE POLICY answers_insert_own ON public.answers
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.applications 
      WHERE applications.id = answers.application_id 
      AND applications.profile_id = auth.uid()
    )
  );

-- answers: UPDATE - Own answer AND application is draft OR admin
CREATE POLICY answers_update_own_draft_or_admin ON public.answers
  FOR UPDATE
  USING (
    (
      EXISTS (
        SELECT 1 FROM public.applications 
        WHERE applications.id = answers.application_id 
        AND applications.profile_id = auth.uid()
        AND public.is_application_draft(answers.application_id)
      )
    ) OR
    public.is_admin(auth.uid())
  )
  WITH CHECK (
    (
      EXISTS (
        SELECT 1 FROM public.applications 
        WHERE applications.id = answers.application_id 
        AND applications.profile_id = auth.uid()
        AND public.is_application_draft(answers.application_id)
      )
    ) OR
    public.is_admin(auth.uid())
  );

-- answers: DELETE - Admin only
CREATE POLICY answers_delete_admin_only ON public.answers
  FOR DELETE
  USING (public.is_admin(auth.uid()));
