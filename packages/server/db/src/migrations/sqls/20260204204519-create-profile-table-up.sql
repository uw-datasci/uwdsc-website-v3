create table public.profiles (
  id uuid not null default gen_random_uuid(),
  first_name character varying(255) null,
  last_name character varying(255) null,
  user_role public.user_role_enum not null default 'member'::user_role_enum,
  has_paid boolean not null default false,
  wat_iam character varying(255) null,
  faculty public.faculty_enum null,
  term character varying(100) null,
  heard_from_where text null,
  payment_method public.payment_method_enum null,
  payment_location character varying(255) null,
  verifier character varying(255) null,
  member_ideas text null,
  is_math_soc_member boolean not null default false,
  created_at timestamp with time zone not null default CURRENT_TIMESTAMP,
  updated_at timestamp with time zone not null default CURRENT_TIMESTAMP,
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on update CASCADE on delete CASCADE
);

-- Create indexes for common query patterns
CREATE INDEX idx_profiles_user_role ON public.profiles (user_role);
CREATE INDEX idx_profiles_faculty ON public.profiles (faculty);
CREATE INDEX idx_profiles_has_paid ON public.profiles (has_paid);
CREATE INDEX idx_profiles_is_math_soc_member ON public.profiles (is_math_soc_member);
