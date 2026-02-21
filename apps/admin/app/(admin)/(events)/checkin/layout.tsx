import { ReactNode } from "react";

interface CheckInLayoutProps {
  readonly children: ReactNode;
}

export default async function CheckInLayout({ children }: CheckInLayoutProps) {
  return (
    <div className="space-y-6 w-full">
      <div className="my-8">
        <h1 className="text-3xl font-bold mb-2">Event Check-in</h1>
        <p className="text-muted-foreground">
          Scan a member&apos;s QR code to check them in.
        </p>
      </div>
      
      {children}
    </div>
  );
}
