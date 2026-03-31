"use client";

import {
  Badge,
  ScrollArea,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uwdsc/ui";
import type { NewExecTeamMember } from "@uwdsc/common/types";

interface NewExecTeamPanelProps {
  readonly team: NewExecTeamMember[];
  readonly loading: boolean;
}

/** Match ApplicantTable padding and column rhythm */
const headCell = "px-3 py-3 sm:px-4 first:pl-2 last:pr-2";
const bodyCell = "px-3 py-2.5 align-middle sm:px-4 first:pl-2 last:pr-2";

export function NewExecTeamPanel({ team, loading }: NewExecTeamPanelProps) {
  if (loading) {
    return (
      <div className="flex h-48 items-center px-4 sm:px-6">
        <p className="text-sm text-muted-foreground">Loading team...</p>
      </div>
    );
  }

  if (team.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center px-4 sm:px-6">
        <p className="text-center text-sm text-muted-foreground">
          No accepted offers yet. Update applicant statuses to &quot;Accepted
          Offer&quot; to build the new exec team.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="min-w-0 px-4 py-2 sm:px-6 sm:py-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={`min-w-[240px] text-left ${headCell}`}>
                Name
              </TableHead>
              <TableHead className={`min-w-[180px] text-left ${headCell}`}>
                Position
              </TableHead>
              <TableHead className={`min-w-[140px] text-left ${headCell}`}>
                Subteam
              </TableHead>
              <TableHead className={`w-[120px] text-left ${headCell}`}>
                Role
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {team.map((member) => (
              <TableRow key={`${member.profile_id}-${member.position_name}`}>
                <TableCell className={`font-medium ${bodyCell}`}>
                  {member.full_name}
                </TableCell>
                <TableCell className={bodyCell}>{member.position_name}</TableCell>
                <TableCell className={`text-muted-foreground ${bodyCell}`}>
                  {member.subteam_name ?? "N/A"}
                </TableCell>
                <TableCell className={bodyCell}>
                  <Badge
                    variant={
                      member.computed_role === "admin" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {member.computed_role}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
}
