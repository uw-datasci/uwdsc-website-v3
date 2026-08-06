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

export function PositionsManagementLoading() {
  return (
    <div className="flex min-h-[240px] items-center justify-center">
      <Spinner className="size-12 text-primary" />
    </div>
  );
}

interface PositionsManagementForbiddenProps {
  readonly message: string;
}

export function PositionsManagementForbidden({
  message,
}: PositionsManagementForbiddenProps) {
  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardHeader>
        <CardTitle className="text-destructive">Access restricted</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
    </Card>
  );
}

interface PositionsManagementErrorProps {
  readonly message: string;
  readonly onRetry: () => void;
}

export function PositionsManagementError({
  message,
  onRetry,
}: PositionsManagementErrorProps) {
  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle>Could not load positions</CardTitle>
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
