import type { SupabaseClient } from "@supabase/supabase-js";
import type { FileUploadOptions } from "@uwdsc/common/types";

export class FileRepository {
  protected readonly supabase: SupabaseClient;
  protected readonly bucketName: string;

  constructor(supabase: SupabaseClient, bucketName: string) {
    this.supabase = supabase;
    this.bucketName = bucketName;
  }

  /**
   * List all files in a folder within the bucket.
   */
  async listFiles(folder: string): Promise<string[]> {
    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .list(folder);

    if (error) {
      throw new Error(`Failed to list files: ${error.message}`);
    }

    // Filter out folder placeholders (they have null id)
    return (data ?? [])
      .filter((file) => file.id !== null)
      .map((file) => `${folder}/${file.name}`);
  }

  /**
   * Delete files at the given paths within the bucket.
   */
  async deleteFiles(paths: string[]): Promise<void> {
    if (paths.length === 0) return;

    const { error } = await this.supabase.storage.from(this.bucketName).remove(paths);

    if (error) {
      throw new Error(`Failed to delete files: ${error.message}`);
    }
  }

  /**
   * Upload a file to the bucket. Uses upsert so existing files at the same
   * path are replaced.
   */
  async uploadFile(options: FileUploadOptions): Promise<string> {
    const buffer = Buffer.from(await options.file.arrayBuffer());

    const { error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(options.objectKey, buffer, {
        contentType: options.contentType,
        upsert: true,
      });

    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    return options.objectKey;
  }

  /**
   * Generate a signed URL for a file in the private bucket.
   * @param path - The file path within the bucket
   * @param expiresIn - URL expiry in seconds (default: 1 hour)
   */
  async getSignedUrl(path: string, expiresIn: number = 3600): Promise<string | null> {
    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error(`Failed to create signed URL for ${path}:`, error.message);
      return null;
    }

    return data.signedUrl;
  }
}
