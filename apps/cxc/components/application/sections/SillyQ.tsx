"use client";

import { Form, FormField } from "@uwdsc/ui";
import { UseFormReturn } from "react-hook-form";
import { renderTextAreaField } from "@/components/FormHelpers";
import AppSection from "../AppSection";
import { AppFormValues } from "@/lib/schemas/application";
import { APP_Q_FIELDS } from "@/constants/application";

interface SillyQProps {
  readonly form: UseFormReturn<AppFormValues>;
}

export function SillyQ({ form }: SillyQProps) {
  return (
    <Form {...form}>
      <AppSection>
        <FormField
          key="silly_q"
          control={form.control}
          name={APP_Q_FIELDS.silly_q}
          render={renderTextAreaField("Hmmmm", {
            label: "Silly Q Here (max 200 char)",
            required: true,
            variant: "application",
            textareaProps: {
              maxLength: 200,
            },
          })}
        />
      </AppSection>
    </Form>
  );
}
