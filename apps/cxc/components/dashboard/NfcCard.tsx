"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@uwdsc/ui";
import { Copy, CheckCircle2 } from "lucide-react";

export function NfcCard() {
  const [nfcId, setNfcId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadNfcId() {
      try {
        // Get NFC ID from profile endpoint
        const response = await fetch("/api/profile");
        if (response.ok) {
          const data = await response.json();
          if (data.nfc_id) {
            setNfcId(data.nfc_id);
          } else {
            // If no NFC ID, try to generate it via admin endpoint (if user is admin)
            try {
              const adminResponse = await fetch("/api/admin/nfc");
              if (adminResponse.ok) {
                const adminData = await adminResponse.json();
                setNfcId(adminData.nfc_id);
              }
            } catch {
              // Not an admin, that's fine
            }
          }
        }
      } catch (error) {
        console.error("Error loading NFC ID:", error);
      } finally {
        setLoading(false);
      }
    }

    loadNfcId();
  }, []);

  const handleCopy = async () => {
    if (!nfcId) return;

    const baseUrl = window.location.origin;
    const checkInUrl = `${baseUrl}/admin/checkin/${nfcId}`;

    try {
      await navigator.clipboard.writeText(checkInUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  if (loading) {
    return (
      <Card className="bg-black border border-white/20 rounded-none">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="text-white uppercase tracking-wider text-sm">
            NFC Check-In
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-32 bg-white/5 animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  if (!nfcId) {
    return null;
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const checkInUrl = `${baseUrl}/admin/checkin/${nfcId}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(checkInUrl)}`;

  return (
    <Card className="bg-black border border-white/20 rounded-none">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-white uppercase tracking-wider text-sm">
          NFC Check-In
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* QR Code */}
          <div className="flex-shrink-0">
            <div className="p-4 bg-white border border-white/20">
              <Image
                src={qrCodeUrl}
                alt="QR Code for check-in"
                width={192}
                height={192}
                unoptimized
              />
            </div>
          </div>

          {/* NFC Info */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="text-white/40 text-xs uppercase tracking-wider mb-2 block">
                NFC ID
              </label>
              <div className="p-3 bg-white/5 border border-white/10 font-mono text-sm text-white break-all">
                {nfcId}
              </div>
            </div>

            <div>
              <label className="text-white/40 text-xs uppercase tracking-wider mb-2 block">
                Check-In URL
              </label>
              <div className="flex gap-2">
                <div className="flex-1 p-3 bg-white/5 border border-white/10 font-mono text-xs text-white break-all">
                  {checkInUrl}
                </div>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="icon"
                  className="border-white/20 text-white hover:bg-white hover:text-black"
                  title={copied ? "Copied!" : "Copy URL"}
                >
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <p className="text-white/60 text-sm">
              Scan this QR code or use the URL to check in at events. Write the
              URL to your NFC tag for quick access.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

