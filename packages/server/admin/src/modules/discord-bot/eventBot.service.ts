import { DateTime } from "luxon";
import { RaftClient } from "@uw-datasci/raft";
import { createEventSchema } from "@uwdsc/common/schemas";
import type { EventCategory } from "@uwdsc/common/types";
import { eventService } from "../events/events.service";
import { EventDraftRepository } from "./eventDraft.repository";
import { extractEventFromThread, ExtractionError } from "./extract";
import {
  DiscordApiError,
  editChannelMessage,
  editOriginalResponse,
  getChannelMessage,
  getChannelMessages,
  requireEnv,
  verifyDiscordSignature,
} from "./discordApi";
import {
  EVENT_TIMEZONE,
  MODAL_TIME_FORMAT,
  buildCancelledCard,
  buildCreatedCard,
  buildFailureCard,
  buildPreviewCard,
  buildReviewModal,
  buildValidationError,
  ephemeral,
  formatTorontoTime,
  parseDraftCustomId,
  updateMessage,
} from "./components";
import {
  InteractionResponseType,
  InteractionType,
  THREAD_CHANNEL_TYPES,
  type DiscordEventDraft,
  type DiscordInteraction,
  type DiscordMessage,
  type DiscordSubmittedComponent,
  type DraftSubmission,
  type InteractionHandlerResult,
} from "../../types/discord";

const COMMAND_NAME = "event-create";
const CATEGORIES: ReadonlySet<string> = new Set<EventCategory>([
  "workshop",
  "social",
  "academic",
]);

type DraftLookup = { draft: DiscordEventDraft } | { rejection: string };

/** Collect `custom_id → value` from a modal submit (action rows or label components). */
function readModalValues(components: DiscordSubmittedComponent[] = []): Record<string, string> {
  const values: Record<string, string> = {};
  const visit = (c: DiscordSubmittedComponent) => {
    if (c.custom_id && typeof c.value === "string") values[c.custom_id] = c.value;
    c.components?.forEach(visit);
    if (c.component) visit(c.component);
  };
  components.forEach(visit);
  return values;
}

/**
 * Strictly parse "YYYY-MM-DD HH:mm" as America/Toronto wall time. The round-trip check
 * rejects anything luxon would silently normalize, including times that don't exist because
 * of the spring-forward DST gap.
 */
function parseTorontoTime(raw: string, label: string): { iso: string } | { error: string } {
  const trimmed = raw.trim();
  const dt = DateTime.fromFormat(trimmed, MODAL_TIME_FORMAT, { zone: EVENT_TIMEZONE });
  if (!dt.isValid) {
    return {
      error: `${label} time "${trimmed}" isn't a valid date in YYYY-MM-DD HH:mm format (e.g. 2026-10-03 18:00).`,
    };
  }
  if (dt.toFormat(MODAL_TIME_FORMAT) !== trimmed) {
    return {
      error: `${label} time "${trimmed}" doesn't exist in Toronto (daylight saving time change). Pick a different time.`,
    };
  }
  return { iso: dt.toUTC().toISO() ?? "" };
}

/** Modal prefill: the last submitted values win over the LLM's extraction. */
function prefillValues(draft: DiscordEventDraft): Partial<DraftSubmission> {
  return {
    name: draft.submitted_name ?? draft.name ?? undefined,
    location: draft.submitted_location ?? draft.location ?? undefined,
    start: draft.submitted_start ?? formatTorontoTime(draft.start_time) ?? undefined,
    end: draft.submitted_end ?? formatTorontoTime(draft.end_time) ?? undefined,
    description: draft.submitted_description ?? draft.description ?? undefined,
  };
}

/** A short, safe explanation for the failure card (details go to Raft, not Discord). */
function describeFailure(error: unknown): string {
  if (error instanceof ExtractionError) return error.message;
  if (error instanceof DiscordApiError && (error.status === 403 || error.status === 404)) {
    return "I can't read this thread. Make sure I have View Channel and Read Message History here (and, for a private thread, that I've been added to it).";
  }
  return "Something went wrong while reading the thread. The error has been logged for the dev team.";
}

class EventBotService {
  private readonly drafts: EventDraftRepository;

  constructor() {
    this.drafts = new EventDraftRepository();
  }

  /** Ed25519 check of Discord's signature headers against the exact raw body. */
  verifyRequest(rawBody: string, headers: Headers): boolean {
    return verifyDiscordSignature(
      rawBody,
      headers.get("x-signature-ed25519"),
      headers.get("x-signature-timestamp")
    );
  }

