"use client";

import { useFormContext } from "react-hook-form";
import {
  cn,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  renderSelectField,
  renderTextField,
  Spinner,
} from "@uwdsc/ui";
import { FOUNDRY_DOMAIN } from "@/constants/foundry";
import {
  FOUNDRY_SUBDOMAIN_MAX_LEN,
  type FoundryFormValues,
} from "@/lib/schemas/foundry";
import { getGitHubTeams, GitHubTeam } from "@/lib/api/github";
import { useEffect, useState } from "react";

export function ProjectDetails() {
  const form = useFormContext<FoundryFormValues>();

  const [teams, setTeams] = useState<GitHubTeam[] | null>(null);
  const [teamsError, setTeamsError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const fetchedTeams = await getGitHubTeams();
        if (!mounted) return;
        setTeams(fetchedTeams);
        setTeamsError(null);
      } catch (error: unknown) {
        if (!mounted) return;
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load GitHub teams";
        setTeams([]);
        setTeamsError(message);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (teams === null)
    return (
      <div className="flex items-center justify-center w-full py-10">
        <Spinner className="size-16 text-primary" />
      </div>
    );

  return (
    <>
      {teamsError && (
        <p className="text-sm text-destructive mb-4">{teamsError}</p>
      )}
      <FormField
        control={form.control}
        name="projectName"
        render={renderTextField({
          label: "Project Name",
          placeholder: "my-cool-project",
          required: true,
          description: "Lowercase kebab-case - this becomes your repo slug.",
        })}
      />

      <FormField
        control={form.control}
        name="subdomain"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="mb-1">Subdomain (optional)</FormLabel>
            <FormControl>
              <div
                className={cn(
                  "flex h-9 min-w-0 w-full rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] outline-none",
                  "dark:bg-input/30",
                  "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
                  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
                )}
              >
                <Input
                  {...field}
                  placeholder="my-project"
                  maxLength={FOUNDRY_SUBDOMAIN_MAX_LEN}
                  autoComplete="off"
                  spellCheck={false}
                  className="h-9 min-w-0 flex-1 rounded-none rounded-l-md border-0 bg-transparent px-3 py-1 shadow-none focus-visible:ring-0 dark:bg-transparent md:text-sm"
                />
                <span
                  className="flex h-9 shrink-0 items-center border-l border-input px-3 text-sm text-muted-foreground md:text-sm"
                  aria-hidden
                >
                  .{FOUNDRY_DOMAIN}
                </span>
              </div>
            </FormControl>
            <FormDescription>
              This will be the full hostname for your project
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="teamAccess"
        render={renderSelectField({
          label: "GitHub Team",
          placeholder: "Choose a team…",
          required: true,
          options: teams.map((t) => ({ value: t.value, label: t.label })),
          triggerClassName: "w-full",
        })}
      />
    </>
  );
}
