"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  Checkbox,
  renderSelectField,
} from "@uwdsc/ui";
import {
  PROJECT_TYPES,
  DATABASE_OPTIONS,
  EXTRAS_OPTIONS,
} from "@/constants/foundry";
import type { FoundryFormValues } from "@/lib/schemas/foundry";

export function TechStack() {
  const form = useFormContext<FoundryFormValues>();

  return (
    <>
      <FormField
        control={form.control}
        name="projectType"
        render={renderSelectField({
          label: "Project Type",
          placeholder: "Choose a template…",
          required: true,
          options: PROJECT_TYPES.map((p) => ({ value: p.value, label: p.label })),
          triggerClassName: "w-full",
        })}
      />

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
              render={({ field }) => (
                <FormItem className="flex items-start gap-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value as boolean}
                      onCheckedChange={field.onChange}
                      className="mt-0.5"
                    />
                  </FormControl>
                  <div className="flex flex-col gap-0.5">
                    <FormLabel className="cursor-pointer">
                      {extra.label}
                    </FormLabel>
                    <FormDescription>{extra.description}</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>
    </>
  );
}
