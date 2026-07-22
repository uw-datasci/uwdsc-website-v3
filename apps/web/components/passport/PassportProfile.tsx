import type { PassportProfileEditValues } from "@/lib/schemas/profile";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Spinner,
} from "@uwdsc/ui";
import {
  Calendar,
  Check,
  GraduationCap,
  Hash,
  Mail,
  Pencil,
  User,
  X,
} from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { ProfileEditForm } from "./ProfileEditForm";

interface PassportProfileProps {
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  form: UseFormReturn<PassportProfileEditValues>;
  onSubmit: (data: PassportProfileEditValues) => void | Promise<void>;
  displayName: string;
  email: string;
  watIam: string;
  facultyLabel: string;
  term: string;
}

export function PassportProfile({
  isEditing,
  onEdit,
  onCancel,
  form,
  onSubmit,
  displayName,
  email,
  watIam,
  facultyLabel,
  term,
}: Readonly<PassportProfileProps>) {
  const readRows = [
    { label: "Full Name", Icon: User, value: displayName },
    { label: "Email", Icon: Mail, value: email },
    { label: "WatIAM", Icon: Hash, value: watIam },
    { label: "Faculty", Icon: GraduationCap, value: facultyLabel },
    { label: "Current Term", Icon: Calendar, value: term },
  ];

  return (
    <Card className="overflow-hidden rounded-2xl border border-white/15 bg-[#121212] text-white shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-3">
        <CardTitle className="text-base text-white/90">Profile Details</CardTitle>
        {isEditing ? (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={onCancel}
              disabled={form.formState.isSubmitting}
              className="h-8 gap-1.5 px-3 text-white/70 hover:text-white"
            >
              <X className="size-3.5" />
              Cancel
            </Button>

            <Button
              size="sm"
              type="submit"
              form="passport-profile-edit"
              disabled={form.formState.isSubmitting || !form.formState.isValid}
              className="bg-cyan-400 text-black hover:bg-cyan-300"
            >
              {form.formState.isSubmitting ? (
                <Spinner className="size-3.5" />
              ) : (
                <Check className="size-3.5" />
              )}
              Save
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={onEdit}
            className="h-8 gap-1.5 px-3 text-white/70 hover:text-white"
          >
            <Pencil className="size-3.5" />
            Edit
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {isEditing ? (
          <ProfileEditForm form={form} onSubmit={onSubmit} />
        ) : (
          <div className="space-y-2.5">
            {readRows.map(({ label, Icon, value }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/35 px-3 py-2.5"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white/8 text-white/60">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/50">
                    {label}
                  </p>
                  <p className="truncate text-sm font-medium text-white/90">{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isEditing ? (
          <div className="flex items-center justify-center gap-3 pt-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={index}
                className="size-4 rounded-full border border-white/35 bg-white/15 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]"
              />
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
