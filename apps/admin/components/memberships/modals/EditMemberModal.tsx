"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getSubteams, updateMember, updateMemberRole } from "@/lib/api";
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
  roleRequiresSubteam,
} from "@uwdsc/common/constants";
import { Member, SubteamOption } from "@uwdsc/common/types";

const editMemberFormSchema = editMemberSchema
  .extend({
    role: z.enum(ROLE_VALUES).optional(),
    subteam_id: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hasSubteam = Boolean(data.subteam_id);
    if (roleRequiresSubteam(data.role) && !hasSubteam) {
      ctx.addIssue({
        code: "custom",
        path: ["subteam_id"],
        message: "Select a subteam for this role",
      });
    }
    if (!roleRequiresSubteam(data.role) && hasSubteam) {
      ctx.addIssue({
        code: "custom",
        path: ["subteam_id"],
        message: "This role cannot have a subteam",
      });
    }
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
  const [subteams, setSubteams] = useState<SubteamOption[]>([]);
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
      subteam_id: member.subteam_id != null ? String(member.subteam_id) : "",
    },
  });

  const selectedRole = useWatch({ control: form.control, name: "role" });
  const roleNeedsSubteam = roleRequiresSubteam(selectedRole);
  const showSubteam = canEditRole && roleNeedsSubteam;

  // Reset form when member changes or modal opens
  useEffect(() => {
    if (open) {
      form.reset({
        first_name: member.first_name || "",
        last_name: member.last_name || "",
        wat_iam: member.wat_iam || "",
        faculty: (member.faculty as EditMemberFormValues["faculty"]) || undefined,
        term: member.term || "",
        is_math_soc_member: member.is_math_soc_member || false,
        role: member.user_role,
        subteam_id: member.subteam_id != null ? String(member.subteam_id) : "",
      });
    }
  }, [open, member, form]);

  // Only the President can reassign roles, so only they need the subteam list.
  useEffect(() => {
    if (!open || !canEditRole) return;

    let cancelled = false;
    getSubteams()
      .then((data) => {
        if (!cancelled) setSubteams(data);
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to load subteams");
      });

    return () => {
      cancelled = true;
    };
  }, [open, canEditRole]);

  // `member` and `alum` carry no subteam (enforced by the DB check constraint), so
  // drop a stale selection when the role is switched to one of them.
  useEffect(() => {
    if (!roleNeedsSubteam && form.getValues("subteam_id")) {
      form.setValue("subteam_id", "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [roleNeedsSubteam, form]);

  const onSubmit = async (data: EditMemberFormValues) => {
    setIsSubmitting(true);
    try {
      const { role, subteam_id, ...profileData } = data;
      await updateMember(member.id, profileData);

      const subteamId = subteam_id ? Number(subteam_id) : null;
      const roleChanged = Boolean(role) && role !== member.user_role;
      const subteamChanged = subteamId !== member.subteam_id;

      if (canEditRole && role && (roleChanged || subteamChanged)) {
        await updateMemberRole(member.id, role, subteamId);
      }
      toast.success("Member updated successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      onOpenChange(false);
      const errorMessage = error instanceof Error ? error.message : "Failed to update member";
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

            {showSubteam && (
              <FormField
                control={form.control}
                name="subteam_id"
                render={({ field }) =>
                  renderSelectField({
                    label: "Subteam",
                    placeholder: "Select subteam",
                    required: true,
                    options: subteams.map((subteam) => ({
                      value: String(subteam.id),
                      label: subteam.name,
                    })),
                    triggerClassName: "w-full",
                  })({ field: { ...field, value: field.value ?? "" } })
                }
              />
            )}

            {/* MathSoc Member */}
            <FormField
              control={form.control}
              name="is_math_soc_member"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
