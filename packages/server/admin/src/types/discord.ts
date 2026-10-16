import type { EventCategory } from "@uwdsc/common/types";

export type ForwardSupportFailureReason = "missing_discord_webhook" | "forward_failed";

export type ForwardSupportResult =
  { ok: true } | { ok: false; reason: ForwardSupportFailureReason };

export interface ForwardSupportToDiscordParams {
  subject: string;
  textBody: string;
  fromRaw: string;
}

export interface DiscordSupportEmbed {
  title: string;
  author: { name: string };
  description: string;
  footer: { text: string };
  timestamp: string;
}

// ==========================================
//  Discord interactions (HTTP) - event bot
//  Hand-written subset of the Discord API v10 shapes the /event-create bot uses.
// ==========================================

export const InteractionType = {
  Ping: 1,
  ApplicationCommand: 2,
  MessageComponent: 3,
  ModalSubmit: 5,
} as const;

export const InteractionResponseType = {
  Pong: 1,
  ChannelMessageWithSource: 4,
  DeferredChannelMessageWithSource: 5,
  UpdateMessage: 7,
  Modal: 9,
} as const;

export const ComponentType = {
  ActionRow: 1,
  Button: 2,
  StringSelect: 3,
  TextInput: 4,
  Label: 18,
} as const;

export const ButtonStyle = {
  Primary: 1,
  Secondary: 2,
  Danger: 4,
  Link: 5,
} as const;

export const TextInputStyle = {
  Short: 1,
  Paragraph: 2,
} as const;

/** Channel types that are threads (announcement, public, private). Forum posts are public threads. */
export const THREAD_CHANNEL_TYPES: ReadonlySet<number> = new Set([10, 11, 12]);

/** Message flag that makes an interaction response visible only to the invoking user. */
export const EPHEMERAL_FLAG = 1 << 6;

export interface DiscordUser {
  id: string;
  username: string;
  global_name?: string | null;
  bot?: boolean;
}

export interface DiscordGuildMember {
  user?: DiscordUser;
  nick?: string | null;
  roles: string[];
}

export interface DiscordChannel {
  id: string;
  type: number;
  parent_id?: string | null;
}

export interface DiscordMessage {
  id: string;
  channel_id: string;
  author: DiscordUser;
  member?: { nick?: string | null };
  content: string;
  timestamp: string;
  webhook_id?: string;
  application_id?: string;
}

export interface DiscordSelectOption {
  label: string;
  value: string;
  description?: string;
  default?: boolean;
}

export interface DiscordButton {
  type: typeof ComponentType.Button;
  style: (typeof ButtonStyle)[keyof typeof ButtonStyle];
  label: string;
  custom_id?: string;
  url?: string;
  disabled?: boolean;
}

export interface DiscordStringSelect {
  type: typeof ComponentType.StringSelect;
  custom_id: string;
  placeholder?: string;
  options: DiscordSelectOption[];
}

export interface DiscordTextInput {
  type: typeof ComponentType.TextInput;
  custom_id: string;
  label: string;
  style: (typeof TextInputStyle)[keyof typeof TextInputStyle];
  required?: boolean;
  min_length?: number;
  max_length?: number;
  placeholder?: string;
  value?: string;
}

export interface DiscordActionRow {
  type: typeof ComponentType.ActionRow;
  components: (DiscordButton | DiscordStringSelect | DiscordTextInput)[];
}

export interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  fields?: { name: string; value: string; inline?: boolean }[];
  footer?: { text: string };
}

/** Body for a message create/edit (interaction response data, webhook edit, channel edit). */
export interface DiscordMessagePayload {
  content?: string;
  embeds?: DiscordEmbed[];
  components?: DiscordActionRow[];
  flags?: number;
  allowed_mentions?: { parse: ("users" | "roles" | "everyone")[] };
}

export interface DiscordModalPayload {
  custom_id: string;
  title: string;
  components: DiscordActionRow[];
}

export type DiscordInteractionResponse =
  | { type: typeof InteractionResponseType.Pong }
  | {
      type:
        | typeof InteractionResponseType.ChannelMessageWithSource
        | typeof InteractionResponseType.UpdateMessage;
      data: DiscordMessagePayload;
    }
  | { type: typeof InteractionResponseType.DeferredChannelMessageWithSource }
  | { type: typeof InteractionResponseType.Modal; data: DiscordModalPayload };

/** A submitted modal component: an action row (legacy) or a label (type 18) wrapping one input. */
export interface DiscordSubmittedComponent {
  type: number;
  custom_id?: string;
  value?: string;
  components?: DiscordSubmittedComponent[];
  component?: DiscordSubmittedComponent;
}

export interface DiscordInteractionData {
  // application command
  name?: string;
  // message component / modal submit
  custom_id?: string;
  component_type?: number;
  values?: string[];
  components?: DiscordSubmittedComponent[];
}

export interface DiscordInteraction {
  id: string;
  application_id: string;
  type: (typeof InteractionType)[keyof typeof InteractionType];
  token: string;
  guild_id?: string;
  channel_id?: string;
  channel?: DiscordChannel;
  member?: DiscordGuildMember;
  user?: DiscordUser;
  data?: DiscordInteractionData;
  message?: DiscordMessage;
}

/**
 * Result of handling an interaction: the immediate response (must be sent within 3s) plus
 * optional slow work for `after()`. The service wraps `background` in its own error handling,
 * since `withRaftRoute` can't catch anything thrown after the response is sent.
 */
export interface InteractionHandlerResult {
  response: DiscordInteractionResponse;
  background?: () => Promise<void>;
}

// ==========================================
//  Event drafts
// ==========================================

export type DiscordDraftStatus = "pending" | "created" | "cancelled";

/** What the LLM pulled out of a thread. Null = not clearly stated. Times are UTC ISO strings. */
export interface ExtractedEvent {
  name: string | null;
  location: string | null;
  start_time: string | null;
  end_time: string | null;
  category: EventCategory | null;
  description: string | null;
}

/** Raw strings from the last review-modal submit (times as "YYYY-MM-DD HH:mm", Toronto). */
export interface DraftSubmission {
  name: string;
  location: string;
  start: string;
  end: string;
  description: string;
}

/** Row of events.discord_event_drafts (timestamptz columns come back as Date from postgres.js). */
export interface DiscordEventDraft {
  id: string;
  initiator_discord_id: string;
  guild_id: string;
  channel_id: string;
  message_id: string | null;
  status: DiscordDraftStatus;
  name: string | null;
  location: string | null;
  description: string | null;
  start_time: Date | null;
  end_time: Date | null;
  category: EventCategory | null;
  submitted_name: string | null;
  submitted_location: string | null;
  submitted_start: string | null;
  submitted_end: string | null;
  submitted_description: string | null;
  created_event_id: string | null;
  created_at: Date;
  expires_at: Date;
}
