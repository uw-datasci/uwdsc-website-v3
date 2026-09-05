import Link from "next/link";
import { MembershipPaymentDrawer } from "@/components/events";
import { Button } from "@uwdsc/ui";
import { CreditCard, ChevronRight, Receipt } from "lucide-react";

interface PassportMembershipCtaProps {
  readonly profileId: string | null;
}

const CTA_CLASSES =
  "group h-auto min-h-0 w-full justify-start whitespace-normal rounded-xl border-dashed border-primary/35 bg-muted/40 px-0 py-0 text-left shadow-none transition-all duration-200 hover:border-primary/50 hover:bg-accent dark:bg-muted/40";

interface CtaBodyProps {
  readonly icon: React.ReactNode;
  readonly title: string;
  readonly subtitle: string;
}

function CtaBody({ icon, title, subtitle }: CtaBodyProps) {
  return (
    <div className="flex w-full items-center gap-4 px-5 py-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary transition-colors group-hover:bg-primary/25">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-foreground" />
    </div>
  );
}

export function MembershipCta({ profileId }: PassportMembershipCtaProps) {
  return (
    <div className="space-y-3">
      {/* Online: the member submits proof themselves and an exec reviews it. */}
      <Button asChild type="button" variant="outline" className={CTA_CLASSES}>
        <Link href="/membership">
          <CtaBody
            icon={<Receipt className="size-5" />}
            title="Paid online? Submit your proof"
            subtitle="Upload your receipt and an exec will verify your membership"
          />
        </Link>
      </Button>

      {/* In person: cash / MathSoc, verified on the spot from the QR code. */}
      <MembershipPaymentDrawer
        profileId={profileId}
        trigger={
          <Button type="button" variant="outline" className={CTA_CLASSES}>
            <CtaBody
              icon={<CreditCard className="size-5" />}
              title="Paying in person"
              subtitle="Show this QR code to a DSC exec when you pay by cash or MathSoc"
            />
          </Button>
        }
      />
    </div>
  );
}
