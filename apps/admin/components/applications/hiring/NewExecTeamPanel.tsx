"use client";

import {
  Badge,
  Card,
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

export function NewExecTeamPanel({ team, loading }: NewExecTeamPanelProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted-foreground">Loading team...</p>
      </Card>
    );
  }

  if (team.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted-foreground">
          No accepted offers yet. Update applicant statuses to &quot;Accepted
          Offer&quot; to build the new exec team.
        </p>
      </Card>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Subteam</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {team.map((member) => (
          <TableRow key={`${member.profile_id}-${member.position_name}`}>
            <TableCell className="font-medium">{member.full_name}</TableCell>
            <TableCell>{member.position_name}</TableCell>
            <TableCell className="text-muted-foreground">
              {member.subteam_name ?? "N/A"}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  member.computed_role === "admin" ? "default" : "secondary"
                }
              >
                {member.computed_role}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
