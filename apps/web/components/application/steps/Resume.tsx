"use client";

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
  Input,
} from "@uwdsc/ui";

interface ResumeProps {
  readonly form: UseFormReturn<AppFormValues>;
}

export function Resume({ form }: ResumeProps) {
  return (
    <div className="space-y-6">
      <Form {...form}>
        <div className="space-y-6">
          {/* Resume URL */}
          <FormField
            control={form.control}
            name="resumeUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resume URL *</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://drive.google.com/..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Link to your resume (Google Drive, Dropbox, personal website,
                  etc.). Make sure the link is publicly accessible.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="rounded-lg bg-muted p-4">
            <h3 className="font-medium mb-2">Tips for sharing your resume:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
              <li>
                Ensure the link is publicly accessible (anyone with the link can
                view)
              </li>
              <li>Use Google Drive, Dropbox, or a personal website</li>
              <li>Test the link in an incognito window before submitting</li>
              <li>Make sure your resume is up to date</li>
            </ul>
          </div>
        </div>
      </Form>
    </div>
  );
}
