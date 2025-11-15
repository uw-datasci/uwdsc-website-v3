/**
 * Discord Notification Sender - Sends Discord notifications for PR deployments
 */

/**
 * Analyzes changed files to determine what was affected
 * @param {Array} files - Array of changed files from GitHub API
 * @returns {Object} Analysis of affected areas
 */
function analyzeAffectedAreas(files) {
  const affected = {
    apps: new Set(),
    packages: new Set(),
    githubActions: false,
    scripts: false,
    docs: false,
    other: [],
  };

  files.forEach((file) => {
    const filename = file.filename;

    // Check apps
    if (filename.startsWith("apps/web/")) {
      affected.apps.add("web");
    } else if (filename.startsWith("apps/cxc/")) {
      affected.apps.add("cxc");
    }
    // Check packages
    else if (filename.startsWith("packages/server/")) {
      affected.packages.add("server");
    } else if (filename.startsWith("packages/ui/")) {
      affected.packages.add("ui");
    }
    // Check other areas
    else if (filename.startsWith(".github/")) {
      affected.githubActions = true;
    } else if (filename.startsWith("scripts/")) {
      affected.scripts = true;
    } else if (filename.startsWith("docs/")) {
      affected.docs = true;
    } else {
      // Root level files or other directories
      affected.other.push(filename);
    }
  });

  return affected;
}

/**
 * Formats affected areas for Discord display
 * @param {Object} affected - Affected areas analysis
 * @returns {string} Formatted string for Discord
 */
function formatAffectedAreas(affected) {
  const parts = [];

  if (affected.apps.size > 0) {
    parts.push(`📱 Apps: ${Array.from(affected.apps).join(", ")}`);
  }

  if (affected.packages.size > 0) {
    parts.push(`📦 Packages: ${Array.from(affected.packages).join(", ")}`);
  }

  if (affected.githubActions) {
    parts.push("⚙️ GitHub Actions");
  }

  if (affected.scripts) {
    parts.push("🔧 Scripts");
  }

  if (affected.docs) {
    parts.push("📚 Documentation");
  }

  if (affected.other.length > 0) {
    const otherFiles = affected.other.slice(0, 3); // Show first 3 files
    const moreCount = affected.other.length - 3;
    parts.push(
      `🔗 Other: ${otherFiles.join(", ")}${moreCount > 0 ? ` (+${moreCount} more)` : ""}`
    );
  }

  return parts.length > 0 ? parts.join("\n") : "No categorized changes";
}

/**
 * Creates a rich Discord embed for Vercel preview deployment
 * @param {Object} prInfo - PR information
 * @param {Object} deploymentInfo - Deployment information
 * @param {Object} affected - Analysis of affected areas
 * @returns {Object} Discord embed object
 */
function createDiscordEmbed(prInfo, deploymentInfo, affected) {
  const embed = {
    title: "🚀 Preview Deployment Ready",
    description: `**${prInfo.title}**`,
    color: 0x00d4aa, // Vercel green
    fields: [
      {
        name: "📋 Pull Request",
        value: `[#${prInfo.number}](${prInfo.url})`,
        inline: true,
      },
      {
        name: "🌿 Branch",
        value: `\`${prInfo.branchName}\``,
        inline: true,
      },
      {
        name: "👤 Author",
        value: `@${prInfo.author}`,
        inline: true,
      },
    ],
    author: {
      name: prInfo.author,
      icon_url: prInfo.authorAvatar,
    },
    timestamp: new Date().toISOString(),
    footer: {
      text: "Vercel Preview Deployment",
      icon_url: "https://vercel.com/favicon.ico",
    },
  };

  // Add commit info if available
  if (deploymentInfo.commitMessage && deploymentInfo.commitSha) {
    embed.fields.push({
      name: "📝 Latest Commit",
      value: `\`${deploymentInfo.commitSha}\` ${deploymentInfo.commitMessage}`,
      inline: false,
    });
  }

  // Add affected areas
  embed.fields.push({
    name: "🎯 What's Affected",
    value: formatAffectedAreas(affected),
    inline: false,
  });

  // Add deployment link
  embed.fields.push({
    name: "🔗 Preview Link",
    value: `[View Deployment](${deploymentInfo.url})`,
    inline: false,
  });

  return embed;
}

/**
 * Main function to send Discord notification
 * @param {Object} core - GitHub Actions core
 * @param {Object} github - GitHub API instance
 * @param {Object} context - GitHub context (contains PR info)
 * @param {Object} deploymentInfo - Deployment information from URL constructor
 * @returns {Promise<void>}
 */
async function main(core, github, context, deploymentInfo) {
  try {
    console.log("🚀 Sending Discord notification...");

    // Extract PR info directly from context
    const pr = context.payload.pull_request;
    if (!pr) {
      core.setFailed("❌ No PR found in context");
      return;
    }

    const prInfo = {
      number: pr.number,
      title: pr.title,
      url: pr.html_url,
      author: pr.user.login,
      authorAvatar: pr.user.avatar_url,
      branchName: pr.head.ref,
    };

    console.log("PR Info:", JSON.stringify(prInfo, null, 2));
    console.log("Deployment Info:", JSON.stringify(deploymentInfo, null, 2));

    // Get Discord webhook URL from environment
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      core.setFailed("❌ DISCORD_WEBHOOK_URL secret is not set");
      return;
    }

    // Get changed files from PR
    console.log("🔍 Analyzing changed files...");
    const { data: files } = await github.rest.pulls.listFiles({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: pr.number,
    });

    console.log(`📋 Found ${files.length} changed files`);

    // Analyze what was affected
    const affected = analyzeAffectedAreas(files);
    console.log("🎯 Affected areas:", affected);

    // Create Discord embed
    const embed = createDiscordEmbed(prInfo, deploymentInfo, affected);
    const payload = {
      embeds: [embed],
    };

    console.log("Sending Discord notification...");

    // Send to Discord webhook
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Discord webhook failed (${response.status}): ${errorText}`
      );
    }

    console.log("✅ Discord notification sent successfully!");
  } catch (error) {
    console.error("❌ Error sending Discord notification:", error);
    core.setFailed(`Failed to send Discord notification: ${error.message}`);
  }
}

module.exports = { main };
