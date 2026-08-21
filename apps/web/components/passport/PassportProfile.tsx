import type { PassportProfileEditValues } from "@/lib/schemas/profile";
import { Button, Card, CardContent, CardHeader, CardTitle, Spinner } from "@uwdsc/ui";
import { Calendar, Check, GraduationCap, Hash, Mail, Pencil, User, X } from "lucide-react";
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Profile Details</CardTitle>
        {isEditing ? (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={onCancel}
              disabled={form.formState.isSubmitting}
              className="gap-1.5 text-muted-foreground h-8 px-3"
            >
              <X className="size-3.5" />
              Cancel
            </Button>

            <Button
              size="sm"
              type="submit"
              form="passport-profile-edit"
              disabled={form.formState.isSubmitting || !form.formState.isValid}
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
            className="gap-1.5 text-muted-foreground hover:text-foreground h-8 px-3"
          >
            <Pencil className="size-3.5" />
            Edit
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {isEditing ? (
          <ProfileEditForm form={form} onSubmit={onSubmit} />
        ) : (
          <div className="divide-y divide-border/60">
            {readRows.map(({ label, Icon, value }) => (
              <div key={label} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="size-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
