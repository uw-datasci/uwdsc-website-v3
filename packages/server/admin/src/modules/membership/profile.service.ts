import { createSupabaseServiceRoleClient } from "@uwdsc/db/supabase";
import { ProfileRepository } from "./profile.repository";
import { ApiError, Member, UpdateMemberData, Profile, UserRole } from "@uwdsc/common/types";
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
  async getAllProfiles(options?: {
    paidOnly?: boolean;
    searchQuery?: string;
  }): Promise<Member[]> {
    try {
      return await this.repository.getAllProfiles(options);
    } catch (error) {
      throw new ApiError(`Failed to get all profiles: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Emails for users matching any of the given roles (distinct).
   */
  async getEmailsByRoles(roles: UserRole[]): Promise<string[]> {
    try {
      return await this.repository.getEmailsByRoles(roles);
    } catch (error) {
      throw new ApiError(`Failed to get emails by roles: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Get profile by login email (case-insensitive).
   */
  async getProfileByEmail(email: string): Promise<Profile | null> {
    try {
      return await this.repository.getProfileByEmail(email);
    } catch (error) {
      throw new ApiError(`Failed to get profile by email: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Get the profile by profile ID
   */
  async getProfileById(profileId: string): Promise<Profile | null> {
    try {
      return await this.repository.getProfileById(profileId);
    } catch (error) {
      throw new ApiError(`Failed to get profile by ID: ${(error as Error).message}`, 500);
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
      const { filteredData, columns } = filterPartialUpdate(data, UPDATE_MEMBER_COLUMNS);

      if (columns.length === 0) return { success: true };

      const result = await this.repository.updateMemberById(profileId, filteredData, columns);

      if (!result) {
        return {
          success: false,
          error: "Profile not found",
        };
      }

      return { success: true };
    } catch (error) {
      throw new ApiError(`Failed to update member: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Invite a new member by email (Supabase admin API).
   * Creates `auth.users`; trigger adds profiles + user_roles. Optionally updates profile fields.
   */
  async inviteMemberByEmail(params: {
    email: string;
    profile?: UpdateMemberData;
  }): Promise<{ success: true; userId: string } | { success: false; error: string }> {
    const email = params.email.trim().toLowerCase();

    const existing = await this.repository.getProfileByEmail(email);
    if (existing) {
      return {
        success: false,
        error: "A member with this email already exists",
      };
    }

    const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/complete-profile`;

    try {
      const supabase = createSupabaseServiceRoleClient();
      const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
        redirectTo,
      });

      if (error) return { success: false, error: error.message };

      const user = data.user;
      if (!user?.id) return { success: false, error: "Invite did not return a user id" };

      const profilePayload = params.profile;
      if (profilePayload) {
        const updateResult = await this.updateMember(user.id, profilePayload);
        if (!updateResult.success) {
          return {
            success: false,
            error: updateResult.error ?? "Failed to update profile after invite",
          };
        }
      }

      return { success: true, userId: user.id };
    } catch (error) {
      throw new ApiError(`Failed to invite member: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Delete a member (admin only)
   */
  async deleteMember(profileId: string): Promise<{ success: boolean; error?: string }> {
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
      throw new ApiError(`Failed to delete member: ${(error as Error).message}`, 500);
    }
  }
}

export const profileService = new ProfileService();
