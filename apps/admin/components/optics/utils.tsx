import type { RaftSeverity } from "@uwdsc/common/types";
import { Badge } from "@uwdsc/ui";

const SEVERITY_VARIANT: Record<
  RaftSeverity,
  "default" | "secondary" | "destructive" | "outline"
> = {
  fatal: "destructive",
  error: "destructive",
  warning: "outline",
  info: "secondary",
  debug: "secondary",
};

export function SeverityBadge({ severity }: { readonly severity: RaftSeverity }) {
  return (
    <Badge variant={SEVERITY_VARIANT[severity]} className="capitalize">
      {severity}
    </Badge>
  );
}

export function formatRaftDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function truncateText(text: string, max = 80): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}…`;
}
