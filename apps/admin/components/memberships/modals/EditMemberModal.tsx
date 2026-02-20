"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateMember } from "@/lib/api";
import {
  editMemberSchema,
  type EditMemberFormValues,
} from "@/lib/schemas/membership";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Checkbox,
} from "@uwdsc/ui";
import { Member } from "@uwdsc/common/types";

interface EditMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member;
  onSuccess?: () => void;
}

const FACULTY_OPTIONS = [
  { value: "math", label: "Math" },
  { value: "engineering", label: "Engineering" },
  { value: "science", label: "Science" },
  { value: "arts", label: "Arts" },
  { value: "health", label: "Health" },
  { value: "environment", label: "Environment" },
  { value: "other_non_waterloo", label: "Other (Non-Waterloo)" },
] as const;

export function EditMemberModal({
  open,
  onOpenChange,
  member,
  onSuccess,
}: Readonly<EditMemberModalProps>) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditMemberFormValues>({
    resolver: zodResolver(editMemberSchema),
    defaultValues: {
      first_name: member.first_name || "",
      last_name: member.last_name || "",
      wat_iam: member.wat_iam || "",
      faculty: (member.faculty as EditMemberFormValues["faculty"]) || undefined,
      term: member.term || "",
      is_math_soc_member: member.is_math_soc_member || false,
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
      });
    }
  }, [open, member, form]);

  const onSubmit = async (data: EditMemberFormValues) => {
    setIsSubmitting(true);
    try {
      await updateMember(member.id, data);
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
            {/* First Name */}
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter first name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Last Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter last name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* WatIAM */}
            <FormField
              control={form.control}
              name="wat_iam"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WatIAM</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      placeholder="Enter WatIAM username"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Faculty */}
            <FormField
              control={form.control}
              name="faculty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faculty</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select faculty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FACULTY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Term */}
            <FormField
              control={form.control}
              name="term"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Term</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      placeholder="e.g., 1A, 2B, 4A"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
