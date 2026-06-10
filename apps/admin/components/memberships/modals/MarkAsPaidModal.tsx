"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { markMemberAsPaid } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { markAsPaidSchema, type MarkAsPaidFormValues } from "@/lib/schemas/membership";
import { CalendarCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Event, Member } from "@uwdsc/common/types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Checkbox,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
  renderTextField,
  renderSelectField,
} from "@uwdsc/ui";

interface MarkAsPaidModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member;
  activeEvent?: Event | null;
  onSuccess?: () => void;
}

function getMemberDisplayName(member: Member): string {
  const name = [member.first_name, member.last_name].filter(Boolean).join(" ");
  return name || member.email;
}

const PAYMENT_METHOD_OPTIONS = ["cash", "online", "math_soc"];

export function MarkAsPaidModal({
  open,
  onOpenChange,
  member,
  activeEvent,
  onSuccess,
}: Readonly<MarkAsPaidModalProps>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkIn, setCheckIn] = useState(true);
  const { user } = useAuth();

  // Get the verifier name from the current user's profile
  const verifierName =
    user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : user?.email || "Unknown";

  const form = useForm<MarkAsPaidFormValues>({
    resolver: zodResolver(markAsPaidSchema),
    mode: "onChange",
    defaultValues: {
      payment_method: undefined,
      payment_location: activeEvent?.name ?? "",
      verifier: user?.id ?? "",
    },
  });

  // Update verifier when profile changes
  if (form.getValues("verifier") !== (user?.id ?? "")) {
    form.setValue("verifier", user?.id ?? "");
  }

  const onSubmit = async (data: MarkAsPaidFormValues) => {
    setIsSubmitting(true);
    // Only check in when there's an active event and the exec left it enabled.
    const eventToCheckInto = checkIn ? activeEvent : null;
    try {
      const { checked_in, check_in_error } = await markMemberAsPaid(member.id, {
        ...data,
        event_id: eventToCheckInto?.id,
      });

      if (eventToCheckInto && checked_in) {
        toast.success(`Marked as paid and checked in to ${eventToCheckInto.name}`);
      } else if (eventToCheckInto) {
        // Paid succeeded but the check-in didn't — make both clear.
        toast.success("Member marked as paid");
        toast.warning(check_in_error ?? "Couldn't check the member in");
      } else {
        toast.success("Member marked as paid successfully");
      }

      onOpenChange(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      onOpenChange(false);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to mark member as paid";
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
      <DialogContent className="sm:max-w-125" aria-describedby="mark-as-paid-modal">
        <DialogHeader>
          <DialogTitle>Mark as paid</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">{getMemberDisplayName(member)}</p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="payment_method"
                render={renderSelectField({
                  label: "Payment Method",
                  placeholder: "Select payment method",
                  options: PAYMENT_METHOD_OPTIONS,
                  required: true,
                })}
              />

              <FormField
                control={form.control}
                name="payment_location"
                render={renderTextField({
                  label: "Payment Location",
                  placeholder: "e.g., DSC Office, SLC, Online",
                  required: true,
                })}
              />
            </div>

            <FormField
              control={form.control}
              name="verifier"
              render={({ field }) => (
                <>
                  <input type="hidden" {...field} />
                  <FormItem>
                    <FormLabel>Verified By</FormLabel>
                    <FormControl>
                      <Input value={verifierName} disabled className="bg-muted" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />

            {activeEvent && (
              <label
                htmlFor="markpaid-checkin"
                className="flex w-full cursor-pointer items-start gap-3 rounded-lg border border-primary/40 bg-primary/5 p-3 transition-colors hover:bg-primary/10"
              >
                <Checkbox
                  id="markpaid-checkin"
                  checked={checkIn}
                  onCheckedChange={(value) => setCheckIn(value === true)}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <CalendarCheck className="h-4 w-4 text-primary" />
                    Check in to active event
                  </div>
                  <p className="text-sm text-muted-foreground">{activeEvent.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Leave unchecked if the member isn&apos;t at the event.
                  </p>
                </div>
              </label>
            )}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !form.formState.isValid}>
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
