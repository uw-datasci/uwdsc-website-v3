"use client";

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
import { UseFormReturn } from "react-hook-form";
import { AppFormValues } from "@/lib/schemas/application";
import { GraduationCap, User } from "lucide-react";

interface PersonalProps {
  readonly form: UseFormReturn<AppFormValues>;
}
const locationOptions = [
  "Study Term",
  "Co-op Term in Waterloo",
  "Co-op Term but can commute to Waterloo",
  "Co-op term not in Waterloo",
];

const terms = ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B"];

export function Personal({ form }: PersonalProps) {
  return (
    <div className="space-y-6">
      <Form {...form}>
        {/* Two Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Basic Information */}
          <Card className="border-white/20 bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <User className="mr-2 h-5 w-5 text-blue-300" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="full_name"
                render={renderTextField({
                  placeholder: "Enter your full name",
                  label: "Full Name",
                  required: true,
                })}
              />

              {/* Personal Email */}
              <FormField
                control={form.control}
                name="personal_email"
                render={renderTextField({
                  placeholder: "johndoe@gmail.com",
                  label: "Personal Email Address",
                  required: true,
                  inputProps: { type: "email" },
                })}
              />

              {/* UWaterloo Email */}
              <FormField
                control={form.control}
                name="waterloo_email"
                render={renderTextField({
                  placeholder: "jdoe@uwaterloo.ca",
                  label: "UW Email Address",
                  required: true,
                  inputProps: { type: "email" },
                })}
              />
            </CardContent>
          </Card>

          {/* Right Column: Academic Information */}
          <Card className="border-white/20 bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <GraduationCap className="mr-2 h-5 w-5 text-blue-300" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Program */}
              <FormField
                control={form.control}
                name="program"
                render={renderTextField({
                  placeholder: "Computer Science",
                  label: "Program",
                  required: true,
                })}
              />

              {/* Academic Term */}
              <FormField
                control={form.control}
                name="academic_term"
                render={renderSelectField({
                  placeholder: "Select your academic term",
                  options: terms,
                  label: "Academic Term (Current or Most Recent)",
                  required: true,
                  triggerClassName: "w-full",
                  contentClassName: "bg-slate-700",
                  itemClassName:
                    "text-slate-200 focus:bg-slate-600 focus:text-white hover:bg-slate-600 hover:text-white transition-colors",
                })}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={renderSelectField({
                  placeholder: "Select where you will be next term",
                  options: locationOptions,
                  label: "Location Next Term",
                  required: true,
                  triggerClassName: "w-full",
                  contentClassName: "bg-slate-700",
                  itemClassName:
                    "text-slate-200 focus:bg-slate-600 focus:text-white hover:bg-slate-600 hover:text-white transition-colors",
                })}
              />
            </CardContent>
          </Card>

          {/* Bottom: Club Experience Information */}
          <Card className="md:col-span-2 border-white/20 bg-slate-800">
            <CardHeader>
              <CardTitle className="text-xl">Club Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="club_experience"
                render={renderRadioField({
                  label:
                    "Have you been a member of UW Data Science Club before?",
                  required: true,
                })}
              />
            </CardContent>
          </Card>
        </div>
      </Form>
    </div>
  );
}
