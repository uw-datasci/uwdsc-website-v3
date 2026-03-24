"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  renderSelectField,
  renderTextField,
  Spinner,
} from "@uwdsc/ui";
import type { FoundryFormValues } from "@/lib/schemas/foundry";
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
          description: "Lowercase kebab-case — this becomes your repo slug.",
        })}
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
