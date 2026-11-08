import { z } from "zod";
import { RaftResponse } from "@uw-datasci/raft";
import { eventService, profileService } from "@uwdsc/admin";
import { ADMIN_ROLES } from "@uwdsc/common/constants";
import { createEventSchema } from "@uwdsc/common/schemas";
import { withInternalToken } from "@/guards/withInternalToken";

/**
 * Who asked for the draft. Discord accounts aren't linked to website profiles until nexus-bot's
 * B2, so for now the Discord user ID is required and logged, and `actor_profile_id` is optional.
 * When it's present, the profile must be exec or above. It becomes required with B2.
 */
const actorSchema = z.object({
  actor_discord_id: z
    .string({ error: "actor_discord_id is required" })
    .regex(/^\d{17,20}$/, "actor_discord_id must be a Discord user ID"),
  actor_profile_id: z.uuid({ error: "actor_profile_id must be a profile ID" }).optional(),
});

/**
 * POST /api/internal/events/drafts
 * Create an unpublished event for nexus-bot's `/event-create`. It shows as a Draft in admin and
 * nowhere public until someone publishes it there.
 *
 * Auth: `Authorization: Bearer $NEXUS_BOT_INTERNAL_TOKEN` (see withInternalToken).
 * Body: the `createEventSchema` fields (name, description, location, start_time, end_time,
 * category, resources, image_url) plus `actor_discord_id` and optionally `actor_profile_id`.
 * `is_published` is ignored: drafts are always unpublished.
 *
 * Responses:
 * - 200 `{ event }` with the created event (id, name, location, start_time, end_time, ...)
 * - 400 `{ error, message }`: `message` is the first validation problem, shown on the bot's card
 * - 401 bad token, 403 the actor profile isn't exec or above
 */
export const POST = withInternalToken(async (request) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return RaftResponse.badRequest("Request body must be JSON", "Validation error");
  }

  const actor = actorSchema.safeParse(body);
  if (!actor.success) {
    return RaftResponse.badRequest(
      actor.error.issues[0]?.message ?? "Invalid actor",
      "Validation error"
    );
  }

  const fields = typeof body === "object" && body !== null ? body : {};
  const validation = createEventSchema.safeParse({ ...fields, is_published: false });
  if (!validation.success) {
    return RaftResponse.badRequest(
      validation.error.issues[0]?.message ?? "Invalid event details",
      "Validation error"
    );
  }

  const { actor_discord_id, actor_profile_id } = actor.data;
  if (actor_profile_id) {
    const role = await profileService.getUserRole(actor_profile_id);
    if (!role || !ADMIN_ROLES.has(role)) {
      return RaftResponse.forbidden("Only execs can create event drafts", "Forbidden");
    }
  }

  const result = await eventService.createEvent({ ...validation.data, is_published: false });
  if (!result.success || !result.event) {
    return RaftResponse.badRequest(
      result.error ?? "Failed to create event",
      "Failed to create event"
    );
  }

  console.info(
    JSON.stringify({
      msg: "internal-api: event draft created",
      event_id: result.event.id,
      actor_discord_id,
      actor_profile_id: actor_profile_id ?? null,
    })
  );

  return RaftResponse.ok({ event: result.event });
});
