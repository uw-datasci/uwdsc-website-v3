"use client";

import {
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@uwdsc/ui";
import {
  Briefcase,
  ExternalLink,
  GraduationCap,
  Mail,
  MapPin,
  User,
} from "lucide-react";
import type {
  ApplicationListItem,
  ApplicationReviewStatus,
} from "@uwdsc/common/types";
import { sortPositionSelectionsByPriority } from "@uwdsc/common/utils";

interface ReviewDetailProps {
  readonly application: ApplicationListItem | null;
  readonly statusOptions: readonly ApplicationReviewStatus[];
  readonly selectedStatus: ApplicationReviewStatus | null;
  readonly statusUpdating: boolean;
  readonly onStatusChange: (status: ApplicationReviewStatus) => void;
}

function getClubExperienceLabel(value: boolean | null): string {
  if (value === null) return "—";
  return value ? "Yes" : "No";
}

export function ReviewDetail({
  application,
  statusOptions,
  selectedStatus,
  statusUpdating,
  onStatusChange,
}: ReviewDetailProps) {
  if (!application) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="space-y-2 text-center">
          <User className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            Select an application to review details
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-4 md:p-6">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3 pr-8 md:pr-0">
            <h2 className="text-xl font-bold md:text-2xl">
              {application.full_name}
            </h2>
            <Select
              value={selectedStatus ?? ""}
              onValueChange={(value) =>
                onStatusChange(value as ApplicationReviewStatus)
              }
              disabled={!selectedStatus || statusUpdating}
            >
              <SelectTrigger className="h-8 w-48">
                <SelectValue placeholder="Update review status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {application.submitted_at && (
            <p className="mt-1 text-xs text-muted-foreground">
              Submitted{" "}
              {new Date(application.submitted_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>

        <Separator />

        <div>
          <h3 className="mb-3 text-sm font-semibold">Personal Information</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {application.personal_email && (
              <InfoItem
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={application.personal_email}
              />
            )}
            {application.major && (
              <InfoItem
                icon={<GraduationCap className="h-4 w-4" />}
                label="Program"
                value={application.major}
              />
            )}
            {application.year_of_study && (
              <InfoItem
                icon={<Briefcase className="h-4 w-4" />}
                label="Year"
                value={application.year_of_study}
              />
            )}
            {application.location && (
              <InfoItem
                icon={<MapPin className="h-4 w-4" />}
                label="Location"
                value={application.location}
              />
            )}
            <InfoItem
              icon={<User className="h-4 w-4" />}
              label="Club Experience"
              value={getClubExperienceLabel(application.club_experience)}
            />
            {application.resume_url && (
              <div className="flex items-center gap-2 text-sm">
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Resume</p>
                  <a
                    href={application.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary underline underline-offset-2 hover:text-primary/80"
                  >
                    View Resume
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="mb-3 text-sm font-semibold">Application Responses</h3>
          {application.answers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No responses submitted.
            </p>
          ) : (
            <div className="space-y-6">
              <AnswersGroup
                title="General"
                answers={application.answers.filter(
                  (answer) => answer.position_names.length === 0,
                )}
              />
              {sortPositionSelectionsByPriority(
                application.position_selections,
              ).map((selection) => (
                <AnswersGroup
                  key={selection.id}
                  title={selection.position_name}
                  answers={application.answers.filter((answer) =>
                    answer.position_names.includes(selection.position_name),
                  )}
                  numbered
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}

interface AnswersGroupProps {
  readonly title: string;
  readonly answers: ApplicationListItem["answers"];
  readonly numbered?: boolean;
}

function AnswersGroup({ title, answers, numbered = false }: AnswersGroupProps) {
  if (answers.length === 0) return null;

  return (
    <div>
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h4>
      <div className="space-y-4">
        {answers.map((answer, index) => (
          <div key={answer.id}>
            <p className="mb-1 text-sm font-medium">
              {numbered ? `${index + 1}. ` : ""}
              {answer.question_text}
            </p>
            <div className="rounded-md bg-muted/50 p-3">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {answer.answer_text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface InfoItemProps {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly value: string;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="shrink-0 text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate">{value}</p>
      </div>
    </div>
  );
}
