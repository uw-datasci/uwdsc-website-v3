import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const APPS = [
  { name: "web", infisicalPath: "/web" },
  { name: "admin", infisicalPath: "/admin" },
];

const PACKAGES = [
  { name: "server/db", infisicalPath: "/web-db" },
];

try {
  // Extract environment variables
  const INFISICAL_PROJECT_ID = process.env.INFISICAL_PROJECT_ID;
  const INFISICAL_CLIENT_ID = process.env.INFISICAL_CLIENT_ID;
  const INFISICAL_CLIENT_SECRET = process.env.INFISICAL_CLIENT_SECRET;

  const rootDir = join(__dirname, "..");
  const configPath = join(rootDir, ".infisical.json");

  // 0. CHECK & INSTALL: Ensure Infisical CLI is installed
  try {
    execSync("infisical --version", { stdio: "ignore" });
    console.log("✅ Infisical CLI is already installed");
  } catch {
    console.log("📦 Infisical CLI not found. Installing globally...");
    execSync("npm install -g @infisical/cli", { stdio: "inherit" });
    console.log("✅ Infisical CLI installed successfully");
  }

  // 1. INIT: Run 'infisical init' if config is missing
  if (!existsSync(configPath)) {
    console.log("🔧 Configuration missing. Running 'infisical init'...");
    execSync("infisical init", { cwd: rootDir, stdio: "inherit" });
  }

  // 2. GET PROJECT ID: Try Env Var -> Then try reading local file
  let projectId = INFISICAL_PROJECT_ID;
  if (!projectId && existsSync(configPath)) {
    try {
      const config = JSON.parse(readFileSync(configPath, "utf8"));
      projectId = config.workspaceId || config.projectId;
    } catch (e) {
      console.error("Error parsing .infisical.json:", e);
    }
  }

  // 3. AUTHENTICATE: Try Machine Auth first, fallback to User
  let machineAuthSuccess = false;

  if (INFISICAL_CLIENT_ID && INFISICAL_CLIENT_SECRET) {
    console.log("🤖 Authenticating Machine Identity...");
    try {
      // Use 'pipe' for stdio so we can catch errors silently without crashing
      const token = execSync(
        `infisical login --method=universal-auth --client-id="${INFISICAL_CLIENT_ID}" --client-secret="${INFISICAL_CLIENT_SECRET}" --silent --plain`,
        { encoding: "utf8", stdio: "pipe" },
      ).trim();

      process.env.INFISICAL_TOKEN = token;
      machineAuthSuccess = true;
      console.log("✅ Machine Login Successful.");
    } catch (error) {
      console.warn(
        "⚠️ Machine Authentication failed. Falling back to User Login...",
        error,
      );
    }
  }

  // If Machine Auth didn't run or failed, check User Session
  if (!machineAuthSuccess) {
    try {
      // Check if user is already logged in
      execSync("infisical secrets list --plain", { stdio: "ignore" });
    } catch {
      console.log("🔑 User login required...");
      execSync("infisical login", { stdio: "inherit" });
    }
  }

  // 4. EXPORT SECRETS
  const projectFlag = projectId ? `--projectId="${projectId}"` : "";

  // Sync app secrets
  APPS.forEach(({ name, infisicalPath }) => {
    const targetDir = join(rootDir, "apps", name);
    const targetFile = join(targetDir, ".env.local");

    if (!existsSync(targetDir))
      return console.warn(`⚠️  Skipping ${name} (folder missing)`);

    console.log(`⚡ Syncing ${name}...`);
    const secrets = execSync(
      `infisical export --path="${infisicalPath}" --env=dev ${projectFlag}`,
      { encoding: "utf8" },
    );

    writeFileSync(targetFile, secrets);
    console.log(`   ✅ Updated .env.local`);
  });

  // Sync package secrets
  PACKAGES.forEach(({ name, infisicalPath }) => {
    const targetDir = join(rootDir, "packages", name);
    const targetFile = join(targetDir, ".env.local");

    if (!existsSync(targetDir))
      return console.warn(`⚠️  Skipping ${name} (folder missing)`);

    console.log(`⚡ Syncing ${name}...`);
    const secrets = execSync(
      `infisical export --path="${infisicalPath}" --env=dev ${projectFlag}`,
      { encoding: "utf8" },
    );

    writeFileSync(targetFile, secrets);
    console.log(`   ✅ Updated .env.local`);
  });

  console.log("🎉 Secrets synced successfully!");
} catch (error) {
  console.error("\n❌ Error:", error.stdout?.toString() || error.message);
  process.exit(1);
}
