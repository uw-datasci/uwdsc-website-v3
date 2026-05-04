"use client";

import { Badge, ScrollArea, Separator } from "@uwdsc/ui";
import { User } from "lucide-react";
import type { OnboardingAdminRow } from "@uwdsc/common/types";

interface OnboardingDetailProps {
  readonly row: OnboardingAdminRow | null;
}

export function OnboardingDetail({ row }: OnboardingDetailProps) {
  if (!row) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <User className="h-12 w-12 mx-auto text-muted-foreground/40" />
          <p className="text-muted-foreground text-sm">
            Select a record to view details
          </p>
        </div>
      </div>
    );
  }

  const name = [row.first_name, row.last_name].filter(Boolean).join(" ") || "—";
  const position =
    row.submission_role_name || row.exec_position_name || row.user_role;
  const sub = row.submission;

  return (
    <ScrollArea className="h-full">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-3 flex-wrap pr-8 md:pr-0">
            <h2 className="text-xl md:text-2xl font-bold">{name}</h2>
            <Badge
              variant={sub ? "default" : "outline"}
              className={
                sub
                  ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-300"
                  : ""
              }
            >
              {sub ? "Submitted" : "Not Submitted"}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Badge variant="outline" className="text-xs">
              {row.user_role}
            </Badge>
            {position && position !== row.user_role && (
              <Badge variant="secondary" className="text-xs">
                {position}
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        {/* Contact info */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Contact</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Waterloo Email" value={row.email || "—"} />
            {sub && <Field label="Personal Email" value={sub.email || "—"} />}
            {sub && <Field label="Discord" value={sub.discord || "—"} />}
          </div>
        </div>

        {sub && (
          <>
            <Separator />

            {/* Term info */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Term Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Academic Term" value={sub.term_type || "—"} />
                <Field label="Location" value={sub.in_waterloo || "—"} />
                <Field
                  label="Data Science Competency"
                  value={String(sub.datasci_competency ?? "—")}
                />
                {sub && sub.consent_instagram && (
                  <Field label="Instagram" value={sub.instagram || "—"} />
                )}
              </div>
            </div>

            <Separator />

            {/* Headshot */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Headshot</h3>
              {sub.headshot_url && !sub.headshot_url.includes("team.png") ? (
                <a
                  href={sub.headshot_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-primary underline underline-offset-2 hover:text-primary/80"
                >
                  View file
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">None uploaded</p>
              )}
            </div>

            {sub.anything_else && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-semibold mb-3">
                    Additional Comments
                  </h3>
                  <div className="rounded-md bg-muted/50 p-3">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {sub.anything_else}
                    </p>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {!sub && (
          <>
            <Separator />
            <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
              This exec has not submitted onboarding yet.
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-medium mt-0.5">{value}</p>
    </div>
  );
}
