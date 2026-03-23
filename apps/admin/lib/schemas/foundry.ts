import { z } from "zod";
import {
  DATABASE_OPTIONS,
  MONGO_CLIENT_OPTIONS,
  POSTGRES_PROVIDER_OPTIONS,
} from "@/constants/foundry";

export { DATABASE_OPTIONS } from "@/constants/foundry";
export type { DatabaseValue } from "@/constants/foundry";

const postgresProviderEnum = z.enum(
  POSTGRES_PROVIDER_OPTIONS.map((o) => o.value) as [
    string,
    ...string[],
  ],
);

const mongoClientEnum = z.enum(
  MONGO_CLIENT_OPTIONS.map((o) => o.value) as [string, ...string[]],
);

const databaseEnum = z.enum(
  DATABASE_OPTIONS.map((d) => d.value) as [string, ...string[]],
);

/** Empty string = no selection (matches team dropdown); refine requires a real choice. */
const databaseFieldSchema = z
  .union([z.literal(""), databaseEnum])
  .refine((v) => v !== "", { message: "Select a database" });

function refineDatabaseStack(
  data: {
    database: string;
    postgresProvider?: string;
    mongoClient?: string;
  },
  ctx: z.RefinementCtx,
) {
  if (data.database === "postgres") {
    if (data.postgresProvider == null) {
      ctx.addIssue({
        code: "custom",
        message: "Select a PostgreSQL provider",
        path: ["postgresProvider"],
      });
    }
  }
  if (data.database === "mongodb") {
    if (data.mongoClient == null) {
      ctx.addIssue({
        code: "custom",
        message: "Select a MongoDB client",
        path: ["mongoClient"],
      });
    }
  }
}

export const foundryStep3Schema = z
  .object({
    projectType: z
      .string()
      .trim()
      .min(1, "Select a project template"),
    database: databaseFieldSchema,
    postgresProvider: postgresProviderEnum.optional(),
    mongoClient: mongoClientEnum.optional(),
  })
  .superRefine(refineDatabaseStack);

/** Plain object shape — use this for `.pick()`; the full form adds refinements below. */
export const foundryFormObjectSchema = z.object({
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
  database: databaseFieldSchema,
  postgresProvider: postgresProviderEnum.optional(),
  mongoClient: mongoClientEnum.optional(),
  extras: z.object({
    redis: z.boolean(),
    s3: z.boolean(),
  }),

  // Step 3 — Description (optional)
  description: z
    .string()
    .trim()
    .max(1000, "Description must be 1000 characters or fewer"),
});

export const foundryFormSchema = foundryFormObjectSchema.superRefine(
  refineDatabaseStack,
);

export type FoundryFormValues = z.infer<typeof foundryFormObjectSchema>;

export const foundryFormDefaultValues: FoundryFormValues = {
  projectName: "",
  teamAccess: "",
  projectType: "",
  database: "",
  postgresProvider: undefined,
  mongoClient: undefined,
  extras: { redis: false, s3: false },
  description: "",
};
