import { ApiResponse } from "@uwdsc/common/utils";
import { ApiError } from "@uwdsc/common/types";
import { passportService } from "@uwdsc/core";
import { tryGetCurrentUser } from "@/lib/api/utils";

export async function POST(request: Request): Promise<Response> {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (!user) return isUnauthorized;

    const { membership_id, event_id, token } = await request.json();
    if (!membership_id || !event_id || !token) {
      return ApiResponse.badRequest(
        "membership_id, event_id and token are required",
      );
    }

    const result = await passportService.scanQrCode(user.id, {
      membershipId: membership_id,
      eventId: event_id,
      token,
    });
    return ApiResponse.ok(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return ApiResponse.json(
        { error: error.message, message: error.message },
        error.statusCode,
      );
    }
    console.error("Error processing passport scan:", error);
    return ApiResponse.serverError(error, "Failed to process scan");
  }
}
