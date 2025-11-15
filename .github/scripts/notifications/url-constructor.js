/**
 * URL Constructor - Constructs Vercel deployment URL from PR branch name
 */

// Constants for URL construction
const PROJECT_NAME = "uwdsc-website-v3-cxc";
const TEAM_SLUG = "uwdsc";

/**
 * Sanitizes branch name for URL construction
 * @param {string} branchName - Raw branch name
 * @returns {string} Sanitized branch name safe for URLs
 */
function sanitizeBranchName(branchName) {
  if (!branchName) return "";

  // Remove refs/heads/ prefix if present
  const cleanBranch = branchName.replace(/^refs\/heads\//, "");

  // Replace special characters with hyphens and convert to lowercase
  return cleanBranch
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-") // Replace multiple consecutive hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Constructs Vercel deployment URL using the standard format
 * @param {string} projectName - Vercel project name
 * @param {string} branchName - Git branch name
 * @param {string} teamSlug - Vercel team slug
 * @returns {string} Constructed deployment URL
 */
function constructDeploymentUrl(projectName, branchName, teamSlug) {
  const sanitizedBranch = sanitizeBranchName(branchName);
  return `https://${projectName}-git-${sanitizedBranch}-${teamSlug}.vercel.app`;
}

/**
 * Gets commit information for the PR
 * @param {Object} github - GitHub API instance
 * @param {Object} context - GitHub context
 * @param {Object} pr - Pull request object
 * @returns {Promise<Object>} Commit information
 */
async function getCommitInfo(github, context, pr) {
  try {
    console.log(`Getting commit info for PR #${pr.number}`);

    // Use the head commit from the PR
    const { data: commit } = await github.rest.repos.getCommit({
      owner: context.repo.owner,
      repo: context.repo.repo,
      ref: pr.head.sha,
    });

    return {
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author,
    };
  } catch (error) {
    console.error("Error getting commit info:", error.message);
    return {
      sha: pr.head.sha,
      message: "",
      author: null,
    };
  }
}

/**
 * Main function to construct deployment URL from PR
 * @param {Object} github - GitHub API instance
 * @param {Object} context - GitHub context (pull_request event)
 * @returns {Promise<Object>} Result with shouldNotify flag and deployment info
 */
async function main(github, context) {
  try {
    console.log("🚀 Constructing deployment URL...");

    // Get PR from context
    const pr = context.payload.pull_request;
    if (!pr) {
      console.log("❌ No PR found in context");
      return {
        shouldNotify: false,
        reason: "no_pr_found",
      };
    }

    // Get branch name from PR
    const branchName = pr.head.ref;
    console.log(`🌿 Using branch name: ${branchName}`);

    // Construct the deployment URL
    const deploymentUrl = constructDeploymentUrl(
      PROJECT_NAME,
      branchName,
      TEAM_SLUG
    );
    console.log(`🔗 Constructed deployment URL: ${deploymentUrl}`);

    // Get commit information
    const commitInfo = await getCommitInfo(github, context, pr);
    console.log(
      `✅ Retrieved commit info: ${commitInfo.sha?.substring(0, 7) || "unknown"}`
    );

    return {
      shouldNotify: true,
      deploymentInfo: {
        url: deploymentUrl,
        ref: branchName,
        state: "constructed", // We don't have actual deployment state
        commitSha: commitInfo.sha?.substring(0, 7) || "",
        commitMessage: commitInfo.message?.split("\n")[0] || "", // First line only
        commitAuthor: commitInfo.author,
      },
    };
  } catch (error) {
    console.error("❌ Error constructing deployment URL:", error);
    return {
      shouldNotify: false,
      reason: "construction_error",
      error: error.message,
    };
  }
}

module.exports = { main };
