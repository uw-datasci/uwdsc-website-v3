---
description: Add a new shadcn UI component
---

# Adding a New Shadcn UI Component

When asked to add a new shadcn/ui component to the project, follow these instructions to ensure it's added to the shared `@uwdsc/ui` package correctly:

1. **Always run this command from the shared workspace root (`/`)**:

   ```bash
   pnpm ui:add <component-name>
   ```

2. **Rules:**
   - **Do NOT** manually install shadcn components.
   - **Do NOT** duplicate or add shadcn components directly inside the `apps/web` or `apps/admin` folders.
   - The script will automatically run shadcn inside the `packages/ui` package and export it properly.

**Example Usage**:
If requested to add a dropdown menu, execute:

```bash
pnpm ui:add dropdown-menu
```
