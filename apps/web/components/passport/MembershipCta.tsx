import { MembershipPaymentDrawer } from "@/components/events";
import { Button } from "@uwdsc/ui";
import { CreditCard, ChevronRight } from "lucide-react";

interface PassportMembershipCtaProps {
  readonly profileId: string | null;
}

export function MembershipCta({ profileId }: PassportMembershipCtaProps) {
  return (
    <MembershipPaymentDrawer
      profileId={profileId}
      trigger={
        <Button
          type="button"
          variant="outline"
          className="group h-auto min-h-0 w-full justify-start whitespace-normal rounded-xl border-dashed border-primary/35 bg-muted/40 px-0 py-0 text-left shadow-none transition-all duration-200 hover:border-primary/50 hover:bg-accent dark:bg-muted/40"
        >
          <div className="flex w-full items-center gap-4 px-5 py-4">
            <div className="size-10 rounded-lg bg-primary/15 flex items-center justify-center text-primary group-hover:bg-primary/25 transition-colors shrink-0">
              <CreditCard className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Pay for DSC Membership</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tap to show your payment QR code to an exec with your proof of
                payment
              </p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
        </Button>
      }
    />
  );
}
