"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Separator,
  RadioGroup,
  RadioGroupItem,
} from "@uwdsc/ui";
import { Loader2, RotateCcw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAvailablePositionsForReturningExec,
  getOwnReturningExecSubmission,
  upsertReturningExecSubmission,
  type AvailablePosition,
} from "@/lib/api/returningExecs";

/** Radix Select forbids `SelectItem value=""`; map this sentinel to cleared optional choices in form state. */
const NO_POSITION_SELECT_VALUE = "__none__";

const returningExecSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    full_name: z.string().min(1, "Full name is required"),
    discord: z.string().min(1, "Discord handle is required").max(64),
    past_positions: z
      .string()
      .min(1, "Please list your past positions and terms"),
    interested_in_returning: z.enum(["true", "false"]),
    not_returning_reason: z.string().optional(),
    first_choice_position: z.string().optional(),
    second_choice_position: z.string().optional(),
    third_choice_position: z.string().optional(),
    in_person_next_term: z.enum(["true", "false"]).optional(),
    qualifications: z.string().optional(),
    additional_notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const isReturning = data.interested_in_returning === "true";
    if (!isReturning) {
      if (!data.not_returning_reason?.trim()) {
        ctx.addIssue({
          path: ["not_returning_reason"],
          code: z.ZodIssueCode.custom,
          message:
            "Please provide a brief explanation for not returning (optional but encouraged)",
        });
      }
    } else {
      if (!data.first_choice_position) {
        ctx.addIssue({
          path: ["first_choice_position"],
          code: z.ZodIssueCode.custom,
          message: "Please select at least a first choice position",
        });
      }
      if (!data.in_person_next_term) {
        ctx.addIssue({
          path: ["in_person_next_term"],
          code: z.ZodIssueCode.custom,
          message: "Please indicate whether you will be in person",
        });
      }
      if (!data.qualifications?.trim()) {
        ctx.addIssue({
          path: ["qualifications"],
          code: z.ZodIssueCode.custom,
          message: "Please describe why you are interested/qualified",
        });
      }
    }
  });

type ReturningExecFormValues = z.infer<typeof returningExecSchema>;

