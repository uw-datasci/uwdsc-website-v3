ALTER TABLE hiring.applications
  DROP COLUMN IF EXISTS linkedin_url,
  DROP COLUMN IF EXISTS github_url,
  DROP COLUMN IF EXISTS portfolio_url;
