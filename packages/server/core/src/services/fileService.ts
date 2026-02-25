import { FileRepository } from "../repositories/fileRepository";
import type { SupabaseClient } from "@supabase/supabase-js";
import { FileValidationConfig } from "@uwdsc/common/types";

export class FileService {
  protected readonly repository: FileRepository;
  protected readonly validationConfig: FileValidationConfig;

  constructor(
    supabaseClient: SupabaseClient,
    bucketName: string,
    validationConfig: FileValidationConfig,
  ) {
    this.repository = new FileRepository(supabaseClient, bucketName);
    this.validationConfig = validationConfig;
  }
}
