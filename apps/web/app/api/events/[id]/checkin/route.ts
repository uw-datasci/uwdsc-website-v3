import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute, type RouteContext } from "@uwdsc/core/http";
import { eventService, membershipService } from "@uwdsc/core";
import { tryGetCurrentUser } from "@/lib/api/utils";

export const GET = withRaftRoute(async (_request, { params }: RouteContext<{ id: string }>) => {
  const { id } = await params;

  const { user, isUnauthorized } = await tryGetCurrentUser();
  if (!user) return isUnauthorized;

  const { checkedIn, attendanceId } = await eventService.getAttendanceForUser(id, user.id);
  return RaftResponse.ok({ checkedIn, attendanceId });
});

export const POST = withRaftRoute(
  async (_request, { params }: RouteContext<{ id: string }>) => {
    const { id } = await params;

    // 1. Check auth
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (!user) return isUnauthorized;

    // 2. Check if user has membership
    const { has_membership } = await membershipService.getMembershipStatus(user.id);
    if (!has_membership) {
      return RaftResponse.badRequest("You must have an active membership to check in.");
    }

    // 3. Check if event is active (valid time window)
    const event = await eventService.getEventById(id);
    if (!event) {
      return RaftResponse.notFound("Event not found");
    }

    const now = new Date();
    const bufferedStart = new Date(event.buffered_start_time);
    const bufferedEnd = new Date(event.buffered_end_time);

    if (now < bufferedStart || now > bufferedEnd) {
      return RaftResponse.badRequest("Check-in is not currently open for this event.");
    }

    // 4. Check in the user
    await eventService.checkInUser(id, user.id);

    return RaftResponse.ok({
      message: "Successfully checked in",
      success: true,
    });
  }
);
