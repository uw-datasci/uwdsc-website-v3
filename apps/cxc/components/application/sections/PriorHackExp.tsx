"use client";

import { Form, FormField } from "@uwdsc/ui";
import { UseFormReturn } from "react-hook-form";
import {
  renderCheckboxGroupField,
  renderSelectField,
  renderTextField,
} from "@/components/FormHelpers";
import {
  HACKER_EXPERIENCE_OPTIONS,
  NUMBER_HACKATHONS,
  PRIOR_HACK_EXP_FIELDS,
} from "@/constants/application";
import AppSection from "../AppSection";
import { AppFormValues } from "@/lib/schemas/application";

interface PriorHackExpProps {
  readonly form: UseFormReturn<AppFormValues>;
}

export function PriorHackExp({ form }: PriorHackExpProps) {
  return (
    <Form {...form}>
      <AppSection label="Prior hackathon experience">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <FormField
            control={form.control}
            name={PRIOR_HACK_EXP_FIELDS.prior_hackathon_experience}
            render={renderCheckboxGroupField(HACKER_EXPERIENCE_OPTIONS, {
              label: "Past Roles",
              required: true,
            })}
          />

          <div className="row-start-2">
            <FormField
              control={form.control}
              name={PRIOR_HACK_EXP_FIELDS.hackathons_attended}
              render={renderSelectField("Hackathons Attended", NUMBER_HACKATHONS, {
                label: "Number of Hackathons Attended",
                required: true,
                variant: "application",
              })}
            />
          </div>
        </div>
      </AppSection>
    </Form>
  );
}