export default function ReturningExecFormPage() {
  const { user } = useAuth();
  const [positions, setPositions] = useState<AvailablePosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ReturningExecFormValues>({
    resolver: zodResolver(returningExecSchema),
    defaultValues: {
      email: "",
      full_name: "",
      discord: "",
      past_positions: "",
      interested_in_returning: "true",
      not_returning_reason: "",
      first_choice_position: "",
      second_choice_position: "",
      third_choice_position: "",
      in_person_next_term: undefined,
      qualifications: "",
      additional_notes: "",
    },
  });

  const interestedInReturning = form.watch("interested_in_returning");
  const isReturning = interestedInReturning === "true";

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [positionsData, submissionData] = await Promise.all([
          getAvailablePositionsForReturningExec(),
          getOwnReturningExecSubmission(),
        ]);
        setPositions(positionsData);

        const sub = submissionData.submission;
        if (sub) {
          setSubmitted(true);
          const sel = sub.position_selections ?? [];
          const pick = (p: 1 | 2 | 3) =>
            String(
              sel.find((s) => s.priority === p)?.position_id ?? "",
            );
          form.reset({
            email: sub.email,
            full_name: sub.full_name,
            discord: sub.discord,
            past_positions: sub.past_positions,
            interested_in_returning: sub.interested_in_returning
              ? "true"
              : "false",
            not_returning_reason: sub.not_returning_reason ?? "",
            first_choice_position: pick(1),
            second_choice_position: pick(2),
            third_choice_position: pick(3),
            in_person_next_term: sub.in_person_next_term ? "true" : "false",
            qualifications: sub.qualifications,
            additional_notes: sub.additional_notes ?? "",
          });
        } else if (user) {
          form.setValue(
            "full_name",
            [user.first_name, user.last_name].filter(Boolean).join(" "),
          );
          form.setValue("email", user.email ?? "");
        }
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to load form data",
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, form]);

  async function onSubmit(values: ReturningExecFormValues) {
    setSubmitting(true);
    try {
      const isRet = values.interested_in_returning === "true";
      const positionSelections: { position_id: number; priority: 1 | 2 | 3 }[] =
        [];
      if (isRet) {
        if (values.first_choice_position)
          positionSelections.push({
            position_id: Number(values.first_choice_position),
            priority: 1,
          });
        if (values.second_choice_position)
          positionSelections.push({
            position_id: Number(values.second_choice_position),
            priority: 2,
          });
        if (values.third_choice_position)
          positionSelections.push({
            position_id: Number(values.third_choice_position),
            priority: 3,
          });
      }

      await upsertReturningExecSubmission({
        term_id: "",
        email: values.email,
        full_name: values.full_name,
        discord: values.discord,
        past_positions: values.past_positions,
        interested_in_returning: isRet,
        not_returning_reason: isRet
          ? null
          : (values.not_returning_reason ?? null),
        in_person_next_term: values.in_person_next_term === "true",
        qualifications: values.qualifications ?? "",
        additional_notes: values.additional_notes ?? null,
        position_selections: positionSelections,
      });

      setSubmitted(true);
      toast.success(
        submitted ? "Response updated successfully" : "Response submitted",
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to submit response",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const positionOptions = positions.map((p) => ({
    value: String(p.position_id),
    label: p.name,
  }));

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold">Returning Exec Form</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Let us know whether you&apos;re interested in returning next term.
          {submitted && " Your response has been saved — you can update it anytime."}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email address <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Full name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="discord"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Discord handle <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="username#0000 or username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="past_positions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      List all positions &amp; terms you&apos;ve been on at UWDSC{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. VP Marketing (W25), Events Lead (F24)"
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Return Interest</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="interested_in_returning"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Are you interested in returning and building on your
                      impact? <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex gap-6 pt-1"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="true" id="ret-yes" />
                          <label htmlFor="ret-yes" className="text-sm">
                            Yes
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="false" id="ret-no" />
                          <label htmlFor="ret-no" className="text-sm">
                            No
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isReturning && (
                <FormField
                  control={form.control}
                  name="not_returning_reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Please provide a brief explanation{" "}
                        <span className="text-muted-foreground">(Optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share any context you'd like us to know"
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          {isReturning && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Role Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="first_choice_position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          First choice role{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select
                          value={field.value || undefined}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a position" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {positionOptions.map((p) => (
                              <SelectItem key={p.value} value={p.value}>
                                {p.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="second_choice_position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Second choice role{" "}
                          <span className="text-muted-foreground">(Optional)</span>
                        </FormLabel>
                        <Select
                          value={
                            field.value
                              ? field.value
                              : NO_POSITION_SELECT_VALUE
                          }
                          onValueChange={(v) =>
                            field.onChange(
                              v === NO_POSITION_SELECT_VALUE ? "" : v,
                            )
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a position" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={NO_POSITION_SELECT_VALUE}>
                              None
                            </SelectItem>
                            {positionOptions.map((p) => (
                              <SelectItem key={p.value} value={p.value}>
                                {p.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="third_choice_position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Third choice role{" "}
                          <span className="text-muted-foreground">(Optional)</span>
                        </FormLabel>
                        <Select
                          value={
                            field.value
                              ? field.value
                              : NO_POSITION_SELECT_VALUE
                          }
                          onValueChange={(v) =>
                            field.onChange(
                              v === NO_POSITION_SELECT_VALUE ? "" : v,
                            )
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a position" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={NO_POSITION_SELECT_VALUE}>
                              None
                            </SelectItem>
                            {positionOptions.map((p) => (
                              <SelectItem key={p.value} value={p.value}>
                                {p.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="in_person_next_term"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Will you be in person next term?{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="flex gap-6 pt-1"
                          >
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="true" id="ip-yes" />
                              <label htmlFor="ip-yes" className="text-sm">
                                Yes
                              </label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="false" id="ip-no" />
                              <label htmlFor="ip-no" className="text-sm">
                                No
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="qualifications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Why are you interested/qualified for the role?{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={
                              "• Led events team for two terms\n• Grew workshop attendance by 40%\n• Strong relationships with sponsors"
                            }
                            className="resize-none font-mono text-sm"
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="additional_notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Anything you would like us to know?{" "}
                          <span className="text-muted-foreground">(Optional)</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any additional context..."
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </>
          )}

          <Separator />

          <div className="flex justify-end gap-3">
            {submitted && (
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={submitting}
              >
                <RotateCcw className="size-4" />
                Reset
              </Button>
            )}
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {submitted ? "Updating..." : "Submitting..."}
                </>
              ) : submitted ? (
                "Update Response"
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