  /**
   * Route one (already signature-verified) interaction. Returns the immediate
   * response plus optional slow work for `after()`.
   */
  async handleInteraction(interaction: DiscordInteraction): Promise<InteractionHandlerResult> {
    // Discord's endpoint health check (sent when the URL is saved, and periodically).
    if (interaction.type === InteractionType.Ping) {
      return { response: { type: InteractionResponseType.Pong } };
    }

    if (interaction.guild_id !== requireEnv("DISCORD_GUILD_ID")) {
      return { response: ephemeral("This bot only works in the UWDSC Discord server.") };
    }

    switch (interaction.type) {
      case InteractionType.ApplicationCommand:
        return this.handleCommand(interaction);
      case InteractionType.MessageComponent:
      case InteractionType.ModalSubmit:
        return this.handleDraftInteraction(interaction);
      default:
        return { response: ephemeral("Unsupported interaction.") };
    }
  }

  // ─── /event-create ─────────────────────────────────────────────────────────

  private handleCommand(interaction: DiscordInteraction): InteractionHandlerResult {
    if (interaction.data?.name !== COMMAND_NAME) {
      return { response: ephemeral("Unknown command.") };
    }

    const userId = interaction.member?.user?.id;
    const roles = interaction.member?.roles ?? [];
    if (!userId || !roles.includes(requireEnv("DISCORD_EXEC_ROLE_ID"))) {
      return { response: ephemeral("Only execs can create events from Discord.") };
    }

    const channel = interaction.channel;
    if (!channel || !THREAD_CHANNEL_TYPES.has(channel.type)) {
      return {
        response: ephemeral(
          "Run `/event-create` inside the thread where the event is being planned."
        ),
      };
    }

    return {
      // Public "Bot is thinking..." placeholder; edited into the preview card in the background.
      response: { type: InteractionResponseType.DeferredChannelMessageWithSource },
      background: () =>
        this.runInBackground(
          "extract",
          { guildId: interaction.guild_id, channelId: channel.id },
          () =>
            this.extractAndPostCard(interaction, userId, channel.id, channel.parent_id ?? null),
          async (error) => {
            await editOriginalResponse(
              interaction.token,
              buildFailureCard(describeFailure(error))
            );
          }
        ),
    };
  }

  private async extractAndPostCard(
    interaction: DiscordInteraction,
    userId: string,
    threadId: string,
    parentId: string | null
  ): Promise<void> {
    const [messages, starter] = await Promise.all([
      getChannelMessages(threadId, 100),
      this.getStarterMessage(threadId, parentId),
    ]);
    if (starter && !messages.some((m) => m.id === starter.id)) messages.push(starter);

    const extracted = await extractEventFromThread(messages, {
      starterId: threadId,
      // A bot user's id is its application id: skip the bot's own messages.
      excludeAuthorId: interaction.application_id,
    });

    const draft = await this.drafts.create({
      ...extracted,
      initiator_discord_id: userId,
      guild_id: interaction.guild_id ?? "",
      channel_id: threadId,
    });

    const card = await editOriginalResponse(interaction.token, buildPreviewCard(draft));
    await this.drafts.setCardMessage(draft.id, card.channel_id, card.id);
  }

  /**
   * The message a thread was started from has the thread's id. For forum posts it lives in
   * the thread itself; for threads started from a channel message it lives in the parent.
   */
  private async getStarterMessage(
    threadId: string,
    parentId: string | null
  ): Promise<DiscordMessage | null> {
    const inThread = await getChannelMessage(threadId, threadId);
    if (inThread || !parentId) return inThread;
    return getChannelMessage(parentId, threadId);
  }

  // ─── Buttons, select, modal ────────────────────────────────────────────────

  private async handleDraftInteraction(
    interaction: DiscordInteraction
  ): Promise<InteractionHandlerResult> {
    const parsed = parseDraftCustomId(interaction.data?.custom_id);
    const userId = interaction.member?.user?.id ?? interaction.user?.id;
    if (!parsed || !userId) return { response: ephemeral("Unknown action.") };

    const lookup = await this.loadActionableDraft(parsed.draftId, userId);
    if ("rejection" in lookup) return { response: ephemeral(lookup.rejection) };
    const { draft } = lookup;

    switch (parsed.action) {
      case "category":
        return this.handleCategory(interaction, draft);
      case "review":
      case "fix":
        // Instant: no LLM call, just the stored values.
        return { response: buildReviewModal(draft.id, prefillValues(draft)) };
      case "cancel": {
        const cancelled = await this.drafts.cancel(draft.id);
        if (!cancelled) return { response: ephemeral("This draft is no longer active.") };
        return { response: updateMessage(buildCancelledCard(userId)) };
      }
      case "modal":
        if (interaction.type !== InteractionType.ModalSubmit) {
          return { response: ephemeral("Unknown action.") };
        }
        return this.handleModalSubmit(interaction, draft, userId);
    }
  }

