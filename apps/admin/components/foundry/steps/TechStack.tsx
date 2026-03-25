"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  cn,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  RadioGroup,
  RadioGroupItem,
  Spinner,
  renderSelectField,
  renderCheckboxField,
} from "@uwdsc/ui";
import {
  DATABASE_OPTIONS,
  EXTRAS_OPTIONS,
  MONGO_CLIENT_OPTIONS,
  POSTGRES_PROVIDER_OPTIONS,
} from "@/constants/foundry";
import type { FoundryFormValues } from "@/lib/schemas/foundry";
import type { GitHubTemplateOption } from "@uwdsc/common/types";
import { getGitHubTemplateRepos } from "@/lib/api/foundry";

export function TechStack() {
  const form = useFormContext<FoundryFormValues>();
  const database = useWatch({ control: form.control, name: "database" });

  const [templates, setTemplates] = useState<GitHubTemplateOption[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState<boolean>(true);
  const [templatesError, setTemplatesError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const templates = await getGitHubTemplateRepos();
        if (!mounted) return;
        setTemplates(templates);
        setTemplatesError(null);
      } catch (error: unknown) {
        if (!mounted) return;
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load project templates from GitHub.";
        setTemplatesError(
          message || "Failed to load project templates from GitHub.",
        );
      }
      if (mounted) setTemplatesLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (database !== "postgres") {
      form.setValue("postgresProvider", undefined);
    }
    if (database !== "mongodb") {
      form.setValue("mongoClient", undefined);
    }
  }, [database, form]);

  const templateOptions = templates.map((t) => ({
    value: t.value,
    label: t.value,
  }));

  const projectTypeSelectKey = templatesLoading
    ? "loading"
    : `templates:${templates.length}`;

  if (templatesLoading) {
    return (
      <div className="flex items-center justify-center w-full py-6">
        <Spinner className="size-16 text-primary" />
      </div>
    );
  }

  if (templatesError) {
    return (
      <div className="flex items-center justify-center w-full py-6">
        <Card className="border-destructive/30 bg-destructive/10 text-destructive py-4 gap-2 shadow-none w-full">
          <CardContent className="px-4 py-0">
            <p className="text-sm font-medium break-words">{templatesError}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div key={projectTypeSelectKey}>
        <FormField
          control={form.control}
          name="projectType"
          render={renderSelectField({
            label: "Project Type",
            placeholder: "Choose a template…",
            required: true,
            options: templateOptions,
            triggerClassName: "w-full",
          })}
        />
      </div>

      {!templatesLoading && !templatesError && templates.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No GitHub templates found.
        </p>
      )}

      <FormField
        control={form.control}
        name="database"
        render={renderSelectField({
          label: "Database",
          placeholder: "Choose a database…",
          required: true,
          options: DATABASE_OPTIONS.map((d) => ({
            value: d.value,
            label: d.label,
          })),
          triggerClassName: "w-full",
        })}
      />

      {database === "postgres" && (
        <FormField
          control={form.control}
          name="postgresProvider"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>
                PostgreSQL hosting{" "}
                <span className="text-red-500" aria-hidden>
                  *
                </span>
              </FormLabel>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-col gap-3"
              >
                {POSTGRES_PROVIDER_OPTIONS.map((opt) => {
                  const optionId = `foundry-postgres-${opt.value}`;
                  const isSelected = field.value === opt.value;
                  return (
                    <label
                      key={opt.value}
                      htmlFor={optionId}
                      className={cn(
                        "flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                        isSelected
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-border hover:bg-muted/40",
                      )}
                    >
                      <RadioGroupItem
                        id={optionId}
                        value={opt.value}
                        className="mt-0.5"
                      />
                      <div className="flex flex-col gap-0.5 text-left">
                        <span className="text-sm font-medium leading-none">
                          {opt.label}
                        </span>
                        <span className="text-xs text-muted-foreground leading-snug">
                          {opt.description}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </RadioGroup>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {database === "mongodb" && (
        <FormField
          control={form.control}
          name="mongoClient"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>
                MongoDB client{" "}
                <span className="text-red-500" aria-hidden>
                  *
                </span>
              </FormLabel>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-col gap-3"
              >
                {MONGO_CLIENT_OPTIONS.map((opt) => {
                  const optionId = `foundry-mongo-${opt.value}`;
                  const isSelected = field.value === opt.value;
                  return (
                    <label
                      key={opt.value}
                      htmlFor={optionId}
                      className={cn(
                        "flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                        isSelected
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-border hover:bg-muted/40",
                      )}
                    >
                      <RadioGroupItem
                        id={optionId}
                        value={opt.value}
                        className="mt-0.5"
                      />
                      <div className="flex flex-col gap-0.5 text-left">
                        <span className="text-sm font-medium leading-none">
                          {opt.label}
                        </span>
                        <span className="text-xs text-muted-foreground leading-snug">
                          {opt.description}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </RadioGroup>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Extras (optional)</p>
        <div className="flex flex-col gap-3">
          {EXTRAS_OPTIONS.map((extra) => (
            <FormField
              key={extra.name}
              control={form.control}
              name={extra.name}
              render={renderCheckboxField({
                label: extra.label,
                description: extra.description,
              })}
            />
          ))}
        </div>
      </div>
    </>
  );
}
