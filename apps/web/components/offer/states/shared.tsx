import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import type { PublicOfferView } from "@uwdsc/common/types";
import { Button } from "@uwdsc/ui";

export function StateBadge({
  className,
  children,
}: {
  readonly className: string;
  readonly children: ReactNode;
}) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[13px] font-semibold ${className}`}>
      {children}
    </span>
  );
}

export function BackButton({ onClick }: { readonly onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      className="-my-2 -ml-3 h-11 self-start text-muted-foreground"
      onClick={onClick}
    >
      <ChevronLeft aria-hidden />
      Back to offer
    </Button>
  );
}

export function StepHeading({ title }: { readonly title: string }) {
  return (
    <div>
      <div className="text-[13px] font-semibold text-muted-foreground">
        Step 2 of 2 · Confirm
      </div>
      <h1 className="mt-1.5 text-[26px] leading-8 font-semibold tracking-tight">{title}</h1>
    </div>
  );
}

export function DetailRow({
  label,
  value,
  strong,
  last,
}: {
  readonly label: string;
  readonly value: string;
  readonly strong?: boolean;
  readonly last?: boolean;
}) {
  return (
    <div className={`flex justify-between gap-3 py-3 ${last ? "" : "border-b"}`}>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={`text-right ${strong ? "font-semibold" : ""}`}>{value}</dd>
    </div>
  );
}

/** "Product Designer · Design" over the term, in a small card. */
export function OfferSummary({ view }: { readonly view: PublicOfferView }) {
  const role = view.subteamName
    ? `${view.positionName} · ${view.subteamName}`
    : view.positionName;
  return (
    <div className="w-full rounded-xl border bg-card px-4 py-3.5 text-left text-sm">
      <div className="font-semibold">{role}</div>
      <div className="text-muted-foreground">{view.termLabel}</div>
    </div>
  );
}

export function ErrorText({ error }: { readonly error: string | null }) {
  if (!error) return null;
  return (
    <p role="alert" className="text-sm text-destructive">
      {error}
    </p>
  );
}
