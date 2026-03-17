"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  renderSelectField,
  renderTextField,
  Spinner,
} from "@uwdsc/ui";
import type { FoundryFormValues } from "@/lib/schemas/foundry";
import { getGitHubOrgTeams, GitHubTeam } from "@/lib/api/github";
import { useEffect, useState } from "react";

export function ProjectDetails() {
  const form = useFormContext<FoundryFormValues>();

  const [teams, setTeams] = useState<GitHubTeam[] | null>(null);

  useEffect(() => {
    getGitHubOrgTeams().then(setTeams);
  }, []);

  if (teams === null) return <Spinner className="text-muted-foreground" />;

  return (
    <>
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
