"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Form,
  FormField,
} from "@uwdsc/ui";
import { UseFormReturn } from "react-hook-form";
import { AppFormValues } from "@/lib/schemas/application";
import { GraduationCap } from "lucide-react";
import {
  renderSelectFieldWithLabel as renderSelectField,
  renderTextFieldWithLabel as renderTextField,
} from "@/components/FormHelpers";
import { useEffect } from "react";

interface EducationProps {
  readonly form: UseFormReturn<AppFormValues>;
}

const graduationYears = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "5th Year+",
];

const programOptions = [
  "Computer Science",
  "Data Science",
  "Mathematics",
  "Engineering",
  "Sciences",
  "Arts",
  "Business",
  "Health/Life Sciences",
  "Other",
];

const universityOptions = [
  "Acadia University",
  "Bishop’s University",
  "Brandon University",
  "Brock University",
  "Cape Breton University",
  "Carleton University",
  "Concordia University",
  "Dalhousie University",
  "École Polytechnique de Montréal",
  "HEC Montréal",
  "Lakehead University",
  "Laurentian University",
  "MacEwan University",
  "McGill University",
  "McMaster University",
  "Memorial University of Newfoundland",
  "Mount Allison University",
  "Mount Royal University",
  "Mount Saint Vincent University",
  "Ontario Tech University",
  "Queen’s University",
  "Saint Mary’s University",
  "Simon Fraser University",
  "St. Francis Xavier University",
  "St. Thomas University",
  "Thompson Rivers University",
  "Toronto Metropolitan University",
  "Trent University",
  "Université de Montréal",
  "Université du Québec à Chicoutimi",
  "Université du Québec à Montréal",
  "Université du Québec à Rimouski",
  "Université du Québec à Trois-Rivières",
  "Université du Québec en Abitibi-Témiscamingue",
  "Université du Québec en Outaouais",
  "Université Laval",
  "University of Alberta",
  "University of British Columbia",
  "University of Calgary",
  "University of Guelph",
  "University of King’s College",
  "University of Lethbridge",
  "University of Manitoba",
  "University of New Brunswick",
  "University of Northern British Columbia",
  "University of Ottawa",
  "University of Prince Edward Island",
  "University of Regina",
  "University of Saskatchewan",
  "University of Toronto",
  "University of Victoria",
  "University of Waterloo",
  "University of Western Ontario",
  "Wilfrid Laurier University",
  "York University",
  "Yukon University",
  "Other",
];

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
    <div className="space-y-6">
      <Form {...form}>
        <Card className="border-white/20 bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <GraduationCap className="mr-2 h-5 w-5 text-blue-300" />
              Education Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* University Name */}
            <FormField
              control={form.control}
              name="university_name"
              render={renderSelectField(
                "University Name",
                "Select your university name",
                universityOptions
              )}
            />

            {universityName === "Other" && (
              <FormField
                control={form.control}
                name="university_name_other"
                render={renderTextField(
                  "Please specify your university name",
                  "Enter your university name"
                )}
              />
            )}

            {/* Program of Study */}
            <FormField
              control={form.control}
              name="program"
              render={renderSelectField(
                "Program of Study",
                "Select your program of study",
                programOptions
              )}
            />

            {programName === "Other" && (
              <FormField
                control={form.control}
                name="program_other"
                render={renderTextField(
                  "Please specify your program of study",
                  "Enter your program of study"
                )}
              />
            )}

            {/* Year of Study */}
            <FormField
              control={form.control}
              name="year_of_study"
              render={renderSelectField(
                "Year of Study",
                "Select your year of study",
                graduationYears
              )}
            />
          </CardContent>
        </Card>
      </Form>
    </div>
  );
}
