import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { UploadError, UploadResult } from "@uwdsc/common/types";
import { FileService } from "./file.service";
import {
  MEMBERSHIP_PROOF_VALIDATION_CONFIG,
  getProofExtensionFromMime,
} from "../../utils/membershipProof";

export interface ProofUploadData {
  file: File;
  userId: string;
  termCode: string;
}

/**
 * Proof-of-payment uploads for the membership review queue.
 *
 * Unlike `ResumeService`, this deliberately does **not** clear the user's
 * folder: a rejected proof is kept so a reviewer can see what was submitted
 * last time. Every upload gets a fresh UUID key and never overwrites.
 *
 * Object key: `{profileId}/{termCode}/{uuid}.{ext}`. `profileId` leads so the
 * Storage RLS predicate is a plain `(storage.foldername(name))[1] = auth.uid()`.
 */
export class MembershipProofService extends FileService {
  constructor(supabaseClient: SupabaseClient) {
    super(supabaseClient, "membership-proofs", MEMBERSHIP_PROOF_VALIDATION_CONFIG);
  }

  async uploadProof(data: ProofUploadData): Promise<UploadResult | UploadError> {
    const validationError = this.validateFile(data.file);
    if (validationError) return validationError;

    const extension = getProofExtensionFromMime(data.file.type);
    const objectKey = `${data.userId}/${data.termCode}/${randomUUID()}.${extension}`;

    // upsert: false - keys are UUIDs, so a collision means something is wrong,
    // and it keeps the write inside an INSERT-only Storage policy.
    return this.upload({ file: data.file, userId: data.userId }, objectKey, {
      upsert: false,
    });
  }

  /**
   * Signed URL for a stored proof. Short-lived: these are rendered straight
   * into the review page and shouldn't outlive the session looking at them.
   */
  async getProofUrl(objectKey: string, expiresIn = 300): Promise<string | null> {
    try {
      return await this.repository.getSignedUrl(objectKey, expiresIn);
    } catch {
      return null;
    }
  }
}
