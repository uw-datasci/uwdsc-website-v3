import type { SupabaseClient } from "@supabase/supabase-js";

export class FileRepository {
  protected readonly supabase: SupabaseClient;
  protected readonly bucketName: string;

  constructor(supabase: SupabaseClient, bucketName: string) {
    this.supabase = supabase;
    this.bucketName = bucketName;
  }
}
