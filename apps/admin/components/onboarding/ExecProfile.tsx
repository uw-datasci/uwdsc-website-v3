"use client";
import { OnboardingFormValues } from "@/lib/schemas/onboarding";
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
import { useEffect } from "react";
import { FileUp } from "lucide-react";
import type { ExecPosition } from "@uwdsc/common/types";

const termtypeOptions = [
  { value: "study", label: "Study Term" },
  { value: "coop", label: "Co-op Term" },
];

// headshot upload constants
const IMAGE_ACCEPT = "image/jpeg,image/jpg,image/png,image/webp";
const IMAGE_MAX_MB = 5;

interface ExecProfileProps {
  readonly form: UseFormReturn<OnboardingFormValues>;
  readonly execPositions: ExecPosition[];
  readonly headshotFile: File | null;
  readonly onHeadshotFileChange: (file: File | null) => void;
  readonly isLocked?: boolean;
}

export function ExecProfile({
  form,
  execPositions,
  headshotFile,
  onHeadshotFileChange,
  isLocked = false,
}: ExecProfileProps) {
  const consentWebsite = useWatch({
    control: form.control,
    name: "consent_website",
  });

  useEffect(() => {
    if (!consentWebsite) {
      form.setValue("headshot_url", "");
      onHeadshotFileChange(null);
    }
  }, [consentWebsite, form, onHeadshotFileChange]);

  return (
    <div className="space-y-6 ">
      <Form {...form}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <Card className="h-full border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="fullname"
                render={renderTextField({
                  placeholder: "Enter your full name",
                  label: "Full Name",
                  required: true,
                })}
                disabled={true}
              />

              <FormField
                control={form.control}
                name="email"
                render={renderTextField({
                  placeholder: "johndoe@gmail.com",
                  label: "Personal Email Address",
                  required: true,
                  inputProps: { type: "email" },
                })}
              />
            </CardContent>
          </Card>

          <Card className="h-full border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                Term Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="term_type"
                render={renderSelectField({
                  placeholder: "Select your term type",
                  options: termtypeOptions,
                  label: "Academic/Work Term",
                  required: true,
                  disabled: isLocked,
                  triggerClassName: "w-full",
                  contentClassName: "bg-popover text-popover-foreground",
                  itemClassName:
                    "transition-colors hover:bg-accent/70 focus:bg-accent focus:text-accent-foreground",
                })}
              />

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

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              Exec Role
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="role_id"
              render={({ field }) =>
              renderSelectField({
                placeholder: "Select your executive position",
                options: execPositions.map((pos) => ({
                  value: String(pos.id),
                  label: pos.name,
                })),
                label: "What is your Executive Position for this term?",
                required: true,
                disabled: true,
                triggerClassName: "w-full",
                contentClassName:
                  "h-48 overflow-y-auto bg-popover text-popover-foreground",
                contentPosition: "popper",
                itemClassName:
                  "transition-colors hover:bg-accent/70 focus:bg-accent focus:text-accent-foreground",
              })({
                field: {
                  ...field,
                  value: String(field.value),
                  onChange: (v: string) => field.onChange(Number(v)),
                },
              })
            }
            />
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              Public Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
              <div className="space-y-3">
                <label
                  className={`flex h-40 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/40 transition-colors ${
                    isLocked ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-muted/80"
                  }`}
                >
                  <input
                    type="file"
                    className="hidden"
                    accept={IMAGE_ACCEPT}
                    disabled={isLocked}
                    onChange={(event) => {
                      if (isLocked) return;
                      onHeadshotFileChange(event.target.files?.[0] ?? null);
                    }}
                  />
                  <FileUp className="h-10 w-10 text-muted-foreground" />
                  <span className="mt-2 text-sm text-muted-foreground">
                    {headshotFile
                      ? headshotFile.name
                      : "Choose a headshot to upload when you save"}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">
                    JPG, PNG, WEBP (max {IMAGE_MAX_MB} MB)
                  </span>
                </label>

                {headshotFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected file: {headshotFile.name}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </Form>
    </div>
  );
}
