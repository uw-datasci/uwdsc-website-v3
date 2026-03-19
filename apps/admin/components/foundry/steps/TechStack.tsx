"use client";

import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  FormField,
  Spinner,
  renderSelectField,
  renderCheckboxField,
} from "@uwdsc/ui";
import { DATABASE_OPTIONS, EXTRAS_OPTIONS } from "@/constants/foundry";
import type { FoundryFormValues } from "@/lib/schemas/foundry";
import { getGitHubTemplateRepos, GitHubTemplateOption } from "@/lib/api/github";

export function TechStack() {
  const form = useFormContext<FoundryFormValues>();

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
        const message = error instanceof Error ? error.message : String(error);
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
