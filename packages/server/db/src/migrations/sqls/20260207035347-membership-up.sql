CREATE TABLE public.memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  payment_method public.payment_method_enum,
  payment_location VARCHAR(255),
  verifier_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  CONSTRAINT memberships_verifier_not_self CHECK (
    verifier_id IS NULL OR verifier_id <> profile_id
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- RLS Policies
-- ============================================================================

-- Enable RLS
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- memberships: SELECT - Own membership OR exec/admin can see all
CREATE POLICY memberships_select_own_or_elevated ON public.memberships
  FOR SELECT
  USING (
    profile_id = auth.uid() OR 
    public.is_exec_or_admin(auth.uid())
  );

-- memberships: INSERT - Exec/admin only (users cannot create their own; someone else creates it for them)
CREATE POLICY memberships_insert_exec_admin ON public.memberships
  FOR INSERT
  WITH CHECK (public.is_exec_or_admin(auth.uid()));

-- memberships: UPDATE - Exec/admin only
CREATE POLICY memberships_update_exec_admin ON public.memberships
  FOR UPDATE
  USING (public.is_exec_or_admin(auth.uid()))
  WITH CHECK (public.is_exec_or_admin(auth.uid()));

-- memberships: DELETE - Admin only
CREATE POLICY memberships_delete_admin_only ON public.memberships
  FOR DELETE
  USING (public.is_admin(auth.uid()));
