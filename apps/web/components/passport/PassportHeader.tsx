import type { ReactNode } from "react";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Card,
  CardContent,
  Skeleton,
} from "@uwdsc/ui";

interface PassportHeaderProps {
  readonly initials: string;
  readonly displayName: string;
  readonly email: string | null | undefined;
  readonly membershipLoading: boolean;
  readonly isMember: boolean;
  /** Exec title from exec_team (e.g. position name); omit or null to hide. */
  readonly execPositionLabel?: string | null;
}

export function PassportHeader({
  initials,
  displayName,
  email,
  membershipLoading,
  isMember,
  execPositionLabel,
}: PassportHeaderProps) {
  let membershipBadge: ReactNode;

  if (membershipLoading) {
    membershipBadge = <Skeleton className="h-6 w-24 rounded-full" />;
  } else if (isMember) {
    membershipBadge = (
      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 rounded-full px-3 shadow-[0_0_14px_rgba(16,185,129,0.25)]">
        Active Member
      </Badge>
    );
  } else {
    membershipBadge = (
      <Badge
        variant="outline"
        className="bg-red-500/10 text-red-400 border-red-500/40 rounded-full px-3"
      >
        Not Paid
      </Badge>
    );
  }

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <div className="h-24 bg-linear-to-r from-primary/25 via-primary/10 to-background" />
      <CardContent>
        <div className="flex items-start gap-4">
          <Avatar className="size-16 shrink-0 border-4 border-background">
            <AvatarFallback className="bg-primary/15 text-primary text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-1 items-start justify-between gap-3 pt-1">
            <div className="min-w-0">
              <h1 className="text-xl font-bold truncate">{displayName}</h1>
              <p className="text-sm text-muted-foreground mt-0.5 truncate">
                {email}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 pt-0.5">
              {execPositionLabel ? (
                <Badge
                  className="max-w-[min(100%,16rem)] truncate rounded-full px-3 text-sm font-medium shadow-sm"
                  title={execPositionLabel}
                >
                  {execPositionLabel}
                </Badge>
              ) : null}
              {membershipBadge}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
