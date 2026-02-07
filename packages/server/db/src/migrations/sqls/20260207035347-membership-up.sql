CREATE TABLE public.memberships (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  payment_method public.payment_method_enum,
  payment_location VARCHAR(255),
  verifier_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
