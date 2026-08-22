"use client";

import { useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Textarea,
  DateTimePicker,
  renderSelectField,
} from "@uwdsc/ui";
import {
  createEventSchema,
  type CreateEventFormValues,
  type UpdateEventFormValues,
} from "@/lib/schemas/event";
import { createEvent, updateEvent } from "@/lib/api/events";
import {
  EVENT_TIMEZONE_LABEL,
  pickerValueToUtcIso,
  utcIsoToPickerValue,
} from "@/lib/utils/events";
import type { Event } from "@uwdsc/common/types";
import { ResourceLinkRow } from "./ResourceLinkRow";

interface EventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event | null;
  onSuccess?: () => void;
}

const CATEGORY_OPTIONS = [
  { value: "workshop", label: "Workshop" },
  { value: "social", label: "Social" },
  { value: "academic", label: "Academic" },
];

export function EventForm({ open, onOpenChange, event, onSuccess }: Readonly<EventFormProps>) {
  const isEdit = !!event;

  const form = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      location: "",
      image_url: null,
      start_time: "",
      end_time: "",
      // `category` intentionally omitted: it's required with no default, so a new event starts
      // with the dropdown showing its placeholder rather than a preselected (and easy to miss)
      // value. Preselecting here would risk silently mis-tagging workshops as something else.
      resources: [],
    },
  });

  const category = useWatch({ control: form.control, name: "category" });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "resources",
  });

  // Only workshops may carry resource links -- clear them (and re-validate) whenever the type
  // is changed away from Workshop, so a stale link list can't be silently saved on a social or
  // academic event.
  useEffect(() => {
    if (category !== "workshop" && form.getValues("resources").length > 0) {
      form.setValue("resources", []);
      form.clearErrors("resources");
      void form.trigger();
    }
  }, [category, form]);

  useEffect(() => {
    if (open) {
      if (event) {
        form.reset({
          name: event.name,
          description: event.description,
          location: event.location,
          image_url: event.image_url ?? null,
          start_time: event.start_time,
          end_time: event.end_time,
          category: event.category,
          resources: event.resources ?? [],
        });
      } else {
        form.reset({
          name: "",
          description: "",
          location: "",
          image_url: null,
          start_time: "",
          end_time: "",
          resources: [],
        });
      }
    }
  }, [open, event, form]);

  const onSubmit = async (data: CreateEventFormValues) => {
    try {
      if (isEdit && event) {
        await updateEvent(event.id, data as UpdateEventFormValues);
        toast.success("Event updated successfully");
      } else {
        await createEvent(data);
        toast.success("Event created successfully");
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit event" : "Create event"}</DialogTitle>
          <DialogDescription>{isEdit ? "Update" : "Add"} event details.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Event name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="category"
              render={renderSelectField({
                label: "Event type",
                placeholder: "Select event type",
                required: true,
                options: CATEGORY_OPTIONS,
              })}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description"
                      rows={3}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-sm text-muted-foreground">
              All times are in {EVENT_TIMEZONE_LABEL}.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value ? utcIsoToPickerValue(field.value) : ""}
                        onChange={(value) =>
                          field.onChange(value ? pickerValueToUtcIso(value) : "")
                        }
                        placeholder="MM/DD/YYYY HH:MM"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value ? utcIsoToPickerValue(field.value) : ""}
                        onChange={(value) =>
                          field.onChange(value ? pickerValueToUtcIso(value) : "")
                        }
                        placeholder="MM/DD/YYYY HH:MM"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {form.formState.errors.end_time && (
              <p className="text-sm text-destructive">
                {form.formState.errors.end_time.message}
              </p>
            )}
            {category === "workshop" && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <FormLabel>Resources</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-md"
                    onClick={() => append({ id: crypto.randomUUID(), source: "", url: "" })}
                  >
                    <Plus className="mr-1.5 size-4" />
                    Add resource
                  </Button>
                </div>
                {fields.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No resources yet. Add slides, notebooks, or recap pages once they&apos;re
                    ready.
                  </p>
                )}
                <div className="flex flex-col gap-2">
                  {fields.map((field, index) => (
                    <ResourceLinkRow
                      key={field.id}
                      control={form.control}
                      index={index}
                      onRemove={() => remove(index)}
                    />
                  ))}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="rounded-md"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-md"
                disabled={!form.formState.isValid || form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                {isEdit ? "Save" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
