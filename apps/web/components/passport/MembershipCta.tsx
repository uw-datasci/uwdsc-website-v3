import { MembershipPaymentDrawer } from "@/components/events";
import { CreditCard, ChevronRight } from "lucide-react";

interface PassportMembershipCtaProps {
  readonly profileId: string | null;
}

export function MembershipCta({ profileId }: PassportMembershipCtaProps) {
  return (
    <MembershipPaymentDrawer
      profileId={profileId}
      trigger={
        <button
          type="button"
          className="w-full text-left rounded-xl border border-dashed border-primary/35 bg-muted/40 hover:bg-accent hover:border-primary/50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 group"
        >
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="size-10 rounded-lg bg-primary/15 flex items-center justify-center text-primary group-hover:bg-primary/25 transition-colors shrink-0">
              <CreditCard className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Pay for DSC Membership</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tap to show your payment QR code to an exec with your proof of payment
              </p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
        </button>
      }
    />
  );
}
