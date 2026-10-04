import { DateTime } from "luxon";
import type { Event, EventCategory } from "@uwdsc/common/types";
import {
  ButtonStyle,
  ComponentType,
  EPHEMERAL_FLAG,
  InteractionResponseType,
  TextInputStyle,
  type DiscordActionRow,
  type DiscordEventDraft,
  type DiscordInteractionResponse,
  type DiscordMessagePayload,
  type DraftSubmission,
} from "../../types/discord";

export const EVENT_TIMEZONE = "America/Toronto";
/** Format execs type into (and see in) the review modal. */
export const MODAL_TIME_FORMAT = "yyyy-MM-dd HH:mm";
export const ADMIN_EVENTS_URL = "https://admin.uwdatascience.ca/events";

const NOT_FOUND = "⚠️ Not found";
const COLORS = { draft: 0x5865f2, created: 0x57f287, cancelled: 0x99aab5, failed: 0xed4245 };
const CATEGORY_LABELS: Record<EventCategory, string> = {
  workshop: "Workshop",
  social: "Social",
  academic: "Academic",
};

/** Never ping anyone: `<@id>` still renders as a mention, it just doesn't notify. */
const NO_PINGS: DiscordMessagePayload["allowed_mentions"] = { parse: [] };

// ─── custom_id routing ───────────────────────────────────────────────────────

export type DraftAction = "category" | "review" | "cancel" | "fix" | "modal";
const CUSTOM_ID_PREFIX = "evt";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DRAFT_ACTIONS: ReadonlySet<string> = new Set<DraftAction>([
  "category",
  "review",
  "cancel",
  "fix",
  "modal",
]);

export function draftCustomId(action: DraftAction, draftId: string): string {
  return `${CUSTOM_ID_PREFIX}:${action}:${draftId}`;
}

export function parseDraftCustomId(
  customId: string | undefined
): { action: DraftAction; draftId: string } | null {
  const [prefix, action, draftId] = (customId ?? "").split(":");
  if (
    prefix !== CUSTOM_ID_PREFIX ||
    !action ||
    !DRAFT_ACTIONS.has(action) ||
    !draftId ||
    !UUID_RE.test(draftId)
  ) {
    return null;
  }
  return { action: action as DraftAction, draftId };
}

// ─── Formatting helpers ──────────────────────────────────────────────────────

/** A stored instant rendered as "YYYY-MM-DD HH:mm" in America/Toronto, or null. */
export function formatTorontoTime(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  const dt =
    value instanceof Date
      ? DateTime.fromJSDate(value)
      : DateTime.fromISO(value, { zone: "utc" });
  return dt.isValid ? dt.setZone(EVENT_TIMEZONE).toFormat(MODAL_TIME_FORMAT) : null;
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function orNotFound(value: string | null | undefined, max = 1024): string {
  const trimmed = value?.trim();
  return trimmed ? truncate(trimmed, max) : NOT_FOUND;
}

function unix(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

// ─── Cards (public messages) ─────────────────────────────────────────────────

/** The public preview card, shown while a draft is pending. */
export function buildPreviewCard(draft: DiscordEventDraft): DiscordMessagePayload {
  const categoryOptions = (Object.keys(CATEGORY_LABELS) as EventCategory[]).map((value) => ({
    label: CATEGORY_LABELS[value],
    value,
    default: value === draft.category,
  }));

  const components: DiscordActionRow[] = [
    {
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.StringSelect,
          custom_id: draftCustomId("category", draft.id),
          placeholder: "Pick a category",
          options: categoryOptions,
        },
      ],
    },
    {
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          label: "Review & confirm",
          custom_id: draftCustomId("review", draft.id),
          // The modal has no room for category (5 inputs max), so it must be picked first.
          disabled: !draft.category,
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Danger,
          label: "Cancel",
          custom_id: draftCustomId("cancel", draft.id),
        },
      ],
    },
  ];

  return {
    content:
      `📅 **Event draft** from <@${draft.initiator_discord_id}>, extracted from this thread. ` +
      `Check the details, pick a category, then **Review & confirm**. ` +
      `Expires <t:${unix(draft.expires_at)}:R>.`,
    embeds: [
      {
        title: orNotFound(draft.name, 256),
        description: orNotFound(draft.description, 4000),
        color: COLORS.draft,
        fields: [
          { name: "Location", value: orNotFound(draft.location) },
          {
            name: "Start (Toronto)",
            value: orNotFound(formatTorontoTime(draft.start_time)),
            inline: true,
          },
          {
            name: "End (Toronto)",
            value: orNotFound(formatTorontoTime(draft.end_time)),
            inline: true,
          },
          {
            name: "Category",
            value: draft.category
              ? CATEGORY_LABELS[draft.category]
              : `${NOT_FOUND}: pick one from the menu below`,
          },
        ],
        footer: { text: "Only the person who ran /event-create can use these controls." },
      },
    ],
    components,
    allowed_mentions: NO_PINGS,
  };
}

