-- Drop RLS policies
DROP POLICY IF EXISTS answers_delete_admin_only ON public.answers;
DROP POLICY IF EXISTS answers_update_own_draft_or_admin ON public.answers;
DROP POLICY IF EXISTS answers_insert_own ON public.answers;
DROP POLICY IF EXISTS answers_select_own_or_admin ON public.answers;

DROP POLICY IF EXISTS application_position_selections_delete_admin_only ON public.application_position_selections;
DROP POLICY IF EXISTS application_position_selections_update_admin_only ON public.application_position_selections;
DROP POLICY IF EXISTS application_position_selections_insert_own ON public.application_position_selections;
DROP POLICY IF EXISTS application_position_selections_select_own_or_admin ON public.application_position_selections;

DROP POLICY IF EXISTS applications_delete_admin_only ON public.applications;
DROP POLICY IF EXISTS applications_update_own_draft_or_admin ON public.applications;
DROP POLICY IF EXISTS applications_insert_members_only ON public.applications;
DROP POLICY IF EXISTS applications_select_own_or_admin ON public.applications;

DROP POLICY IF EXISTS position_questions_delete_admin_only ON public.position_questions;
DROP POLICY IF EXISTS position_questions_update_admin_only ON public.position_questions;
DROP POLICY IF EXISTS position_questions_insert_admin_only ON public.position_questions;
DROP POLICY IF EXISTS position_questions_select_authenticated ON public.position_questions;

DROP POLICY IF EXISTS questions_delete_admin_only ON public.questions;
DROP POLICY IF EXISTS questions_update_admin_only ON public.questions;
DROP POLICY IF EXISTS questions_insert_admin_only ON public.questions;
DROP POLICY IF EXISTS questions_select_authenticated ON public.questions;

DROP POLICY IF EXISTS application_positions_available_delete_admin_only ON public.application_positions_available;
DROP POLICY IF EXISTS application_positions_available_update_admin_only ON public.application_positions_available;
DROP POLICY IF EXISTS application_positions_available_insert_admin_only ON public.application_positions_available;
DROP POLICY IF EXISTS application_positions_available_select_authenticated ON public.application_positions_available;

DROP POLICY IF EXISTS terms_delete_admin_only ON public.terms;
DROP POLICY IF EXISTS terms_update_admin_only ON public.terms;
DROP POLICY IF EXISTS terms_insert_admin_only ON public.terms;
DROP POLICY IF EXISTS terms_select_authenticated ON public.terms;

-- Disable RLS
ALTER TABLE public.answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_position_selections DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.position_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_positions_available DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.terms DISABLE ROW LEVEL SECURITY;

-- Drop helper function
DROP FUNCTION IF EXISTS public.is_application_draft(uuid);

-- Drop trigger
DROP TRIGGER IF EXISTS enforce_position_limit ON application_position_selections;

-- Drop functions
DROP FUNCTION IF EXISTS check_position_limit();
DROP FUNCTION IF EXISTS delete_old_terms();

-- Drop tables in reverse dependency order
-- Drop dependent tables first
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS application_position_selections CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS position_questions CASCADE;

-- Drop independent tables
DROP TABLE IF EXISTS application_positions_available CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS terms CASCADE;
