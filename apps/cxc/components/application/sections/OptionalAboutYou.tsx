"use client";

import { Form, FormField } from "@uwdsc/ui";
import { UseFormReturn } from "react-hook-form";
import { renderSelectField } from "@/components/FormHelpers";
import AppSection from "../AppSection";
import { AppFormValues } from "@/lib/schemas/application";
import { useEffect } from "react";
import {
  ETHNICITIES,
  GENDERS,
  OPTIONAL_ABOUT_YOU_FIELDS,
} from "@/constants/application";

interface OptionalAboutYouProps {
  readonly form: UseFormReturn<AppFormValues>;
}

export function OptionalAboutYou({ form }: OptionalAboutYouProps) {
  const dietaryRestriction = form.watch("dietary_restrictions");

  useEffect(() => {
    if (dietaryRestriction !== "Other") {
      form.setValue("dietary_restrictions_other", "");
    }
  }, [dietaryRestriction, form]);

  return (
    <Form {...form}>
      <AppSection
        label="Optional"
        description="These are used for analytical purposes only."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <FormField
            control={form.control}
            name={OPTIONAL_ABOUT_YOU_FIELDS.gender}
            render={renderSelectField("Select Gender", GENDERS, {
              label: "Select your gender",
              variant: "application",
            })}
          />

          <FormField
            control={form.control}
            name={OPTIONAL_ABOUT_YOU_FIELDS.ethnicity}
            render={renderSelectField("Select Ethnicity", ETHNICITIES, {
              label: "Select your ethnicity",
              variant: "application",
            })}
          />
        </div>
      </AppSection>
    </Form>
  );
}
