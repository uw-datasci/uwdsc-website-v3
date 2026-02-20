import { QrCode } from "lucide-react";

export function LoadingState() {
  return (
    <main className="flex flex-col items-center justify-center px-4">
      <QrCode className="size-12 text-muted-foreground animate-pulse mb-4" />
      <p className="text-muted-foreground">Loading...</p>
    </main>
  );
}
