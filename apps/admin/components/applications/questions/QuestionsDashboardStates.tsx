"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Spinner,
} from "@uwdsc/ui";

export function QuestionsDashboardLoading() {
  return (
    <div className="flex min-h-[240px] items-center justify-center">
      <Spinner className="size-12 text-primary" />
    </div>
  );
}

interface QuestionsDashboardForbiddenProps {
  readonly message: string;
}

export function QuestionsDashboardForbidden({
  message,
}: QuestionsDashboardForbiddenProps) {
  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardHeader>
        <CardTitle className="text-destructive">Access restricted</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
    </Card>
  );
}

interface QuestionsDashboardErrorProps {
  readonly message: string;
  readonly onRetry: () => void;
}

export function QuestionsDashboardError({
  message,
  onRetry,
}: QuestionsDashboardErrorProps) {
  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle>Could not load questions</CardTitle>
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
