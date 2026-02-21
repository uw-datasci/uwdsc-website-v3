-- ============================================================================
-- Events table
-- ============================================================================
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  image_url TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  buffered_start_time TIMESTAMPTZ NOT NULL DEFAULT '1970-01-01 00:00:00+00'::timestamptz, -- overwritten by trigger
  buffered_end_time TIMESTAMPTZ NOT NULL DEFAULT '1970-01-01 00:00:00+00'::timestamptz,   -- overwritten by trigger
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- Attendance junction table
-- ============================================================================
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, profile_id)
);

-- ============================================================================
-- Indexes
-- ============================================================================
CREATE INDEX idx_events_start_time ON public.events (start_time);
CREATE INDEX idx_events_end_time ON public.events (end_time);
CREATE INDEX idx_attendance_event_id ON public.attendance (event_id);
CREATE INDEX idx_attendance_profile_id ON public.attendance (profile_id);

-- ============================================================================
-- Trigger: sync buffered times whenever start_time or end_time changes
-- ============================================================================
CREATE OR REPLACE FUNCTION public.sync_event_buffered_times()
RETURNS TRIGGER AS $$
BEGIN
  NEW.buffered_start_time := NEW.start_time - interval '30 minutes';
  NEW.buffered_end_time   := NEW.end_time   + interval '30 minutes';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_sync_buffered_times
BEFORE INSERT OR UPDATE OF start_time, end_time ON public.events
FOR EACH ROW EXECUTE FUNCTION public.sync_event_buffered_times();

-- ============================================================================
-- RLS Policies — events
-- ============================================================================
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- events: SELECT — public (anyone can read)
CREATE POLICY events_select_public ON public.events
  FOR SELECT
  USING (true);

-- events: INSERT — exec/admin only
CREATE POLICY events_insert_exec_admin ON public.events
  FOR INSERT
  WITH CHECK (public.is_exec_or_admin(auth.uid()));

-- events: UPDATE — exec/admin only
CREATE POLICY events_update_exec_admin ON public.events
  FOR UPDATE
  USING (public.is_exec_or_admin(auth.uid()))
  WITH CHECK (public.is_exec_or_admin(auth.uid()));

-- events: DELETE — admin only
CREATE POLICY events_delete_admin_only ON public.events
  FOR DELETE
  USING (public.is_admin(auth.uid()));

GRANT SELECT ON public.events TO authenticated;

-- ============================================================================
-- RLS Policies — attendance
-- ============================================================================
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- attendance: SELECT — own rows OR exec/admin can see all
CREATE POLICY attendance_select_own_or_elevated ON public.attendance
  FOR SELECT
  USING (
    profile_id = auth.uid() OR
    public.is_exec_or_admin(auth.uid())
  );

-- attendance: INSERT — exec/admin only
CREATE POLICY attendance_insert_exec_admin ON public.attendance
  FOR INSERT
  WITH CHECK (public.is_exec_or_admin(auth.uid()));

-- attendance: UPDATE — exec/admin only
CREATE POLICY attendance_update_exec_admin ON public.attendance
  FOR UPDATE
  USING (public.is_exec_or_admin(auth.uid()))
  WITH CHECK (public.is_exec_or_admin(auth.uid()));

-- attendance: DELETE — exec/admin only
CREATE POLICY attendance_delete_exec_admin ON public.attendance
  FOR DELETE
  USING (public.is_exec_or_admin(auth.uid()));

GRANT SELECT ON public.attendance TO authenticated;