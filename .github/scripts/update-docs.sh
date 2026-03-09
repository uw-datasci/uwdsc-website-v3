#!/bin/bash
set -e

# Get the PR head SHA from environment variable or first argument
PR_SHA="${PR_HEAD_SHA:-$1}"
SEMESTER_TAG="${SEMESTER_TAG:-}"
PR_NUMBER="${PR_NUMBER:-}"
PR_TITLE="${PR_TITLE:-}"

if [ -z "$PR_SHA" ]; then
  echo "Error: PR_HEAD_SHA environment variable or PR SHA argument is required"
  exit 1
fi

# Generate diff file
git diff --name-only origin/main...$PR_SHA > changes.diff

# Determine changelog file based on semester tag
CHANGELOG_FILE=""
if [ -n "$SEMESTER_TAG" ]; then
  CHANGELOG_FILE="apps/docs/pages/changelog/${SEMESTER_TAG}.mdx"
  echo "Semester tag found: $SEMESTER_TAG"
  echo "Will update changelog: $CHANGELOG_FILE"
else
  echo "No semester tag found. Will update general documentation only."
fi

# Build the prompt for copilot
PROMPT="You are a technical writer focused on documenting features from a business/functional perspective for a university data science club.

BE BRIEF AND CONCISE: Keep all summaries and descriptions short. One or two sentences per item maximum. Avoid long paragraphs or unnecessary detail.

Read the 'changes.diff' file to understand the latest code updates from PR #${PR_NUMBER}: ${PR_TITLE}.

IMPORTANT: Before making any modifications to existing documentation:
- Review the changes.diff to see exactly what code changed
- Search the codebase to verify the current implementation state
- Only modify existing entries when code changes clearly warrant documentation updates
- Ensure all modifications accurately reflect the actual code changes"

if [ -n "$SEMESTER_TAG" ] && [ -f "$CHANGELOG_FILE" ]; then
  PROMPT="$PROMPT

CRITICAL: This PR is tagged with semester ${SEMESTER_TAG}. You MUST ONLY update the changelog file at: ${CHANGELOG_FILE}

DO NOT modify any other files in the documentation. The PR should show only ONE file changed: ${CHANGELOG_FILE}

## Changelog Structure Context

The changelog is organized by semester (F25, W26, S26, etc.) and each semester file has the following structure:

# [Semester] Updates

[Introduction paragraph]

## 🎯 Main Website (apps/web)
[Features for the main website app]

## 🏆 CxC App (apps/cxc)
[Features for the CxC competition app]

## 🎨 Design System (packages/ui)
[New UI components and design system updates]

## 🔧 Infrastructure
[Backend services, development tools, package updates]

## 🚀 DevOps & CI/CD
[CI/CD workflows, deployment improvements, development workflow enhancements]

---

_Features documented from merged PRs tagged with \`${SEMESTER_TAG}\`..._

## Instructions for Updating the Changelog

1. **Focus on business value**: Document WHAT was built and WHY it matters to users/admins, NOT technical implementation details
2. **Use business language**: Write in terms like 'Users can now...', 'Admins can...', 'Added feature X that allows Y'
3. **Group by section**: Add features to the appropriate main section (Main Website, CxC App, Design System, Infrastructure, DevOps)
4. **Format as bullet points**: Use markdown bullet points (-) for each feature
5. **Maintain structure**: Keep the existing section headings and formatting
6. **Primary focus on additions**: Prioritize adding new features and updates. When modifications are necessary:
  - Use changes.diff to understand what code actually changed. If it were minor bug fixes and improvements, do not modify the documentation.
  - Search the codebase to verify the current state of features before modifying documentation
  - Only modify existing entries when the code changes clearly indicate updates, corrections, or removals
  - Ensure modifications accurately reflect the actual code changes - cross-reference with the codebase
7. **One feature per bullet**: Each feature should be a separate bullet point
8. **Be brief and concise**: Summaries must be short—one or two sentences max. No long paragraphs; focus only on user impact

## Example Format

- **Feature Name**: Brief description of what users/admins can now do or what was improved

Do not ask for confirmation. Just make the edits to ${CHANGELOG_FILE} only."
else
  PROMPT="$PROMPT

Scan the '/apps/docs' folder and update the markdown files to reflect these code changes.

Keep all documentation updates brief and concise—short summaries only, no long paragraphs.

IMPORTANT: When updating documentation:
- Primary focus: Add new documentation for new features
- Modifications: When modifying existing documentation:
  - Use changes.diff to understand what code actually changed. If it were minor bug fixes and improvements, do not modify the documentation.
  - Search the codebase to verify current implementation before modifying docs
  - Only modify existing entries when code changes clearly indicate updates are needed
  - Ensure modifications accurately reflect the actual code changes"
fi

PROMPT="$PROMPT

Do not ask for confirmation. Just make the edits."

# Run copilot to update docs
copilot -p "$PROMPT" --allow-all-tools

rm -f changes.diff
