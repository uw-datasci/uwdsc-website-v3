-- ============================================================================
-- Drop RLS policies
-- ============================================================================
DROP POLICY IF EXISTS exec_form_submissions_delete ON public.exec_form_submissions;
DROP POLICY IF EXISTS exec_form_submissions_update ON public.exec_form_submissions;
DROP POLICY IF EXISTS exec_form_submissions_insert ON public.exec_form_submissions;
DROP POLICY IF EXISTS exec_form_submissions_select ON public.exec_form_submissions;

-- Disable RLS
ALTER TABLE public.exec_form_submissions DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Drop trigger and function
-- ============================================================================
DROP TRIGGER IF EXISTS exec_form_submissions_set_updated_at ON public.exec_form_submissions;
DROP FUNCTION IF EXISTS public.set_updated_at();

-- ============================================================================
-- Drop indexes
-- ============================================================================
DROP INDEX IF EXISTS public.idx_exec_form_submissions_role_id;
DROP INDEX IF EXISTS public.idx_exec_form_submissions_term_id;
DROP INDEX IF EXISTS public.idx_exec_form_submissions_profile_id;

-- ============================================================================
-- Drop table
-- ============================================================================
DROP TABLE IF EXISTS public.exec_form_submissions;

-- ============================================================================
-- Remove onboarding date columns from terms
-- ============================================================================
ALTER TABLE public.terms
  DROP COLUMN IF EXISTS onboarding_form_due_date,
  DROP COLUMN IF EXISTS onboarding_form_start_date;

-- ============================================================================
-- Drop enum
-- ============================================================================
DROP TYPE IF EXISTS public.term_type_enum;
