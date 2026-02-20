import Image from "next/image";
import type { Event, Profile } from "@uwdsc/common/types";

interface ActiveEventStateProps {
  readonly activeEvent: Event;
  readonly user: Profile;
  readonly qrDataUrl: string;
  readonly countdown: number;
}

export function ActiveEventState({
  activeEvent,
  user,
  qrDataUrl,
  countdown,
}: ActiveEventStateProps) {
  return (
    <main className="flex flex-col items-center justify-center px-4 text-center">
      <div className="rounded-2xl border bg-card p-8 max-w-md w-full shadow-sm">
        {/* Event name */}
        <h1 className="text-xl font-bold mb-4">{activeEvent.name}</h1>

        {/* QR Code */}
        <div className="relative mx-auto mb-4">
          {qrDataUrl ? (
            <Image
              src={qrDataUrl}
              alt="Check-in QR Code"
              className="mx-auto rounded-lg"
              width={280}
              height={280}
            />
          ) : (
            <div className="mx-auto h-70 w-70 rounded-lg bg-muted animate-pulse" />
          )}
        </div>

        {/* Countdown */}
        <p className="text-xs text-muted-foreground mb-4">
          Refreshes in{" "}
          <span className="font-mono font-medium text-foreground">
            {countdown}s
          </span>
        </p>

        {/* Instruction */}
        <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 mb-6">
          <p className="text-sm font-medium text-primary">
            Show this QR code to an exec to check in
          </p>
        </div>

        {/* User info */}
        <div className="text-left space-y-2 text-sm border-t pt-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">
              {user.first_name} {user.last_name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">WatIAM</span>
            <span className="font-medium">{user.wat_iam}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
