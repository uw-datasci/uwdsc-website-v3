"use client";

import { Form, FormField } from "@uwdsc/ui";
import { UseFormReturn } from "react-hook-form";
import { renderSelectField, renderTextField } from "@/components/FormHelpers";
import AppSection from "../AppSection";
import { AppFormValues } from "@/lib/schemas/application";
import { useEffect } from "react";
import {
  DIETARY_OPTIONS,
  OPTIONAL_ABOUT_YOU_FIELDS,
  TSHIRT_OPTIONS,
} from "@/constants/application";

interface AboutYouProps {
  readonly form: UseFormReturn<AppFormValues>;
}

export function AboutYou({ form }: AboutYouProps) {
  const dietaryRestriction = form.watch("dietary_restrictions");

  useEffect(() => {
    if (dietaryRestriction !== "Other") {
      form.setValue("dietary_restrictions_other", "");
    }
  }, [dietaryRestriction, form]);

  return (
    <Form {...form}>
      <AppSection label="About you">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <FormField
            control={form.control}
            name={OPTIONAL_ABOUT_YOU_FIELDS.tshirt_size}
            render={renderSelectField("T-Shirt Size", TSHIRT_OPTIONS, {
              label: "Select your T-shirt size",
              required: true,
              variant: "application",
            })}
          />
          {/* TODO: Should this be multiselect? having 'other' might work as is*/}
          <FormField
            control={form.control}
            name={OPTIONAL_ABOUT_YOU_FIELDS.dietary_restrictions}
            render={renderSelectField("Dietary Restrictions", DIETARY_OPTIONS, {
              label: "Select any dietary restrictions",
              required: true,
              variant: "application",
            })}
          />

          {dietaryRestriction === "Other" && (
            <div className="md:col-start-2">
              <FormField
                control={form.control}
                name={OPTIONAL_ABOUT_YOU_FIELDS.dietary_restrictions_other}
                render={renderTextField("Other Dietary Restriction", {
                  label: "Please specify dietary restrictions",
                  variant: "application",
                })}
              />
            </div>
          )}
        </div>
      </AppSection>
    </Form>
  );
}
