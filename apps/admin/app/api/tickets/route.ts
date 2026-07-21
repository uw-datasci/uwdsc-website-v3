import { ApiResponse } from "@uwdsc/common/utils";
import { ticketService } from "@uwdsc/admin";
import { withAdmin } from "@/guards/withAdmin";
import { parseTicketFilters } from "@/lib/tickets/parseFilters";

/**
 * GET /api/tickets
 * Returns a paginated, filterable list of support tickets (contact form + email).
 */
export const GET = withAdmin(async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const filters = parseTicketFilters(searchParams);
    const result = await ticketService.getTickets(filters);
    return ApiResponse.ok(result);
  } catch (error: unknown) {
    console.error("Error fetching tickets:", error);
    return ApiResponse.serverError(error, "Failed to fetch tickets");
  }
});
