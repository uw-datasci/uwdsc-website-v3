# Discord event bot (`/event-create`)

Execs run `/event-create` inside a Discord thread where an event is being planned. The bot reads the thread, uses an LLM to extract the event details, and posts a public preview card. The exec who ran it picks a category, reviews and edits the details in a modal, and confirms. The bot then creates an **unpublished** event, which shows up with a **Draft** badge on [admin.uwdatascience.ca/events](https://admin.uwdatascience.ca/events). Nothing appears on the website, calendar feed, or check-in until someone clicks **Publish** there.

It's an HTTP-interactions bot (no gateway connection or always-on process). Discord POSTs to `apps/admin/app/api/discord/interactions/route.ts`, which is deployed with the admin app.

| File                       | Role                                                                        |
| -------------------------- | --------------------------------------------------------------------------- |
| `eventBot.service.ts`      | Handlers for the command, select, buttons, and modal submit                 |
| `eventDraft.repository.ts` | `events.discord_event_drafts`                                               |
| `discordApi.ts`            | Discord REST (bot token / interaction token) + Ed25519 request verification |
| `components.ts`            | Card, modal, and button builders                                            |
| `extract.ts`               | The LLM call (Claude). Swap providers by changing only this file            |

## Environment variables (Infisical → admin)

| Variable                 | Where to find it                                                      |
| ------------------------ | --------------------------------------------------------------------- |
| `DISCORD_APPLICATION_ID` | Developer Portal → your app → General Information → Application ID    |
| `DISCORD_PUBLIC_KEY`     | General Information → Public Key                                      |
| `DISCORD_BOT_TOKEN`      | Bot → Reset Token                                                     |
| `DISCORD_GUILD_ID`       | Discord (Developer Mode on) → right-click the server → Copy Server ID |
| `DISCORD_EXEC_ROLE_ID`   | Server Settings → Roles → right-click the exec role → Copy Role ID    |
| `ANTHROPIC_API_KEY`      | [Claude Console](https://platform.claude.com) → API Keys              |

> Extraction uses `claude-opus-5-5` at `low` effort, one request per `/event-create`, with a 40s timeout. If a safety classifier declines, the request automatically falls back to Anthropic's recommended model (`fallbacks: "default"`).

## One-time setup

1. **Create the application** at <https://discord.com/developers/applications>, then add the IDs and secrets above to Infisical.
2. **Enable the Message Content intent**: Bot → Privileged Gateway Intents → **Message Content Intent** → on. Without it, Discord returns empty `content` for thread messages and the bot reports that it found no text.
3. **Deploy the admin app** with the env vars set, then set **General Information → Interactions Endpoint URL** to:

   ```
   https://admin.uwdatascience.ca/api/discord/interactions
   ```

   Discord verifies the URL when you save it, by sending a signed PING and some badly signed requests. Saving only succeeds once the deployed app has the right `DISCORD_PUBLIC_KEY`.

4. **Invite the bot**: OAuth2 → URL Generator.
   - Scopes: `bot` and `applications.commands`
   - Bot permissions: **View Channel** and **Read Message History**. That's all it needs: interaction responses don't require Send Messages, and it only edits its own messages.
   - Private threads: the bot can only read them if it's added to the thread (mention it there) or has Manage Threads.
5. **Register the command**: run `pnpm pull-secrets`, then `pnpm discord:register`. The command is registered for the guild only, and re-running is safe.
6. **Allow execs to see the command**: it's registered with `default_member_permissions: "0"`, so only server admins see it at first. Go to Server Settings → Integrations → the bot → `/event-create` and allow the exec role. The route also checks `DISCORD_EXEC_ROLE_ID` itself, so this setting only controls visibility.

## Behaviour notes

- The card, the created state, and the cancelled state are **public** in the thread. Everything else (errors, "only @user can edit", expiry) is ephemeral. Only the person who ran the command can use the controls.
- Drafts expire **1 hour** after `/event-create`.
- Times are entered and shown as `YYYY-MM-DD HH:mm` in **America/Toronto**. Times that don't exist because of the spring-forward DST change are rejected.
- Validation uses the same `createEventSchema` as the admin form (`@uwdsc/common/schemas`).
- Failures in the background step (reading the thread, the LLM call) are reported to Raft (`route: "discord:event-bot"`) and appear in Optics. The card is edited to show the failure.
