"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormField,
  renderCheckboxField,
  renderTextField,
} from "@uwdsc/ui";
import { submitMembershipProof, uploadMembershipProof } from "@/lib/api";
import {
  membershipSubmissionSchema,
  membershipSubmissionDefaultValues,
  type MembershipSubmissionFormValues,
} from "@/lib/schemas/membershipSubmission";
import type { MembershipSubmissionView } from "@uwdsc/common/types";
import { ProofUpload } from "./ProofUpload";

interface MembershipSubmissionFormProps {
  readonly defaults: Partial<MembershipSubmissionFormValues>;
  readonly isResubmission: boolean;
  readonly onSubmitted: (view: MembershipSubmissionView) => void;
}

export function MembershipSubmissionForm({
  defaults,
  isResubmission,
  onSubmitted,
}: MembershipSubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // The chosen file lives here until submit -- nothing reaches storage before then.
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofError, setProofError] = useState<string | null>(null);

  const form = useForm<MembershipSubmissionFormValues>({
    resolver: zodResolver(membershipSubmissionSchema),
    defaultValues: { ...membershipSubmissionDefaultValues, ...defaults },
    mode: "onTouched",
  });

  const handleFileChange = (file: File | null) => {
    setProofFile(file);
    if (file) setProofError(null);
  };

  const onSubmit = async (values: MembershipSubmissionFormValues) => {
    if (!proofFile) {
      setProofError("Please upload your proof of payment");
      return;
    }

    setSubmitError(null);
    setProofError(null);
    setIsSubmitting(true);
    try {
      // Upload first, then record the submission against the returned key.
      const uploaded = await uploadMembershipProof(proofFile);

      onSubmitted(
        await submitMembershipProof({
          ...values,
          proof_key: uploaded.key,
          proof_file_name: uploaded.file_name,
          proof_mime_type: uploaded.mime_type,
          proof_size_bytes: uploaded.size_bytes,
        })
      );
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isResubmission ? "Update your submission" : "Verify your membership"}
        </CardTitle>
        <CardDescription>
          Paid for your membership online? Upload your receipt and an exec will verify it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* items-start: FormItem is `grid gap-2`, so a cell would otherwise stretch
                to the tallest in its row (Email carries a description) and
                distribute that height across its own rows, dropping the
                WatIAM label and input below Email's. */}
            <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="first_name"
                render={renderTextField({
                  label: "First name",
                  placeholder: "Jane",
                  required: true,
                })}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={renderTextField({
                  label: "Last name",
                  placeholder: "Doe",
                  required: true,
                })}
              />
              <FormField
                control={form.control}
                name="wat_iam"
                render={renderTextField({
                  label: "WatIAM",
                  placeholder: "jdoe",
                  required: true,
                })}
              />
              <FormField
                control={form.control}
                name="program"
                render={renderTextField({
                  label: "Program",
                  placeholder: "Computer Science",
                  required: true,
                })}
              />
              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="contact_email"
                  render={renderTextField({
                    label: "Email",
                    placeholder: "jdoe@uwaterloo.ca",
                    required: true,
                    description: "Enter the email on the payment receipt",
                  })}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="is_coop_term"
              render={renderCheckboxField({
                label: "I'm on a co-op work term",
                description: "Check this if you're currently on co-op",
              })}
            />

            <ProofUpload
              file={proofFile}
              onFileChange={handleFileChange}
              error={proofError}
              disabled={isSubmitting}
            />

            {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>{isResubmission ? "Re-submit for review" : "Submit for review"}</>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
