import type { SupabaseClient } from "@supabase/supabase-js";

export interface FileUploadOptions {
  file: File;
  userId: string;
  objectKey: string;
  contentType: string;
}

export class FileRepository {
  protected readonly client: SupabaseClient;
  protected readonly bucketName: string;

  constructor(client: SupabaseClient, bucketName: string) {
    this.client = client;
    this.bucketName = bucketName;
  }

  /**
   * Upload a file to Supabase storage
   */
  async uploadFile(
    options: FileUploadOptions
  ): Promise<{ data: { path: string } | null; error: Error | null }> {
    const { file, objectKey, contentType } = options;

    const { data, error } = await this.client.storage
      .from(this.bucketName)
      .upload(objectKey, file, {
        cacheControl: "3600",
        upsert: true,
        contentType,
      });

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  }

  /**
   * Get public URL for a file
   */
  async getFileUrl(objectKey: string) {
    const { data } = this.client.storage
      .from(this.bucketName)
      .getPublicUrl(objectKey);

    return data.publicUrl;
  }

  /**
   * Delete a file
   */
  async deleteFile(objectKey: string): Promise<{ error: Error | null }> {
    const { error } = await this.client.storage
      .from(this.bucketName)
      .remove([objectKey]);

    return { error };
  }

  /**
   * List all files for a user
   */
  async listUserFiles(userId: string): Promise<{
    data: any[] | null;
    error: Error | null;
  }> {
    const { data, error } = await this.client.storage
      .from(this.bucketName)
      .list(userId);

    return { data, error };
  }
}
