"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactSchema,
  contactDefaultValues,
  type ContactFormValues,
} from "@/lib/schemas/contact";
import { submitContact } from "@/lib/api/contact";
import { renderTextField, renderTextAreaField, Button, Form, FormField } from "@uwdsc/ui";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function ContactForm() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: contactDefaultValues,
    mode: "onTouched",
  });

  useEffect(() => {
    if (!user) return;
    const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
    form.setValue("name", fullName);
    form.setValue("email", user.email);
  }, [user, form]);

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitError("");
    setIsLoading(true);
    try {
      await submitContact({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      });
      setSubmitSuccess(true);
      form.reset({ name: data.name, email: data.email, subject: "", message: "" });
    } catch (error: unknown) {
      const err = error as { error?: string; message?: string };
      setSubmitError(
        err?.error ?? err?.message ?? "An unexpected error occurred. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <p className="text-lg font-semibold text-white">Message sent!</p>
        <p className="text-gray-400 text-sm">
          Thanks for reaching out. We&apos;ll get back to you soon.
        </p>
        <Button
          variant="outline"
          className="mt-2 border-gray-100/40 text-gray-200 hover:bg-white/10"
          onClick={() => setSubmitSuccess(false)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full min-w-0 flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={renderTextField({
            label: "Name",
            placeholder: "Your name",
            inputProps: { disabled: true, readOnly: true },
          })}
        />
        <FormField
          control={form.control}
          name="email"
          render={renderTextField({
            label: "Email",
            placeholder: "Your email",
            inputProps: { disabled: true, readOnly: true },
          })}
        />
        <FormField
          control={form.control}
          name="subject"
          render={renderTextField({
            label: "Subject",
            required: true,
            placeholder: "What's this about?",
          })}
        />
        <FormField
          control={form.control}
          name="message"
          render={renderTextAreaField({
            label: "Message",
            required: true,
            placeholder: "Write your message here...",
          })}
        />
        {submitError && <div className="text-red-400 text-base mt-1">{submitError}</div>}
        <div className="mt-2">
          <Button
            size="lg"
            disabled={isLoading || !form.formState.isValid}
            type="submit"
            className="h-auto! w-full touch-manipulation rounded-md bg-gradient-purple py-2.5 text-base font-bold sm:text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" strokeWidth={3} />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
