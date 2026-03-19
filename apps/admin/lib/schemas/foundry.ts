import { z } from "zod";
import { DATABASE_OPTIONS } from "@/constants/foundry";

export { DATABASE_OPTIONS } from "@/constants/foundry";
export type { DatabaseValue } from "@/constants/foundry";

export const foundryFormSchema = z.object({
  // Step 1 — Project Details
  projectName: z
    .string()
    .trim()
    .min(1, "Project name is required")
    .max(50, "Project name must be 50 characters or fewer")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Must be lowercase kebab-case (e.g. my-cool-project)",
    ),
  teamAccess: z.string().trim().min(1, "Select a GitHub team"),

  // Step 2 — Tech Stack & Infrastructure
  projectType: z
    .string()
    .trim()
    .min(1, "Select a project template"),
  database: z.enum(
    DATABASE_OPTIONS.map((d) => d.value) as [string, ...string[]],
    { error: "Select a database" },
  ),
  extras: z.object({
    redis: z.boolean(),
    s3: z.boolean(),
  }),

  // Step 3 — Description
  description: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters")
    .max(1000, "Description must be 1000 characters or fewer"),
});

export type FoundryFormValues = z.infer<typeof foundryFormSchema>;

export const foundryFormDefaultValues: FoundryFormValues = {
  projectName: "",
  teamAccess: "",
  projectType: "",
  database: "postgresql",
  extras: { redis: false, s3: false },
  description: "",
};
