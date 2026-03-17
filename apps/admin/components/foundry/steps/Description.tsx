"use client";

import { useFormContext } from "react-hook-form";
import { FormField, renderTextAreaField } from "@uwdsc/ui";
import type { FoundryFormValues } from "@/lib/schemas/foundry";

export function Description() {
  const form = useFormContext<FoundryFormValues>();

  return (
    <FormField
      control={form.control}
      name="description"
      render={renderTextAreaField({
        label: "Description",
        placeholder:
          "What are you building? Include goals, scope, and any relevant context.",
        required: true,
        description: (value) => `${value?.length ?? 0} / 1000 characters`,
        className: "min-h-48",
      })}
    />
  );
}
