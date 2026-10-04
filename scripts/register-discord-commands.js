#!/usr/bin/env node

/**
 * Discord Slash Command Registration
 *
 * Registers the event bot's /event-create command as a GUILD command (instant to propagate,
 * unlike global commands). Uses a bulk overwrite, so it's safe to re-run: the guild's command
 * list for this application becomes exactly what's defined below.
 *
 * Reads DISCORD_APPLICATION_ID, DISCORD_BOT_TOKEN and DISCORD_GUILD_ID from the environment,
 * or from apps/admin/.env.local (written by `pnpm pull-secrets`).
 *
 * Usage: pnpm discord:register
 */

import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import dotenv from "dotenv";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const adminEnvPath = path.join(__dirname, "..", "apps", "admin", ".env.local");
if (fs.existsSync(adminEnvPath)) {
  dotenv.config({ path: adminEnvPath, quiet: true });
  console.log("✓ Loaded environment from apps/admin/.env.local");
} else {
  console.warn("⚠ apps/admin/.env.local not found, using the shell environment");
}

const { DISCORD_APPLICATION_ID, DISCORD_BOT_TOKEN, DISCORD_GUILD_ID } = process.env;
const missing = Object.entries({ DISCORD_APPLICATION_ID, DISCORD_BOT_TOKEN, DISCORD_GUILD_ID })
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missing.length > 0) {
  console.error(`❌ ERROR: missing ${missing.join(", ")}`);
  console.error("  Run `pnpm pull-secrets` or export them in your shell.\n");
  process.exit(1);
}

const commands = [
  {
    name: "event-create",
    description: "Draft a website event from this thread (execs only)",
    type: 1, // CHAT_INPUT
    // "0" = hidden from everyone except server admins until a role is allowed under
    // Server Settings → Integrations → <bot>. The interactions route also checks
    // DISCORD_EXEC_ROLE_ID, so this is UX, not the security boundary.
    default_member_permissions: "0",
    contexts: [0], // GUILD only
  },
];

const url = `https://discord.com/api/v10/applications/${DISCORD_APPLICATION_ID}/guilds/${DISCORD_GUILD_ID}/commands`;

console.log(`\n🔄 Registering ${commands.length} guild command(s)...\n`);

const response = await fetch(url, {
  method: "PUT",
  headers: {
    Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(commands),
});

if (!response.ok) {
  console.error(`❌ Discord returned ${response.status}:`);
  console.error(await response.text());
  process.exit(1);
}

const registered = await response.json();
for (const command of registered) {
  console.log(`   ✅ /${command.name} (${command.id})`);
}
console.log("\n✅ Commands registered successfully");
