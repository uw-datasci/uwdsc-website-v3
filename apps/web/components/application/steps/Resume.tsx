"use client";

import { useCallback, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { AppFormValues } from "@/lib/schemas/application";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@uwdsc/ui";
import { uploadResume } from "@/lib/api/resume";
import { FileUp, Loader2, CheckCircle } from "lucide-react";

interface ResumeProps {
  readonly form: UseFormReturn<AppFormValues>;
}

const ACCEPTED_TYPES = "application/pdf,.doc,.docx";
const MAX_SIZE_MB = 10;

export function Resume({ form }: ResumeProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadError(null);

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setUploadError(`File must be under ${MAX_SIZE_MB} MB`);
        return;
      }

      const allowed = ["application/pdf", "application/msword"];
      const docx =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      if (!allowed.includes(file.type) && file.type !== docx) {
        setUploadError("Allowed formats: PDF, DOC, DOCX");
        return;
      }

      setIsUploading(true);
      try {
        const result = await uploadResume(file);
        form.setValue("resumeKey", result.key, { shouldValidate: true });
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed");
        form.setValue("resumeKey", "");
      } finally {
        setIsUploading(false);
        e.target.value = "";
      }
    },
    [form],
  );

  const resumeKey = form.watch("resumeKey");

  let statusIcon: React.ReactNode;
  if (isUploading) {
    statusIcon = <Loader2 className="w-10 h-10 animate-spin text-blue-400" />;
  } else if (resumeKey) {
    statusIcon = <CheckCircle className="w-10 h-10 text-green-400" />;
  } else {
    statusIcon = <FileUp className="w-10 h-10 text-slate-400" />;
  }

  let statusLabel: string;
  if (isUploading) {
    statusLabel = "Uploading...";
  } else if (resumeKey) {
    statusLabel = "Resume uploaded. Click to replace.";
  } else {
    statusLabel = "Drop your resume here or click to upload";
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <FormField
          control={form.control}
          name="resumeKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume Upload *</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-500 rounded-lg cursor-pointer bg-slate-800/50 hover:bg-slate-800 transition-colors">
                    <input
                      type="file"
                      className="hidden"
                      accept={ACCEPTED_TYPES}
                      onChange={handleFileChange}
                      disabled={isUploading}
                    />
                    {statusIcon}
                    <span className="mt-2 text-sm text-slate-300">
                      {statusLabel}
                    </span>
                    <span className="mt-1 text-xs text-slate-500">
                      PDF, DOC, or DOCX (max {MAX_SIZE_MB} MB)
                    </span>
                  </label>
                  <input type="hidden" {...field} />
                </div>
              </FormControl>
              <FormDescription>
                Upload your resume as a PDF or Word document. It will be shared with the
                selection committee.
              </FormDescription>
              {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>

      <div className="rounded-lg bg-muted p-4">
        <h3 className="font-medium mb-2">Tips for your resume:</h3>
        <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
          <li>Keep it to 1-2 pages</li>
          <li>Highlight relevant experience and skills</li>
          <li>Make sure your contact information is up to date</li>
          <li>Proofread before uploading</li>
        </ul>
      </div>
    </div>
  );
}
