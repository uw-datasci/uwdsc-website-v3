DROP TRIGGER IF EXISTS enforce_returning_exec_position_limit ON public.returning_exec_position_selections;
DROP FUNCTION IF EXISTS public.check_returning_exec_position_limit();
DROP TRIGGER IF EXISTS returning_exec_submissions_set_updated_at ON public.returning_exec_submissions;
DROP TABLE IF EXISTS public.returning_exec_position_selections;
DROP TABLE IF EXISTS public.returning_exec_submissions;
