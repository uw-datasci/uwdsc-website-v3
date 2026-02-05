# UWDSC Documentation Site

This is the documentation website for the UWDSC monorepo, built with [Nextra](https://nextra.site/).

## Development

```bash
# Install dependencies (from root)
pnpm install

# Start dev server
pnpm dev:docs

# Or from this directory
cd apps/docs
pnpm dev
```

The documentation will be available at http://localhost:3002

## Building

```bash
# From root
pnpm build:docs

# Or from this directory
cd apps/docs
pnpm build
```

The static site will be generated in `out/` directory.

## Adding Documentation

### Create a New Page

1. Create a new `.mdx` file in `pages/` directory
2. Add entry to `_meta.ts` for navigation

Example:

```mdx
# My New Page

This is my documentation page content.

## Section

More content here.
```

### Navigation Structure

Edit `_meta.ts` files to control navigation:

```typescript
export default {
  index: "Introduction",
  "getting-started": "Getting Started",
  guides: "Guides",
};
```

## Deployment

The documentation is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

### Manual Deployment

1. Build the site: `pnpm build`
2. The `out/` directory contains the static site
3. GitHub Actions will deploy to GitHub Pages

### GitHub Pages Setup

1. Go to repository Settings → Pages
2. Source: GitHub Actions
3. The site will be available at: `https://[username].github.io/uwdsc-website-v3/`

## Technologies

- **Nextra**: Documentation framework
- **Next.js 15**: React framework
- **TypeScript**: Type safety
- **MDX**: Markdown with JSX support

## Learn More

- [Nextra Documentation](https://nextra.site/)
- [MDX Documentation](https://mdxjs.com/)
