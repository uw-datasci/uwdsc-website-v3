import { after } from "next/server";
import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { eventBotService, type DiscordInteraction } from "@uwdsc/admin";

/**
 * Background work (thread fetch + LLM extraction) runs in `after()`, which lives inside this
 * function's lifetime on Vercel. Without Fluid Compute the Hobby default is 10s, which would
 * cut the LLM call off, so pin a ceiling that covers the 40s LLM timeout plus the Discord and DB calls.
 */
export const maxDuration = 60;

/**
 * POST /api/discord/interactions
 * Discord HTTP interactions endpoint for the /event-create bot. Not behind withAuth: Discord
 * isn't a logged-in user, so every request is authenticated by its Ed25519 signature instead.
 *
 * Discord needs a response within 3s, so slow work is handed to `after()`; the service wraps
 * that work in its own Raft reporting since withRaftRoute can't catch it.
 */
export const POST = withRaftRoute(async (request) => {
  const rawBody = await request.text();

  // Discord probes the endpoint with invalid signatures and requires a 401 for them.
  if (!eventBotService.verifyRequest(rawBody, request.headers)) {
    return RaftResponse.unauthorized("Invalid request signature");
  }

  const interaction = JSON.parse(rawBody) as DiscordInteraction;
  const { response, background } = await eventBotService.handleInteraction(interaction);
  if (background) after(background);

  return RaftResponse.ok(response);
});
