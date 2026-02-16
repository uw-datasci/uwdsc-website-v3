import { ProfileRepository } from "../repositories/profileRepository";
import {
  ApiError,
  MarkAsPaidData,
  Member,
  MembershipStats,
  UpdateMemberData,
} from "@uwdsc/common/types";
import { filterPartialUpdate } from "@uwdsc/common/utils";

const UPDATE_MEMBER_COLUMNS = [
  "first_name",
  "last_name",
  "wat_iam",
  "faculty",
  "term",
  "is_math_soc_member",
] as const;

class ProfileService {
  private readonly repository: ProfileRepository;

  constructor() {
    this.repository = new ProfileRepository();
  }

  /**
   * Get all user profiles
   */
  async getAllProfiles(): Promise<Member[]> {
    try {
      return await this.repository.getAllProfiles();
    } catch (error) {
      throw new ApiError(
        `Failed to get all profiles: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Get membership statistics
   */
  async getMembershipStats(): Promise<MembershipStats> {
    try {
      return await this.repository.getMembershipStats();
    } catch (error) {
      throw new ApiError(
        `Failed to get membership stats: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Mark a member as paid
   */
  async markMemberAsPaid(
    profileId: string,
    data: MarkAsPaidData,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.repository.markAsPaid(profileId, data);

      if (!result) {
        return {
          success: false,
          error: "Failed to create membership record",
        };
      }

      return { success: true };
    } catch (error) {
      throw new ApiError(
        `Failed to mark member as paid: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Update member information (partial update for PATCH)
   * Only updates fields present in data; omitted fields are left unchanged
   */
  async updateMember(
    profileId: string,
    data: UpdateMemberData,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { filteredData, columns } = filterPartialUpdate(
        data,
        UPDATE_MEMBER_COLUMNS,
      );

      if (columns.length === 0) return { success: true };

      const result = await this.repository.updateMemberById(
        profileId,
        filteredData,
        columns,
      );

      if (!result) {
        return {
          success: false,
          error: "Profile not found",
        };
      }

      return { success: true };
    } catch (error) {
      throw new ApiError(
        `Failed to update member: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Delete a member (admin only)
   */
  async deleteMember(
    profileId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.repository.deleteMemberById(profileId);

      if (!result) {
        return {
          success: false,
          error: "User not found",
        };
      }

      return { success: true };
    } catch (error) {
      throw new ApiError(
        `Failed to delete member: ${(error as Error).message}`,
        500,
      );
    }
  }
}

export const profileService = new ProfileService();
