import type { ReactNode } from "react";
import { cn } from "@uwdsc/ui";

interface OfferShellProps {
  readonly children: ReactNode;
}

/** Narrow, phone-first column below the site navbar. */
export function OfferShell({ children }: OfferShellProps) {
  return <main className="mx-auto w-full max-w-md px-5 pt-28 pb-20 lg:pt-32">{children}</main>;
}

interface OfferMessageProps {
  readonly title: string;
  readonly body: ReactNode;
  readonly icon?: ReactNode;
  readonly badge?: ReactNode;
  readonly children?: ReactNode;
  readonly tone?: "neutral" | "success" | "error";
}

const ICON_TONES = {
  neutral: "bg-muted text-muted-foreground",
  success: "bg-emerald-500/15 text-emerald-400",
  error: "bg-red-500/15 text-red-300",
} as const;

/** Centered end state: icon, badge, heading, text and an optional card below. */
export function OfferMessage({
  title,
  body,
  icon,
  badge,
  children,
  tone = "neutral",
}: OfferMessageProps) {
  return (
    <OfferShell>
      <div className="flex flex-col items-center gap-4 pt-6 text-center">
        {icon && (
          <span
            aria-hidden
            className={cn(
              "flex size-16 items-center justify-center rounded-full",
              ICON_TONES[tone]
            )}
          >
            {icon}
          </span>
        )}
        {badge}
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="max-w-xs text-[15px] leading-relaxed text-muted-foreground">{body}</p>
        {children}
      </div>
    </OfferShell>
  );
}
