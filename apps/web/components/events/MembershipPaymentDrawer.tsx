"use client";

import { useEffect, useState } from "react";
import * as QRCode from "qrcode";
import { Button, Sheet, SheetContent, SheetTitle, SheetTrigger } from "@uwdsc/ui";
import { QrCode as QrCodeIcon } from "lucide-react";
import Image from "next/image";

export type MembershipPaymentDrawerProps = {
  profileId: string | null;
};

export function MembershipPaymentDrawer({
  profileId,
}: Readonly<MembershipPaymentDrawerProps>) {
  const [open, setOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const adminBaseUrl =
    process.env.NEXT_PUBLIC_ADMIN_URL ?? "https://admin.uwdatascience.ca";

  useEffect(() => {
    let cancelled = false;

    if (!profileId) {
      setQrDataUrl(null);
      return;
    }

    const targetUrl = `${adminBaseUrl.replace(/\/$/, "")}/members?id=${encodeURIComponent(
      profileId,
    )}&action=markPaid`;

    QRCode.toDataURL(targetUrl)
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
  }, [profileId, adminBaseUrl]);

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
              className="relative aspect-square w-44 max-w-[80vw] rounded-lg border border-dashed border-muted-foreground/35 bg-muted/20 overflow-hidden"
            >
              {qrDataUrl ? (
                <Image
                  src={qrDataUrl}
                  alt="Membership QR code"
                  fill
                  sizes="(max-width: 80vw) 80vw, 176px"
                  className="object-cover"
                  unoptimized
                />
              ) : null}
            </div>
          </div>

          <p className="text-sm text-muted-foreground sm:text-center">
            Once you have paid, please show this QR code to a DSC exec, along
            with proof of purchase.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

