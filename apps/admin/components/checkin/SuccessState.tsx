import { useState } from "react";
import {
  CheckCircle2,
  User,
  GraduationCap,
  Calendar,
  BookOpen,
} from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@uwdsc/ui";
import type { Profile } from "@uwdsc/common/types";

interface SuccessStateProps {
  readonly profile: Profile;
  readonly onUncheckIn: () => void;
  readonly isUnchecking: boolean;
}

export function SuccessState({
  profile,
  onUncheckIn,
  isUnchecking,
}: SuccessStateProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="flex flex-col items-center text-center">
      <div className="rounded-2xl border bg-card p-8 max-w-md w-full shadow-sm">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="size-12 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold mb-1">Checked In!</h2>
        <p className="text-sm text-muted-foreground mb-6">
          The member has been successfully checked in.
        </p>

        {/* Member details */}
        <div className="text-left space-y-3 text-sm border-t pt-4">
          <InfoRow
            icon={<User className="size-4" />}
            label="Name"
            value={`${profile.first_name} ${profile.last_name}`}
          />
          <InfoRow
            icon={<BookOpen className="size-4" />}
            label="WatIAM"
            value={profile.wat_iam ?? "—"}
          />

          <InfoRow
            icon={<GraduationCap className="size-4" />}
            label="Faculty"
            value={profile.faculty ?? "—"}
          />
          <InfoRow
            icon={<Calendar className="size-4" />}
            label="Term"
            value={profile.term ?? "—"}
          />
        </div>

        {/* Uncheck-in */}
        <div className="mt-6 border-t pt-4">
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={() => setConfirmOpen(true)}
          >
            Uncheck In
          </Button>
        </div>
      </div>

      {/* Confirmation dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Uncheck In</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will remove {profile.first_name} {profile.last_name}&apos;s
            attendance record for this event. Are you sure?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmOpen(false);
                onUncheckIn();
              }}
              disabled={isUnchecking}
            >
              {isUnchecking ? "Removing..." : "Remove Attendance"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoRow({
  icon,
  label,
  value,
}: Readonly<InfoRowProps>) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
