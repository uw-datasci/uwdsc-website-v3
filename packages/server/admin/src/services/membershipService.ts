import { GetReceivingEmailResponseSuccess } from "resend";
import { MembershipRepository } from "../repositories/membershipRepository";
import { ApiError, MarkAsPaidData, MembershipStats } from "@uwdsc/common/types";
import { parseTransactionDate } from "../utils/monerisReceipt";
import { profileService } from "./profileService";

class MembershipService {
  private readonly repository: MembershipRepository;

  constructor() {
    this.repository = new MembershipRepository();
  }

  /**
   * Get membership statistics
   */
  async getMembershipStats(): Promise<MembershipStats> {
    try {
      return await this.repository.getMembershipStats();
    } catch (error) {
      throw new ApiError(`Failed to get membership stats: ${(error as Error).message}`, 500);
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
      throw new ApiError(`Failed to mark member as paid: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Process a membership payment email.
   * @param termStartDate ISO timestamp from the active term's `start_date`, or null if unset.
   */
  async processEmailReceipt(
    email: GetReceivingEmailResponseSuccess,
    termStartDate: string | null,
  ): Promise<void> {
    try {
      const body = email.text;
      const sender = email.from;

      if (!body) throw new ApiError("Email body is missing", 400);

      // RegEx Checks for email receipt
      const isFromMoneris = /From:\s*WUSA'S ONLINE SHOP\s*<receipt@moneris\.com>/i.test(body);

      // Use \b to ensure it ends exactly at 4.00, avoiding partial matches like 14.00
      const isCorrectTotal = /Total:\s*\$4\.00\b/i.test(body);

      const hasCorrectItem = /UW Data Science Club Membership/i.test(body);
      const isApproved = /Transaction Approved/i.test(body);

      // Extract the uwaterloo email from the receipt body
      const bodyEmailMatch = /([a-z0-9._%+-]+@uwaterloo\.ca)/i.exec(body);
      const receiptEmail = bodyEmailMatch?.[1]?.toLowerCase() ?? null;

      const dateMatch = /(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2})/.exec(body);
      const transactionDateText = dateMatch?.[1] ?? null;

      if (
        !isFromMoneris ||
        !isCorrectTotal ||
        !hasCorrectItem ||
        !isApproved ||
        !receiptEmail ||
        !transactionDateText
      ) {
        console.error("Invalid email receipt");
        throw new ApiError("Invalid email receipt", 400);
      }

      if (!sender.includes(receiptEmail)) {
        console.error("Sender email does not match receipt email");
        throw new ApiError("Sender email does not match receipt email", 400);
      }

      if (termStartDate === null) {
        console.error("Active term has no start date");
        throw new ApiError("Active term has no start date", 400);
      }

      const inboundAt = parseTransactionDate(transactionDateText);
      const termStartAt = new Date(termStartDate);

      if (Number.isNaN(termStartAt.getTime())) {
        console.error("Invalid term start timestamp");
        throw new ApiError("Invalid term start timestamp", 400);
      }

      if (inboundAt < termStartAt) {
        console.error("Transaction date is before the current term started");
        throw new ApiError("Transaction date is before the current term started", 400);
      }

      const profile = await profileService.getProfileByEmail(receiptEmail);

      if (!profile) throw new ApiError("No profile found for receipt email", 404);

      const markResult = await this.markMemberAsPaid(profile.id, {
        payment_method: "online",
        payment_location: "WUSA Online Shop",
        verifier: null,
      });

      if (!markResult.success) {
        console.error("Failed to mark member as paid");
        throw new ApiError(markResult.error ?? "Failed to mark member as paid", 400);
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        `Failed to process membership payment email: ${(error as Error).message}`,
        500,
      );
    }
  }
}

export const membershipService = new MembershipService();
