import { SupabaseClient } from "@supabase/supabase-js";

// Helper function to check if profile is complete
export async function isProfileComplete(
  supabase: SupabaseClient,
  userId: string | undefined,
): Promise<boolean> {
  if (!userId) return false;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("first_name, last_name, faculty, term, heard_from_where")
    .eq("id", userId)
    .maybeSingle();



  return !!(
    profile &&
    !error &&
    profile.first_name &&
    profile.last_name &&
    profile.faculty &&
    profile.term &&
    profile.heard_from_where
  );
}
