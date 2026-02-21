-- Drop RLS policies — attendance
DROP POLICY IF EXISTS attendance_delete_exec_admin ON public.attendance;
DROP POLICY IF EXISTS attendance_update_exec_admin ON public.attendance;
DROP POLICY IF EXISTS attendance_insert_exec_admin ON public.attendance;
DROP POLICY IF EXISTS attendance_select_own_or_elevated ON public.attendance;

-- Drop RLS policies — events
DROP POLICY IF EXISTS events_delete_admin_only ON public.events;
DROP POLICY IF EXISTS events_update_exec_admin ON public.events;
DROP POLICY IF EXISTS events_insert_exec_admin ON public.events;
DROP POLICY IF EXISTS events_select_public ON public.events;

-- Revoke grants
REVOKE SELECT ON public.attendance FROM authenticated;
REVOKE SELECT ON public.events FROM authenticated;

-- Disable RLS
ALTER TABLE public.attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;

-- Drop trigger and function
DROP TRIGGER IF EXISTS events_sync_buffered_times ON public.events;
DROP FUNCTION IF EXISTS public.sync_event_buffered_times();

-- Drop indexes
DROP INDEX IF EXISTS public.idx_attendance_profile_id;
DROP INDEX IF EXISTS public.idx_attendance_event_id;
DROP INDEX IF EXISTS public.idx_events_end_time;
DROP INDEX IF EXISTS public.idx_events_start_time;

-- Drop tables (attendance first due to FK dependency on events)
DROP TABLE IF EXISTS public.attendance CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;