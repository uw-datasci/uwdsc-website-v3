import { Clock } from "lucide-react";
import type { PublicOfferView } from "@uwdsc/common/types";
import { formatOfferDeadline, joinNames } from "@uwdsc/common/utils";
import { Button } from "@uwdsc/ui";
import { OfferShell } from "../OfferMessage";
import { DetailRow } from "./shared";

/** Step 1: the offer's details, the deadline, and Accept / Decline. */
export function OfferOpen({
  view,
  hoursLeft,
  onAccept,
  onDecline,
}: {
  readonly view: PublicOfferView;
  readonly hoursLeft: number;
  readonly onAccept: () => void;
  readonly onDecline: () => void;
}) {
  return (
    <OfferShell>
      <div className="flex flex-col gap-5">
        <div>
          <div className="text-[13px] font-semibold text-muted-foreground">
            Exec offer · {view.termLabel}
          </div>
          <h1 className="mt-1.5 text-[26px] leading-8 font-semibold tracking-tight">
            {view.firstName}, we&apos;d like you on the team
          </h1>
        </div>

        <dl className="rounded-xl border bg-card px-4 py-1 text-[15px]">
          <DetailRow label="Role" value={view.positionName} strong />
          {view.subteamName && <DetailRow label="Subteam" value={view.subteamName} />}
          {view.vpNames.length > 0 && (
            <DetailRow
              label={`${view.isVp ? "Co-VP" : "VP"}${view.vpNames.length > 1 ? "s" : ""}`}
              value={joinNames(view.vpNames)}
            />
          )}
          <DetailRow label="Term" value={view.termLabel} last />
        </dl>

        <div className="flex items-start gap-3 rounded-xl bg-amber-500/15 px-4 py-3.5 text-amber-200">
          <Clock className="mt-0.5 size-5 flex-none" aria-hidden />
          <div>
            <div className="font-semibold">
              Respond by {formatOfferDeadline(view.expiresAt)}
            </div>
            <div className="text-sm">
              {hoursLeft >= 1
                ? `${hoursLeft} hour${hoursLeft === 1 ? "" : "s"} left. After that, the offer expires.`
                : "Less than an hour left. After that, the offer expires."}
            </div>
          </div>
        </div>

        {view.personalLine && (
          <p className="text-[15px] leading-relaxed">{view.personalLine}</p>
        )}
        <p className="-mt-2 text-sm text-muted-foreground">{view.signedBy}, Presidents</p>

        <div className="mt-1 flex flex-col gap-2.5">
          <Button size="lg" className="h-12 w-full" onClick={onAccept}>
            Accept offer
          </Button>
          <Button size="lg" variant="outline" className="h-12 w-full" onClick={onDecline}>
            Decline
          </Button>
        </div>
        <p className="text-center text-[13px] leading-normal text-muted-foreground">
          Questions? Reply to the offer email and we will get back to you.
        </p>
      </div>
    </OfferShell>
  );
}
