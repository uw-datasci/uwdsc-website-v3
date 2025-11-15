/**
 * Quality Gate Report Generator
 *
 * Generates and posts a markdown report to PRs showing the results of quality checks.
 * Updates existing comments to avoid spam.
 */

async function main({ github, context, core }, jobResults) {
  // Don't run on non-PR events
  if (context.eventName !== "pull_request") {
    core.info("Not a pull request event, skipping PR comment");
    return;
  }

  // Parse job results
  const { lint, typeCheck, build } = jobResults;

  // Generate status emojis
  const getStatus = (result) =>
    result === "success" ? "✅ Passed" : "❌ Failed";

  const lintStatus = getStatus(lint);
  const typeCheckStatus = getStatus(typeCheck);
  const buildStatus = getStatus(build);

  const allPassed =
    lint === "success" && typeCheck === "success" && build === "success";

  // Build the markdown report
  let comment = `# 🚦 Quality Gate Report\n\n`;

  // Results table
  comment += `## 📊 Check Results\n\n`;
  comment += `| Check | Status | Details |\n`;
  comment += `|-------|--------|----------|\n`;
  comment += `| 🔍 Linting | ${lintStatus} | ESLint code quality checks |\n`;
  comment += `| 🔒 Type Checking | ${typeCheckStatus} | TypeScript type safety |\n`;
  comment += `| 🏗️ Build | ${buildStatus} | Production build verification |\n\n`;

  // Overall status
  if (allPassed) {
    comment += `## ✅ All Checks Passed!\n\n`;
    comment += `Your code meets all quality standards and is ready to merge! 🎉\n\n`;
  } else {
    comment += `## ❌ Quality Gate Failed\n\n`;
    comment += `Some checks failed. Please review and fix:\n\n`;

    // Specific failure guidance
    if (lint !== "success") {
      comment += `- **Linting errors**: Run \`pnpm run lint\` locally to see and fix issues\n`;
    }
    if (typeCheck !== "success") {
      comment += `- **Type errors**: Run \`pnpm run check-types\` locally to see type issues\n`;
    }
    if (build !== "success") {
      comment += `- **Build errors**: Run \`pnpm run build\` locally to reproduce\n`;
    }
    comment += `\n`;
  }

  // Run details
  comment += `---\n`;
  comment += `📝 **Run Details**\n`;
  comment += `- Commit: \`${context.sha.substring(0, 7)}\`\n`;
  comment += `- Workflow Run: [View Details](${context.payload.repository.html_url}/actions/runs/${context.runId})\n`;
  comment += `- Triggered by: @${context.actor}\n`;

  // Find existing comment from bot
  try {
    const { data: comments } = await github.rest.issues.listComments({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
    });

    const botComment = comments.find(
      (comment) =>
        comment.user.type === "Bot" &&
        comment.body.includes("🚦 Quality Gate Report")
    );

    // Update existing comment or create new one
    if (botComment) {
      core.info(`Updating existing comment ID: ${botComment.id}`);
      await github.rest.issues.updateComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        comment_id: botComment.id,
        body: comment,
      });
    } else {
      core.info("Creating new comment");
      await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: comment,
      });
    }

    core.info("✅ PR comment posted successfully");
  } catch (error) {
    core.setFailed(`Failed to post PR comment: ${error.message}`);
    throw error;
  }
}

module.exports = { main };
