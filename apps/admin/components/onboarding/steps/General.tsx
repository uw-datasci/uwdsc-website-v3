"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormField,
  renderTextField,
  renderRadioField,
} from "@uwdsc/ui";
import { UseFormReturn } from "react-hook-form";
import { OnboardingFormValues as AppFormValues } from "@/lib/schemas/onboarding";

interface GeneralProps {
  readonly form: UseFormReturn<AppFormValues>;
}

export function General({ form }: GeneralProps) {
  return (
    <div className="space-y-6 py-8">
        <Form {...form} >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Socials card */}
            <Card className="border-white/20 bg-[var(--grey4)] h-full">
            <CardHeader>
                <CardTitle className="flex items-center text-xl">Socials</CardTitle>
            </CardHeader>
                <CardContent className="space-y-6 h-full flex flex-col">
                <FormField
                control={form.control}
                name="instagram"
                render={renderTextField({
                    placeholder: "Instagram username",
                    label: "Instagram",
                })}
                />
                <FormField
                control={form.control}
                name="discord"
                render={renderTextField({
                    placeholder: "Discord username",
                    label: "Discord",
                })}
                />
                </CardContent>
            </Card>

            {/* Consent card */}
            <Card className="border-white/20 bg-[var(--grey4)] h-full">
            <CardHeader>
                <CardTitle className="flex items-center text-xl">Consent</CardTitle>
            </CardHeader>
                <CardContent className="space-y-6 h-full flex flex-col justify-between">
                <FormField
                control={form.control}
                name="consent_instagram"
                render={renderRadioField({
                    label: "Can we tag you on Instagram?",
                })}
                />
                <FormField
                control={form.control}
                name="consent_website"
                render={renderRadioField({
                    label: "Can we display your headshot on our website?",
                })}
                />
                </CardContent>
            </Card>
        </div>
        {/* Final inputs card (no header) */}
            <Card className="border-white/20 bg-[var(--grey4)]">
                <CardContent className="space-y-6">
                    <FormField
                    control={form.control}
                    name="headshot_url"
                    render={renderTextField({
                        placeholder: "Headshot URL",
                        label: "Headshot URL",
                    })}
                    />
                    <FormField
                    control={form.control}
                    name="anything_else"
                    render={renderTextField({
                        placeholder: "Anything else we should know?",
                        label: "Additional Comments",
                    })}
                    />
                </CardContent>
            </Card>
        </Form>
    </div>
  );
}
