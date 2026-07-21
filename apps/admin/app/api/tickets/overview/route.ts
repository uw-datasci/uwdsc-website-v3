import { ApiResponse } from "@uwdsc/common/utils";
import { ticketService } from "@uwdsc/admin";
import { withAdmin } from "@/guards/withAdmin";
import { parseTicketFilters } from "@/lib/tickets/parseFilters";

/**
 * GET /api/tickets/overview
 * Returns stats and chart datasets for the support ticket dashboard.
 */
export const GET = withAdmin(async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const filters = parseTicketFilters(searchParams);
    const overview = await ticketService.getOverview(filters);
    return ApiResponse.ok(overview);
  } catch (error: unknown) {
    console.error("Error fetching ticket overview:", error);
    return ApiResponse.serverError(error, "Failed to fetch ticket overview");
  }
});
