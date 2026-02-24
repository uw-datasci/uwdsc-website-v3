"use client";

import { useEffect, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X } from "lucide-react";
import { Button } from "@uwdsc/ui";

interface QrScannerProps {
  readonly onScan: (data: {
    event_id: string;
    membership_id: string;
    token: string;
  }) => void;
  readonly onError?: (error: string) => void;
  readonly onClose?: () => void;
}

export function QrScanner({ onScan, onError, onClose }: QrScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScanSuccess = useCallback(
    (decodedText: string) => {
      try {
        const url = new URL(decodedText);
        const event_id = url.searchParams.get("event_id");
        const membership_id = url.searchParams.get("membership_id");
        const token = url.searchParams.get("token");

        if (!event_id || !membership_id || !token) {
          onError?.("Invalid QR code: missing required fields");
          return;
        }

        // Stop scanner after successful read
        scannerRef.current?.stop().catch(() => {});
        onScan({ event_id, membership_id, token });
      } catch {
        onError?.("Invalid QR code format");
      }
    },
    [onScan, onError],
  );

  useEffect(() => {
    let mounted = true;
    const containerId = "qr-scanner-container";

    // Wait a tick to ensure DOM is ready and prevent strict mode double-start racing
    const timeoutId = setTimeout(() => {
      if (!mounted) return;

      const scanner = new Html5Qrcode(containerId);
      scannerRef.current = scanner;

      scanner
        .start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1,
          },
          handleScanSuccess,
          () => {}, // Ignore scan failures (no QR in frame)
        )
        .catch((err) => {
          if (!mounted) return; // Ignore errors if we unmounted while starting
          console.error("Failed to start QR scanner:", err);
          onError?.("Failed to access camera. Please check permissions.");
        });
    }, 100);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);

      if (scannerRef.current) {
        const scanner = scannerRef.current;
        try {
          if (scanner.isScanning) {
            scanner
              .stop()
              .then(() => {
                try {
                  scanner.clear();
                } catch {
                  /* ignore */
                }
              })
              .catch(() => {});
          } else {
            try {
              scanner.clear();
            } catch {
              /* ignore */
            }
          }
        } catch {
          // Ignore synchronous errors during stop
        }
        scannerRef.current = null;
      }
    };
  }, [handleScanSuccess, onError]);

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="flex justify-between items-center mb-4 px-2">
        <p className="font-medium">Scan QR Code</p>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-4" />
          </Button>
        )}
      </div>
      <div
        id="qr-scanner-container"
        ref={containerRef}
        className="rounded-lg overflow-hidden"
      />
      <p className="text-xs text-muted-foreground text-center mt-3">
        Point your camera at a check-in QR code
      </p>
    </div>
  );
}
