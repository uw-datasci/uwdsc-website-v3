"use client";

import { Form, FormField } from "@uwdsc/ui";
import { UseFormReturn } from "react-hook-form";
import {
  renderComboboxField,
  renderSelectField,
  renderTextField,
} from "@/components/FormHelpers";
import AppSection from "../AppSection";
import { AppFormValues } from "@/lib/schemas/application";
import { useEffect } from "react";
import {
  GRADUATION_YEARS,
  PROGRAM_OPTIONS,
  UNIVERSITY_INFO_FIELDS,
  UNIVERSITY_OPTIONS,
} from "@/constants/application";

interface EducationProps {
  readonly form: UseFormReturn<AppFormValues>;
}

export function Education({ form }: EducationProps) {
  const universityName = form.watch("university_name");
  const programName = form.watch("program");

  useEffect(() => {
    if (universityName !== "Other") {
      form.setValue("university_name_other", "");
    }
  }, [universityName, form]);

  useEffect(() => {
    if (programName !== "Other") {
      form.setValue("program_other", "");
    }
  }, [programName, form]);

  return (
    <Form {...form}>
      <AppSection
        label="Education"
        description="You must be in post-secondary education to attend CxC!"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {/* University Name Column */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name={UNIVERSITY_INFO_FIELDS.university_name}
              render={renderComboboxField(
                "Select your university...",
                UNIVERSITY_OPTIONS,
                {
                  label: "University Name",
                  required: true,
                  searchPlaceholder: "Search universities...",
                  emptyMessage: "No university found.",
                  variant: "application",
                }
              )}
            />

            {universityName === "Other" && (
              <FormField
                control={form.control}
                name={UNIVERSITY_INFO_FIELDS.university_name_other}
                render={renderTextField("University Name", {
                  label: "Specify university name",
                  required: true,
                  variant: "application",
                })}
              />
            )}
          </div>

          {/* Program of Study Column */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name={UNIVERSITY_INFO_FIELDS.program}
              render={renderComboboxField(
                "Select your program...",
                PROGRAM_OPTIONS,
                {
                  label: "Program of Study",
                  required: true,
                  searchPlaceholder: "Search programs...",
                  emptyMessage: "No program found.",
                  variant: "application",
                }
              )}
            />

            {programName === "Other" && (
              <FormField
                control={form.control}
                name={UNIVERSITY_INFO_FIELDS.program_other}
                render={renderTextField("Program of Study", {
                  label: "Specify program of study",
                  required: true,
                  variant: "application",
                })}
              />
            )}
          </div>

          {/* Year of Study - spans both columns on mobile, single column on desktop */}
          <FormField
            control={form.control}
            name={UNIVERSITY_INFO_FIELDS.year_of_study}
            render={renderSelectField("Year of Study", GRADUATION_YEARS, {
              label: "Select your year of study",
              required: true,
              variant: "application",
            })}
          />
        </div>
      </AppSection>
    </Form>
  );
}
