"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormField,
  renderTextField,
  renderRadioField,
  renderScaleField,
} from "@uwdsc/ui";
import { UseFormReturn } from "react-hook-form";
import { OnboardingFormValues } from "@/lib/schemas/onboarding";
import { useWatch } from "react-hook-form";

interface GeneralProps {
  readonly form: UseFormReturn<OnboardingFormValues>;
}

export function General({ form }: GeneralProps) {
  const consentInstagram = useWatch({
    control: form.control,
    name: "consent_instagram",
  });

  return (
    <div className="space-y-6 py-8">
      <Form {...form}>
        <div className="grid grid-cols-1 gap-6">
          {/* Socials + consent card */}
          <Card className="border-white/20 bg-[var(--grey4)] h-full">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                Socials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 h-full flex flex-col">
              <FormField
                control={form.control}
                name="discord"
                render={renderTextField({
                  placeholder: "Please enter your Discord username",
                  label: "Discord",
                  required: true,
                })}
              />

              <FormField
                control={form.control}
                name="consent_instagram"
                render={({ field }) =>
                  renderRadioField({
                    label: "Can we tag you on Instagram on our posts?",
                    required: true,
                  })({ field })
                }
              />

              {consentInstagram && (
                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) =>
                    renderTextField({
                      placeholder: "Instagram username",
                      label: "Instagram Handle",
                    })({
                      field: {
                        ...field,
                        value: field.value ?? "",
                      },
                    })}
              />)}
            </CardContent>
          </Card>

          {/* Technical Background*/}
          <Card className="border-white/20 bg-[var(--grey4)]">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                Technical Background
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 h-full flex flex-col">
              <FormField
                control={form.control}
                name="datasci_competency"
                render={({ field }) =>
                  renderScaleField({
                    label: "Data Science Competency",
                    labels: [
                      "None",
                      "Beginner",
                      "Intermediate",
                      "Advanced",
                      "Expert",
                    ],
                    required: true,
                  })({
                    field: {
                      ...field,
                      value: String(field.value), // convert number → string for display
                      onChange: (v: string) => field.onChange(Number(v)), // convert string → number for storage
                    },
                  })
                }
              />
            </CardContent>
          </Card>
        </div>
        {/* Additional Comments */}
        <Card className="border-white/20 bg-[var(--grey4)]">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              Additional Comments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="anything_else"
              render={({ field }) =>
                renderTextField({
                placeholder: "",
                label: "Anything else we should know?",
              })({
                    field: {
                       ...field,
                        value: field.value ?? "",
                    },
                  })
                }
              />
          </CardContent>
        </Card>
      </Form>
    </div>
  );
}
