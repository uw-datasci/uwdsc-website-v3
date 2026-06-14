import type { SupabaseClient } from "@supabase/supabase-js";
import { isProfileComplete } from "@uwdsc/common/utils";

/**
 * Loads onboarding profile fields via Supabase and applies the same completion
 * rules as {@link isProfileComplete} from `@uwdsc/common/utils` (web middleware + admin proxy).
 */
export async function isProfileCompleteForMiddleware(
  supabase: SupabaseClient,
  userId: string | undefined,
): Promise<boolean> {
  if (!userId) return false;

  const { data: row, error } = await supabase
    .from("profiles")
    .select("first_name, last_name, wat_iam, faculty, term, heard_from_where")
    .eq("id", userId)
    .maybeSingle();

  if (error || !row) return false;
  return isProfileComplete(row);
}
