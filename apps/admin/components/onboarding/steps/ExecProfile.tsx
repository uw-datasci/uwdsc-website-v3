"use client";
import { OnboardingFormValues } from "@/lib/schemas/onboarding";
import { EXEC_POSITIONS } from "@/constants/execPositions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormField,
  renderTextField,
  renderSelectField,
  renderRadioField,
} from "@uwdsc/ui";

import { UseFormReturn, useWatch } from "react-hook-form";

const termtypeOptions = [
  { value: "study", label: "Study Term" },
  { value: "coop", label: "Co-op Term" },
];


interface ExecProfileProps {
  readonly form: UseFormReturn<OnboardingFormValues>;
}

const positionOptions = EXEC_POSITIONS.map((pos) => pos.name);

export function ExecProfile({ form }: ExecProfileProps) {
  const consentWebsite = useWatch({
    control: form.control,
    name: "consent_website",
  });

  return (
    <div className="space-y-6 ">
      <Form {...form}>
        {/* Two Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left Column: Basic Information */}
          <Card className="border-white/20 bg-[var(--grey4)] h-full">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullname"
                render={renderTextField({
                  placeholder: "Enter your full name",
                  label: "Full Name",
                  required: true,
                })}
              />

              {/* Personal Email */}
              <FormField
                control={form.control}
                name="gmail"
                render={renderTextField({
                  placeholder: "johndoe@gmail.com",
                  label: "Personal Email Address",
                  required: true,
                  inputProps: { type: "email" },
                })}
              />
            </CardContent>
          </Card>
          
          {/* Right Column: Academic Information */}
          <Card className="border-gradient/80 bg-[var(--grey4)] h-full">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                Term Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Program */}
              <FormField
                control={form.control}
                name="term_type"
                render={renderSelectField({
                  placeholder: "Select your term type",
                  options: termtypeOptions,
                  label: "Academic/Work Term",
                  required: true,
                  triggerClassName: "w-full",
                  contentClassName: "bg-[var(--grey4)]",
                  itemClassName:
                    "text-slate-200 focus:bg-[var(--grey3)] focus:text-white hover:bg-[var(--grey3)] hover:text-white transition-colors",
                })}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="in_waterloo"
                render={renderTextField({
                  placeholder: "Will you be located in Waterloo next term?",
                  label: "Location Next Term",
                  required: true,
                })}
              />
            </CardContent>
          </Card>
        </div>
        <Card className="border-white/20 bg-[var(--grey4)]">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
                Exec Role 
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6"> 
              {/* Position */}
              <FormField
                control={form.control}  
                name="role"
                render={renderSelectField({
                  placeholder: "Select your executive position",
                  options: positionOptions,
                  label: "What is your Executive Position for this term?",
                  required: true,
                  triggerClassName: "w-full",
                  contentClassName: "bg-[var(--grey4)]",
                  itemClassName:
                    "text-slate-200 focus:bg-[var(--grey3)] focus:text-white hover:bg-[var(--grey3)] hover:text-white transition-colors",
                })}
              />
            </CardContent>
          </Card>
          <Card className="border-white/20 bg-[var(--grey4)]">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">Public Profile</CardTitle>
              </CardHeader>
            <CardContent className="space-y-6">
              {/* Headshot URL */}
              <FormField
                control={form.control}
                name="consent_website"
                render={({ field }) =>
                  renderRadioField({
                    label: "Can we display your headshot on our website?",
                    required: true,
                  })({ field })
                }
              />
              {consentWebsite && (
                <FormField
                  control={form.control}
                  name="headshot_url"
                  render={renderTextField({
                    placeholder: "Headshot URL",
                    label: "Headshot URL",
                  })}
                />
              )}
            </CardContent>
          </Card>
        </Form>
      </div>
    );
}
