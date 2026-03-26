"use client";

import {
  Badge,
  Card,
  Separator,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uwdsc/ui";
import {
  ExternalLink,
  User,
  MapPin,
  GraduationCap,
  Mail,
  Briefcase,
} from "lucide-react";
import type {
  ApplicationListItem,
  ApplicationReviewStatus,
  ApplicationStatus,
} from "@uwdsc/common/types";

function getStatusLabel(status: string): string {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getClubExperienceLabel(clubExperience: boolean | null): string {
  if (clubExperience === null) return "—";
  return clubExperience ? "Yes" : "No";
}

interface ApplicationDetailProps {
  readonly application: ApplicationListItem | null;
  readonly statusOptions?: readonly (
    | ApplicationStatus
    | ApplicationReviewStatus
  )[];
  readonly selectedStatus?: ApplicationStatus | ApplicationReviewStatus | null;
  readonly statusUpdating?: boolean;
  readonly onStatusChange?: (
    status: ApplicationStatus | ApplicationReviewStatus,
  ) => void;
}

export function ApplicationDetail({
  application,
  statusOptions,
  selectedStatus,
  statusUpdating = false,
  onStatusChange,
}: ApplicationDetailProps) {
  if (!application) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <User className="h-12 w-12 mx-auto text-muted-foreground/40" />
          <p className="text-muted-foreground text-sm">
            Select an application to view details
          </p>
        </div>
      </div>
    );
  }

  const clubExperienceLabel = getClubExperienceLabel(
    application.club_experience,
  );
  const showStatusSelect =
    !!statusOptions && statusOptions.length > 0 && !!onStatusChange;

  return (
    <ScrollArea className="h-full">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-3 flex-wrap pr-8 md:pr-0">
            <h2 className="text-xl md:text-2xl font-bold">
              {application.full_name}
            </h2>
            {showStatusSelect ? (
              <Select
                value={selectedStatus ?? application.status}
                onValueChange={onStatusChange}
                disabled={statusUpdating}
              >
                <SelectTrigger className="h-8 w-44">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {getStatusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="secondary" className="shrink-0">
                {getStatusLabel(application.status)}
              </Badge>
            )}
          </div>
          {application.submitted_at && (
            <p className="text-xs text-muted-foreground mt-1">
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

        {/* Personal info grid */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              value={clubExperienceLabel}
            />
            {application.resume_url && (
              <div className="flex items-center gap-2 text-sm">
                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Resume</p>
                  <a
                    href={application.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2 hover:text-primary/80 text-xs"
                  >
                    View Resume
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Position selections */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Position Selections</h3>
          {application.position_selections.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No positions selected.
            </p>
          ) : (
            <div className="space-y-2">
              {application.position_selections.map((sel) => (
                <Card key={sel.id} className="p-3 gap-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground w-5">
                      #{sel.priority}
                    </span>
                    <span className="font-medium text-sm">
                      {sel.position_name}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Answers */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Application Responses</h3>
          {application.answers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No responses submitted.
            </p>
          ) : (
            <div className="space-y-6">
              <AnswerSection
                heading="General"
                answers={application.answers.filter(
                  (answer) => answer.position_names.length === 0,
                )}
              />
              {application.position_selections
                .slice()
                .sort((a, b) => a.priority - b.priority)
                .map((selection) => (
                  <AnswerSection
                    key={selection.id}
                    heading={selection.position_name}
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

interface AnswerSectionProps {
  heading: string;
  answers: ApplicationListItem["answers"];
  numbered?: boolean;
}

function AnswerSection({
  heading,
  answers,
  numbered = false,
}: Readonly<AnswerSectionProps>) {
  if (answers.length === 0) return null;

  return (
    <div>
      <h4 className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-3">
        {heading}
      </h4>
      <div className="space-y-4">
        {answers.map((answer, index) => (
          <div key={answer.id}>
            <p className="text-sm font-medium mb-1">
              {numbered ? `${index + 1}. ` : ""}
              {answer.question_text}
            </p>
            <div className="rounded-md bg-muted/50 p-3">
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
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
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoItem({ icon, label, value }: Readonly<InfoItemProps>) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate">{value}</p>
      </div>
    </div>
  );
}
