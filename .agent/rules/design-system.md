# Design System Architecture

This project follows an **Atomic Design System** pattern using shadcn/ui as the foundation.

## Structure Overview

### 🧬 Atoms: UI Package (`packages/ui`)

The `packages/ui` directory contains **shared, reusable UI primitives** built with shadcn/ui components.

**Package Configuration:**

- Uses shadcn/ui "new-york" style
- Exports via `packages/ui/src/index.ts`
- Includes global styles at `packages/ui/src/styles/globals.css`
- UI components at `packages/ui/src/components`

### 🧩 Molecules: App Components

Each app (`apps/web/components`, `apps/admin/components`) contains **composed components** that combine atoms from the UI package with app-specific logic.

## Adding New Shadcn Components

To add a new shadcn component to the shared UI package, you MUST run this from the repository root:
`pnpm ui:add <component-name>`

_(Alternatively, use the `add-ui-component` workflow.)_

## Usage Guidelines

### ✅ Do

1. **Import atoms from `@uwdsc/ui`** in your app components. Example: `import { Card } from "@uwdsc/ui";`
2. **Create molecules in app-specific `components/` folders** when adding business logic, creating feature-specific compositions, or combining multiple atoms.
3. **Add new primitives to the UI package** when they are pure UI components to be reused across web and admin apps, and follow shadcn/ui patterns.

### ❌ Don't

1. **Don't duplicate shadcn components** in app folders.
2. **Don't add business logic** to UI package atoms to keep them pure and reusable.
3. **Don't manually install shadcn components**. Always use `pnpm ui:add` from the root.
