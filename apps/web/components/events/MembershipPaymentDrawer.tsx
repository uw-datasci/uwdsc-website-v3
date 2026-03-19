"use client";

import { useEffect, useState } from "react";
import * as QRCode from "qrcode";
import { Button, Sheet, SheetContent, SheetTitle, SheetTrigger } from "@uwdsc/ui";
import { QrCode as QrCodeIcon } from "lucide-react";

export type MembershipPaymentDrawerProps = {
  membershipId: string | null;
};

export function MembershipPaymentDrawer({
  membershipId,
}: Readonly<MembershipPaymentDrawerProps>) {
  const [open, setOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!membershipId) {
      setQrDataUrl(null);
      return;
    }

    QRCode.toDataURL(membershipId)
      .then((url) => {
        if (cancelled) return;
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error("Failed to generate membership QR code:", err);
        if (cancelled) return;
        setQrDataUrl(null);
      });

    return () => {
      cancelled = true;
    };
  }, [membershipId]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {!open ? (
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="lg"
            className="fixed bottom-4 left-1/2 z-200 -translate-x-1/2 backdrop-blur supports-backdrop-filter:bg-background/70"
          >
            <QrCodeIcon className="size-5" />
            Show Payment QR
          </Button>
        </SheetTrigger>
      ) : null}

      <SheetContent side="bottom" className="p-0 z-200">
        <SheetTitle className="sr-only">Payment QR code</SheetTitle>
        <div className="p-4 sm:p-6 flex flex-col gap-4">
          <div className="w-full flex justify-center">
            <div
              aria-label="QR code placeholder"
              className="aspect-square w-44 max-w-[80vw] rounded-lg border border-dashed border-muted-foreground/35 bg-muted/20 overflow-hidden"
            >
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Membership QR code"
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Once you have paid, please show this QR code to a DSC exec, along
            with proof of purchase.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

