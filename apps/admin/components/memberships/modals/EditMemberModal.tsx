"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateMember, updateMemberRole } from "@/lib/api";
import { editMemberSchema } from "@/lib/schemas/membership";
import { useAuth } from "@/contexts/AuthContext";
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
import {
  FACULTY_VALUES,
  ROLE_VALUES,
  ROLE_SELECT_OPTIONS,
  isPresident,
} from "@uwdsc/common/constants";
import { Member } from "@uwdsc/common/types";

const editMemberFormSchema = editMemberSchema.extend({
  role: z.enum(ROLE_VALUES).optional(),
});
type EditMemberFormValues = z.infer<typeof editMemberFormSchema>;

interface EditMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member;
  onSuccess?: () => void;
}

export function EditMemberModal({
  open,
  onOpenChange,
  member,
  onSuccess,
}: Readonly<EditMemberModalProps>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const canEditRole = isPresident(user?.role);

  const form = useForm<EditMemberFormValues>({
    resolver: zodResolver(editMemberFormSchema),
    defaultValues: {
      first_name: member.first_name || "",
      last_name: member.last_name || "",
      wat_iam: member.wat_iam || "",
      faculty: (member.faculty as EditMemberFormValues["faculty"]) || undefined,
      term: member.term || "",
      is_math_soc_member: member.is_math_soc_member || false,
      role: member.user_role,
    },
  });

  // Reset form when member changes or modal opens
  useEffect(() => {
    if (open) {
      form.reset({
        first_name: member.first_name || "",
        last_name: member.last_name || "",
        wat_iam: member.wat_iam || "",
        faculty:
          (member.faculty as EditMemberFormValues["faculty"]) || undefined,
        term: member.term || "",
        is_math_soc_member: member.is_math_soc_member || false,
        role: member.user_role,
      });
    }
  }, [open, member, form]);

  const onSubmit = async (data: EditMemberFormValues) => {
    setIsSubmitting(true);
    try {
      const { role, ...profileData } = data;
      await updateMember(member.id, profileData);
      if (canEditRole && role && role !== member.user_role) {
        await updateMemberRole(member.id, role);
      }
      toast.success("Member updated successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      onOpenChange(false);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update member";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  // Check if form has been modified
  const isDirty = form.formState.isDirty;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-150 max-h-[90vh] overflow-y-auto"
        aria-describedby="edit-member-modal"
      >
        <DialogHeader>
          <DialogTitle>Edit member</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">{member.email}</p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) =>
                  renderTextField({
                    label: "First Name",
                    placeholder: "Enter first name",
                    required: true,
                  })({ field })
                }
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) =>
                  renderTextField({
                    label: "Last Name",
                    placeholder: "Enter last name",
                    required: true,
                  })({ field })
                }
              />
            </div>

            {/* WatIAM & Term */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="wat_iam"
                render={({ field }) =>
                  renderTextField({
                    label: "WatIAM",
                    placeholder: "Enter WatIAM username",
                  })({ field: { ...field, value: field.value ?? "" } })
                }
              />
              <FormField
                control={form.control}
                name="term"
                render={({ field }) =>
                  renderTextField({
                    label: "Term",
                    placeholder: "e.g., 1A, 2B, 4A",
                  })({ field: { ...field, value: field.value ?? "" } })
                }
              />
            </div>

            {/* Faculty & Role (Role is President only) */}
            <div className={canEditRole ? "grid grid-cols-2 gap-4" : undefined}>
              <FormField
                control={form.control}
                name="faculty"
                render={({ field }) =>
                  renderSelectField({
                    label: "Faculty",
                    placeholder: "Select faculty",
                    options: [...FACULTY_VALUES],
                    triggerClassName: "w-full",
                  })({ field: { ...field, value: field.value ?? "" } })
                }
              />
              {canEditRole && (
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) =>
                    renderSelectField({
                      label: "Role",
                      placeholder: "Select role",
                      options: ROLE_SELECT_OPTIONS,
                      triggerClassName: "w-full",
                    })({ field: { ...field, value: field.value ?? "" } })
                  }
                />
              )}
            </div>

            {/* MathSoc Member */}
            <FormField
              control={form.control}
              name="is_math_soc_member"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>MathSoc Member</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Is this member part of MathSoc?
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
              <Button type="submit" disabled={isSubmitting || !isDirty}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
