"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@uwdsc/ui";
import { QrCode, X, Camera } from "lucide-react";

interface QrScannerProps {
  onScan: (result: string) => void;
  onClose?: () => void;
}

export function QrScanner({ onScan, onClose }: QrScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const stopScanning = async () => {
    // Stop html5-qrcode if it's running
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const html5QrCode = new Html5Qrcode("qr-reader");
      // Check if scanning by trying to stop (will throw if not scanning)
      try {
        await html5QrCode.stop();
      } catch {
        // Not scanning, that's fine
      }
    } catch {
      // Ignore errors if library not loaded
    }
    setIsScanning(false);
  };

  const startScanning = async () => {
    try {
      setError(null);
      setIsScanning(true);

      // Use html5-qrcode library if available
      try {
        // Dynamic import of html5-qrcode
        const { Html5Qrcode } = await import("html5-qrcode");
        const html5QrCode = new Html5Qrcode("qr-reader");

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            html5QrCode.stop().catch(console.error);
            stopScanning();
            onScan(decodedText);
          },
          () => {
            // Ignore scanning errors - they're expected during scanning
          }
        );
      } catch (importError) {
        // Fallback: show error message
        console.error("Failed to load QR scanner:", importError);
        setError(
          "QR scanner library not available. Please install html5-qrcode: pnpm add html5-qrcode"
        );
        setIsScanning(false);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Failed to access camera. Please allow camera permissions.");
      setIsScanning(false);
    }
  };

  const handleClose = () => {
    stopScanning();
    if (onClose) {
      onClose();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Scan QR Code</CardTitle>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-4 rounded-md bg-red-500/10 text-red-500 border border-red-500/20">
            {error}
          </div>
        )}

        {!isScanning ? (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-md">
            <QrCode className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4 text-center">
              Click the button below to start scanning QR codes
            </p>
            <Button onClick={startScanning}>
              <Camera className="mr-2 h-4 w-4" />
              Start Scanner
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div id="qr-reader" className="w-full min-h-[300px]" />
            <Button onClick={stopScanning} variant="outline" className="w-full">
              Stop Scanning
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

