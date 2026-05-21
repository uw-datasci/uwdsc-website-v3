"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inviteMember } from "@/lib/api";
import { inviteMemberSchema, type InviteMemberFormValues } from "@/lib/schemas/membership";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Button,
  Checkbox,
  renderTextField,
  renderSelectField,
} from "@uwdsc/ui";
import { FACULTY_VALUES } from "@uwdsc/common/constants";

interface InviteMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const EMPTY_VALUES: InviteMemberFormValues = {
  email: "",
  first_name: "",
  last_name: "",
  wat_iam: "",
  faculty: undefined,
  term: "",
  is_math_soc_member: false,
};

export function InviteMemberModal({
  open,
  onOpenChange,
  onSuccess,
}: Readonly<InviteMemberModalProps>) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InviteMemberFormValues>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (open) {
      form.reset(EMPTY_VALUES);
    }
  }, [open, form]);

  const onSubmit = async (data: InviteMemberFormValues) => {
    setIsSubmitting(true);
    try {
      await inviteMember(data);
      toast.success("Invitation sent. They’ll get an email to finish signup.");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send invitation";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset(EMPTY_VALUES);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-150 max-h-[90vh] overflow-y-auto"
        aria-describedby="invite-member-modal"
      >
        <DialogHeader>
          <DialogTitle>Add member</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1" id="invite-member-modal">
            Send an invite email. After they accept, they can complete their profile on the main
            site.
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) =>
                renderTextField({
                  label: "Email",
                  placeholder: "member@uwaterloo.ca",
                  required: true,
                  description: "Must be a @uwaterloo.ca address (same as self-serve signup).",
                  inputProps: { type: "email", autoComplete: "email" },
                })({ field: { ...field, value: field.value ?? "" } })
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) =>
                  renderTextField({
                    label: "First name",
                    placeholder: "Optional",
                  })({ field: { ...field, value: field.value ?? "" } })
                }
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) =>
                  renderTextField({
                    label: "Last name",
                    placeholder: "Optional",
                  })({ field: { ...field, value: field.value ?? "" } })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="wat_iam"
                render={({ field }) =>
                  renderTextField({
                    label: "WatIAM",
                    placeholder: "Optional",
                  })({ field: { ...field, value: field.value ?? "" } })
                }
              />
              <FormField
                control={form.control}
                name="term"
                render={({ field }) =>
                  renderTextField({
                    label: "Term",
                    placeholder: "e.g., 1A, 2B",
                  })({ field: { ...field, value: field.value ?? "" } })
                }
              />
            </div>

            <FormField
              control={form.control}
              name="faculty"
              render={({ field }) =>
                renderSelectField({
                  label: "Faculty",
                  placeholder: "Optional",
                  options: [...FACULTY_VALUES],
                  triggerClassName: "w-full",
                })({ field: { ...field, value: field.value ?? "" } })
              }
            />

            <FormField
              control={form.control}
              name="is_math_soc_member"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>MathSoc member</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Optional - prefilled on their profile after signup.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send invite"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