  /** Initiator-only, pending, unexpired - or an ephemeral explanation of why not. */
  private async loadActionableDraft(draftId: string, userId: string): Promise<DraftLookup> {
    const draft = await this.drafts.getById(draftId);
    if (!draft) return { rejection: "This draft no longer exists." };
    if (draft.initiator_discord_id !== userId) {
      return { rejection: `Only <@${draft.initiator_discord_id}> can edit this event.` };
    }
    if (draft.status !== "pending") return { rejection: "This draft is no longer active." };
    if (draft.expires_at.getTime() <= Date.now()) {
      return { rejection: `This draft expired, run \`/${COMMAND_NAME}\` again.` };
    }
    return { draft };
  }

  private async handleCategory(
    interaction: DiscordInteraction,
    draft: DiscordEventDraft
  ): Promise<InteractionHandlerResult> {
    const value = interaction.data?.values?.[0];
    if (!value || !CATEGORIES.has(value)) return { response: ephemeral("Unknown category.") };

    const updated = await this.drafts.updateCategory(draft.id, value as EventCategory);
    if (!updated) return { response: ephemeral("This draft is no longer active.") };
    return { response: updateMessage(buildPreviewCard(updated)) };
  }

  private async handleModalSubmit(
    interaction: DiscordInteraction,
    draft: DiscordEventDraft,
    userId: string
  ): Promise<InteractionHandlerResult> {
    const values = readModalValues(interaction.data?.components);
    const submission: DraftSubmission = {
      name: values.name ?? "",
      location: values.location ?? "",
      start: values.start ?? "",
      end: values.end ?? "",
      description: values.description ?? "",
    };
    // Stored first, so [Fix] reopens the modal with exactly what was typed.
    await this.drafts.saveSubmission(draft.id, submission);

    const invalid = (message: string) => ({
      response: buildValidationError(draft.id, message),
    });

    if (!draft.category)
      return invalid("Pick a category from the menu on the event card first.");

    const start = parseTorontoTime(submission.start, "Start");
    if ("error" in start) return invalid(start.error);
    const end = parseTorontoTime(submission.end, "End");
    if ("error" in end) return invalid(end.error);

    // Same rules as the admin form (shared schema in @uwdsc/common/schemas).
    const validation = createEventSchema.safeParse({
      name: submission.name,
      location: submission.location,
      description: submission.description,
      start_time: start.iso,
      end_time: end.iso,
      category: draft.category,
      image_url: null,
      resources: [],
      is_published: false,
    });
    if (!validation.success) {
      return invalid(validation.error.issues[0]?.message ?? "Invalid event details.");
    }

    // Atomic pending → created: a double submit loses here and can't create a second event.
    const claimed = await this.drafts.claimForCreation(draft.id);
    if (!claimed) {
      return {
        response: ephemeral("This draft was already submitted, cancelled, or has expired."),
      };
    }

    let result: Awaited<ReturnType<typeof eventService.createEvent>>;
    try {
      result = await eventService.createEvent(validation.data);
    } catch (error) {
      await this.drafts.releaseClaim(draft.id);
      throw error;
    }
    if (!result.success || !result.event) {
      await this.drafts.releaseClaim(draft.id);
      return {
        response: ephemeral(`Couldn't create the event: ${result.error ?? "unknown error"}.`),
      };
    }
    await this.drafts.setCreatedEvent(draft.id, result.event.id);

    const createdCard = buildCreatedCard(result.event, userId);

    // Submitted from the card's own [Review & confirm]: update the card in place.
    if (interaction.message?.id && interaction.message.id === draft.message_id) {
      return { response: updateMessage(createdCard) };
    }

    // Submitted via [Fix] on an ephemeral error: close that out, and edit the public card with
    // the bot token (the original interaction token may be past its 15-minute lifetime).
    const { channel_id: channelId, message_id: messageId } = draft;
    return {
      response: updateMessage({
        content: "✅ Event draft created. The card in the thread has been updated.",
        embeds: [],
        components: [],
      }),
      background: messageId
        ? () =>
            this.runInBackground("update-card", { draftId: draft.id }, async () => {
              await editChannelMessage(channelId, messageId, createdCard);
            })
        : undefined,
    };
  }

  // ─── Background work ───────────────────────────────────────────────────────

  /**
   * Runs inside `after()`, where withRaftRoute can no longer catch anything: report failures
   * to Raft ourselves and, where possible, show the failure on the card.
   */
  private async runInBackground(
    step: string,
    context: Record<string, unknown>,
    work: () => Promise<void>,
    onFailure?: (error: unknown) => Promise<void>
  ): Promise<void> {
    try {
      await work();
    } catch (error) {
      console.error(`[EventBot] ${step} failed:`, error);
      await RaftClient.getInstance().reportError(
        error instanceof Error ? error : new Error(String(error)),
        { route: "discord:event-bot", step, ...context },
        error instanceof ExtractionError ? "warning" : "error"
      );
      if (!onFailure) return;
      try {
        await onFailure(error);
      } catch (followUpError) {
        console.error(`[EventBot] Failed to show ${step} failure on the card:`, followUpError);
      }
    }
  }
}

export const eventBotService = new EventBotService();
