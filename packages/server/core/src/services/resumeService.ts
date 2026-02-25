import type { SupabaseClient } from "@supabase/supabase-js";
import { FileService } from "./fileService";
import { RESUME_VALIDATION_CONFIG } from "../utils/resume";

export class ResumeService extends FileService {
  constructor(supabaseClient: SupabaseClient) {
    super(supabaseClient, "resumes", RESUME_VALIDATION_CONFIG);
  }
}
