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
import { useCallback, useState, useEffect } from "react";
import { FileUp, Loader2, CheckCircle } from "lucide-react";
import { uploadHeadshot } from "@/lib/api/headshot";
import { stat } from "fs/promises";
import { set } from "zod";

const termtypeOptions = [
  { value: "study", label: "Study Term" },
  { value: "coop", label: "Co-op Term" },
];

// headshot upload constants
const IMAGE_ACCEPT = "image/jpeg,image/jpg,image/png,image/webp";
const IMAGE_MAX_MB = 5;


interface ExecProfileProps {
  readonly form: UseFormReturn<OnboardingFormValues>;
}

const positionOptions = EXEC_POSITIONS.map((pos) => pos.name);

export function ExecProfile({ form }: ExecProfileProps) {
  
  const consentWebsite = useWatch({
    control: form.control,
    name: "consent_website",
  });

   // "Clears" headshot if user revokes consent
  useEffect(() => {
    if (!consentWebsite) {
      form.setValue("headshot_url", "");
      setUploadError(null);
      setIsUploading(false);
    }
  }, [consentWebsite, form]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleHeadshotChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadError(null);

      if (file.size > IMAGE_MAX_MB * 1024 * 1024) {
        setUploadError(`File must be under ${IMAGE_MAX_MB} MB`);
        return;
      }

      const allowed = ["image/jpeg", "image/png", "image/webp"];
      if (!allowed.includes(file.type)) {
        setUploadError("Allowed formats: JPG, PNG, WEBP");
        return;
      }

      setIsUploading(true);

      try {
        const result = await uploadHeadshot(file);
        form.setValue("headshot_url", result.url, { shouldValidate: true });
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed");
        form.setValue("headshot_url", "");
      } finally {
        setIsUploading(false);
        e.target.value = "";
      }
    },
    [form],
  );

  const headshotUrl = form.watch("headshot_url");

  let statusIcon: React.ReactNode;
  if (isUploading) {
    statusIcon = <Loader2 className="w-10 h-10 animate-spin text-blue-400" />;
  } else if (headshotUrl) {
    statusIcon = <CheckCircle className="w-10 h-10 text-green-400" />;
  } else {
    statusIcon = <FileUp className="w-10 h-10 text-white/70" />;
  }

  let statusLabel: string;
  if (isUploading) {
    statusLabel = "Uploading...";
  } else if (headshotUrl) {
    statusLabel = "Headshot uploaded. Click to replace.";
  } else {
    statusLabel = "Drop your headshot here or click to upload";
  }

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
                  render={({ field }) => (
                    <div className="space-y-3">
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[var(--grey2)] rounded-lg cursor-pointer bg-[var(--grey4)] hover:bg-[var(--grey3)] transition-colors">
                        <input
                          type="file"
                          className="hidden"
                          accept={IMAGE_ACCEPT}
                          onChange={handleHeadshotChange}
                          disabled={isUploading}
                        />
                        {statusIcon}
                        <span className="mt-2 text-sm text-white/70">
                          {statusLabel}
                        </span>
                        <span className="mt-1 text-xs text-white/70">
                          JPG, PNG, WEBP (max {IMAGE_MAX_MB} MB)
                        </span>
                      </label>
                      <input type="hidden" {...field} value={field.value ?? ""} />
                      {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
                    </div>
                  )}
                />
              )}
            </CardContent>
          </Card>
        </Form>
      </div>
    );
}
