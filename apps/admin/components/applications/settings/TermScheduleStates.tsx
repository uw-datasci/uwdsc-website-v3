"use client";

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Spinner } from "@uwdsc/ui";

export function TermScheduleLoading() {
  return (
    <div className="flex min-h-[160px] items-center justify-center">
      <Spinner className="size-12 text-primary" />
    </div>
  );
}

interface TermScheduleForbiddenProps {
  readonly message: string;
}

export function TermScheduleForbidden({ message }: TermScheduleForbiddenProps) {
  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardHeader>
        <CardTitle className="text-destructive">Access restricted</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
    </Card>
  );
}

interface TermScheduleErrorProps {
  readonly message: string;
  readonly onRetry: () => void;
}

export function TermScheduleError({ message, onRetry }: TermScheduleErrorProps) {
  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle>Could not load the application schedule</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button type="button" variant="outline" onClick={onRetry}>
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}

export function TermScheduleEmpty() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">No active term</CardTitle>
        <CardDescription>
          A term is only active between its start and end dates. Create or activate a term
          before setting application deadlines.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
