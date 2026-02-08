"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { markMemberAsPaid } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  markAsPaidSchema,
  type MarkAsPaidFormValues,
} from "@/lib/schemas/membership";
import type { MemberProfile } from "@/types/api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@uwdsc/ui";

interface MarkAsPaidModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: MemberProfile;
  onSuccess?: () => void;
}

function getMemberDisplayName(member: MemberProfile): string {
  const name = [member.first_name, member.last_name].filter(Boolean).join(" ");
  return name || member.email;
}

const PAYMENT_METHOD_OPTIONS = [
  { value: "cash", label: "Cash" },
  { value: "online", label: "Online" },
  { value: "math_soc", label: "MathSoc" },
] as const;

export function MarkAsPaidModal({
  open,
  onOpenChange,
  member,
  onSuccess,
}: Readonly<MarkAsPaidModalProps>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  // Get the verifier name from the current user's profile
  const verifierName =
    user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : user?.email || "Unknown";

  const form = useForm<MarkAsPaidFormValues>({
    resolver: zodResolver(markAsPaidSchema),
    defaultValues: {
      payment_method: undefined,
      payment_location: "",
      verifier: verifierName,
    },
  });

  // Update verifier when profile changes
  if (form.getValues("verifier") !== verifierName) {
    form.setValue("verifier", verifierName);
  }

  const onSubmit = async (data: MarkAsPaidFormValues) => {
    setIsSubmitting(true);
    try {
      await markMemberAsPaid(member.id, data);
      toast.success("Member marked as paid successfully");
      onOpenChange(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      onOpenChange(false);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to mark member as paid";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Mark as paid</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {getMemberDisplayName(member)}
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Payment Method */}
            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Payment Method <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PAYMENT_METHOD_OPTIONS.map((option) => (
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

            {/* Payment Location */}
            <FormField
              control={form.control}
              name="payment_location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Payment Location <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., DSC Office, SLC, Online"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Verifier (disabled, auto-populated) */}
            <FormField
              control={form.control}
              name="verifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verified By</FormLabel>
                  <FormControl>
                    <Input {...field} disabled className="bg-muted" />
                  </FormControl>
                  <FormMessage />
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
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
