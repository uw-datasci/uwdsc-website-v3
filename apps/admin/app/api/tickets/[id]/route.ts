import { ApiResponse } from "@uwdsc/common/utils";
import { ticketService } from "@uwdsc/admin";
import { withAdmin } from "@/guards/withAdmin";
import type { WithAuthContext } from "@/guards/withAuth";

interface Params extends WithAuthContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/tickets/[id]
 * Returns a single support ticket.
 */
export const GET = withAdmin<Params>(async (_request, { params }) => {
  try {
    const { id } = await params;
    const ticket = await ticketService.getTicketById(id);

    if (!ticket) return ApiResponse.notFound("Ticket not found");

    return ApiResponse.ok({ ticket });
  } catch (error: unknown) {
    console.error("Error fetching ticket:", error);
    return ApiResponse.serverError(error, "Failed to fetch ticket");
  }
});
