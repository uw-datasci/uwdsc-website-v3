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
} from "@uwdsc/ui";

import { UseFormReturn } from "react-hook-form";

const termtypeOptions = [
  "Study Term",
  "Co-op Term",
];

const locationOptions = [
   "Waterloo",
   "Can Comunte to Waterloo",
   "Not in Waterloo",
];


interface PersonalProps {
  readonly form: UseFormReturn<OnboardingFormValues>;
}

const positionOptions = EXEC_POSITIONS.map((pos) => pos.name);

export function Personal({ form }: PersonalProps) {
  return (
    <div className="space-y-6 ">
      <Form {...form}>
        {/* Two Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Basic Information */}
          <Card className="border-white/20 bg-[var(--grey4)]">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                Basic Information
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
          <Card className="border-white/20 bg-[var(--grey4)]">
            <CardHeader>
              <CardTitle className="flex items-center text-xl rounded-t-xl -mt-6 py-4">
                Academic Information
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
                render={renderSelectField({
                  placeholder: "Where will you be located next term?",
                  options: locationOptions,
                  label: "Location Next Term",
                  required: true,
                  triggerClassName: "w-full",
                  contentClassName: "bg-[var(--grey4)]",
                  itemClassName:
                    "text-slate-200 focus:bg-[var(--grey3)] focus:text-white hover:bg-[var(--grey3)] hover:text-white transition-colors",
                })}
              />
            </CardContent>
          </Card>
        </div>
        <Card className="border-white/20 bg-[var(--grey4)]">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
                Exec Position 
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
        </Form>
      </div>
    );
}
