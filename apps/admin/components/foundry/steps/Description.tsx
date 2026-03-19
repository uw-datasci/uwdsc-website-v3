"use client";

import { useFormContext } from "react-hook-form";
import { FormField, renderTextAreaField } from "@uwdsc/ui";
import { Bot } from "lucide-react";
import type { FoundryFormValues } from "@/lib/schemas/foundry";

export function Description() {
  const form = useFormContext<FoundryFormValues>();

  return (
    <FormField
      control={form.control}
      name="description"
      render={renderTextAreaField({
        label: (
          <div className="flex items-center gap-1.5">
            Description
            <Bot className="size-3.5 text-blue-500" />
          </div>
        ) as unknown as string,
        placeholder:
          "What are you building? Include goals, scope, and any relevant context.",
        required: true,
        description: (value) => `${value?.length ?? 0} / 1000 characters`,
        className: "min-h-48",
      })}
    />
  );
}