/** Final state after the event is created: values, admin link, no controls. */
export function buildCreatedCard(event: Event, userId: string): DiscordMessagePayload {
  return {
    content: `✅ Draft created by <@${userId}>. It's **unpublished**: publish it from the admin Events page when it's ready.`,
    embeds: [
      {
        title: truncate(event.name, 256),
        url: ADMIN_EVENTS_URL,
        description: truncate(event.description, 4000),
        color: COLORS.created,
        fields: [
          { name: "Location", value: orNotFound(event.location) },
          {
            name: "Start (Toronto)",
            value: orNotFound(formatTorontoTime(event.start_time)),
            inline: true,
          },
          {
            name: "End (Toronto)",
            value: orNotFound(formatTorontoTime(event.end_time)),
            inline: true,
          },
          { name: "Category", value: CATEGORY_LABELS[event.category] },
          { name: "Admin", value: ADMIN_EVENTS_URL },
        ],
      },
    ],
    components: [],
    allowed_mentions: NO_PINGS,
  };
}

export function buildCancelledCard(userId: string): DiscordMessagePayload {
  return {
    content: `❌ Cancelled by <@${userId}>.`,
    embeds: [],
    components: [],
    allowed_mentions: NO_PINGS,
  };
}

export function buildFailureCard(message: string): DiscordMessagePayload {
  return {
    content: "",
    embeds: [
      {
        title: "Couldn't create an event draft",
        description: `${truncate(message, 3500)}\n\nRun \`/event-create\` again to retry.`,
        color: COLORS.failed,
      },
    ],
    components: [],
    allowed_mentions: NO_PINGS,
  };
}

// ─── Interaction responses ───────────────────────────────────────────────────

/** Reply visible only to the clicker. */
export function ephemeral(
  content: string,
  components: DiscordActionRow[] = []
): DiscordInteractionResponse {
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content, components, flags: EPHEMERAL_FLAG, allowed_mentions: NO_PINGS },
  };
}

export function updateMessage(data: DiscordMessagePayload): DiscordInteractionResponse {
  return { type: InteractionResponseType.UpdateMessage, data };
}

/** Ephemeral validation error with a [Fix] button that reopens the modal. */
export function buildValidationError(
  draftId: string,
  message: string
): DiscordInteractionResponse {
  return ephemeral(`⚠️ ${message}`, [
    {
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          label: "Fix",
          custom_id: draftCustomId("fix", draftId),
        },
      ],
    },
  ]);
}

// ─── Review modal ────────────────────────────────────────────────────────────

export const MODAL_FIELDS = {
  name: { label: "Event name", max: 255, style: TextInputStyle.Short },
  location: { label: "Location", max: 255, style: TextInputStyle.Short },
  start: { label: "Start (YYYY-MM-DD HH:mm, Toronto)", max: 32, style: TextInputStyle.Short },
  end: { label: "End (YYYY-MM-DD HH:mm, Toronto)", max: 32, style: TextInputStyle.Short },
  description: {
    label: "Description (member-facing)",
    max: 4000,
    style: TextInputStyle.Paragraph,
  },
} as const;

export type ModalField = keyof typeof MODAL_FIELDS;

/** Review modal with all five inputs required and prefilled where we have a value. */
export function buildReviewModal(
  draftId: string,
  values: Partial<DraftSubmission>
): DiscordInteractionResponse {
  const rows: DiscordActionRow[] = (Object.keys(MODAL_FIELDS) as ModalField[]).map((field) => {
    const { label, max, style } = MODAL_FIELDS[field];
    const value = values[field]?.slice(0, max);
    return {
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.TextInput,
          custom_id: field,
          label,
          style,
          required: true,
          max_length: max,
          ...(field === "start" || field === "end" ? { placeholder: "2026-10-03 18:00" } : {}),
          // Discord rejects an empty-string value, so omit it entirely when there's nothing.
          ...(value ? { value } : {}),
        },
      ],
    };
  });

  return {
    type: InteractionResponseType.Modal,
    data: {
      custom_id: draftCustomId("modal", draftId),
      title: "Review event",
      components: rows,
    },
  };
}
