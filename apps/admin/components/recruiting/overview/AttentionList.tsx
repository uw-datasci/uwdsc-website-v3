import Link from "next/link";
import {
  AlarmClock,
  ArrowRight,
  CircleCheckBig,
  Inbox,
  MessageSquareText,
  Send,
  TimerOff,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import type { AttentionIcon, AttentionItem, AttentionTone } from "@uwdsc/common/types";
import { cn } from "@uwdsc/ui";

const ICONS: Record<AttentionIcon, LucideIcon> = {
  send: Send,
  warn: TriangleAlert,
  expired: TimerOff,
  clock: AlarmClock,
  inbox: Inbox,
  note: MessageSquareText,
  question: MessageSquareText,
};

const TONES: Record<AttentionTone, string> = {
  want: "bg-primary/10 text-primary",
  warn: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  error: "bg-destructive/10 text-destructive",
  offer: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  review: "bg-muted text-muted-foreground",
  info: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200",
};

/** "Needs your attention": what to do next, most urgent first. */
export function AttentionList({ items }: { readonly items: readonly AttentionItem[] }) {
  return (
    <section
      data-tour="attention"
      aria-labelledby="attention-h"
      className="flex flex-col rounded-lg border"
    >
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <h2 id="attention-h" className="text-sm font-semibold">
          Needs your attention
        </h2>
        {items.length > 0 && (
          <span className="rounded-full bg-muted px-2 text-xs font-medium tabular-nums">
            {items.length}
          </span>
        )}
      </div>
      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
          <CircleCheckBig className="size-6 text-emerald-600" aria-hidden />
          <p className="text-sm font-medium">You&apos;re all caught up</p>
          <p className="text-xs text-muted-foreground">
            New items show up here as the cycle moves.
          </p>
        </div>
      ) : (
        <ul>
          {items.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <li
                key={item.id}
                className="flex items-start gap-3 border-b px-4 py-3 last:border-b-0"
              >
                <span
                  aria-hidden
                  className={cn(
                    "flex size-8 flex-none items-center justify-center rounded-lg",
                    TONES[item.tone]
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Link
                  href={item.href}
                  className="inline-flex flex-none items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10"
                >
                  {item.action}
                  <ArrowRight className="size-3" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
