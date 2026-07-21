import type { TicketSource } from "@uwdsc/common/types";
import { Badge } from "@uwdsc/ui";

const SOURCE_LABEL: Record<TicketSource, string> = {
  contact_form: "Contact form",
  email: "Email",
};

const SOURCE_VARIANT: Record<TicketSource, "default" | "secondary" | "outline"> = {
  contact_form: "secondary",
  email: "outline",
};

export function SourceBadge({ source }: { readonly source: TicketSource }) {
  return <Badge variant={SOURCE_VARIANT[source]}>{SOURCE_LABEL[source]}</Badge>;
}

export function formatTicketDate(iso: string): string {
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
